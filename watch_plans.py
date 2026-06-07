#!/usr/bin/env python3
"""
Watcher de planos — detecta planos publicados pelo Grok Build.

Localização: raiz do projeto (versionado)
Monitora:     .cursor/plans/{task_id}.md

Modos:
  --notify-only (padrão)  notifica + grava prompt para implementar no Cursor IDE
  --run-agent               dispara agent CLI headless (terminal, fora do IDE)
  --dry-run                 simula sem executar

Dependência:  pip install -r requirements-watch.txt

Execução:
  python watch_plans.py
  python watch_plans.py --notify-only
  python watch_plans.py --run-agent
  python watch_plans.py --once feat-contact-validation

Background (PowerShell):
  Start-Process -WindowStyle Hidden -FilePath "python" `
    -ArgumentList "watch_plans.py" `
    -WorkingDirectory "C:/path/to/Portfolio"
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

from watchdog.events import FileSystemEvent, FileSystemEventHandler
from watchdog.observers import Observer

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("watch-plans")

_PLAN_FILE_PATTERN = re.compile(r"^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}\.md$")
_IGNORED_FILES = frozenset({".gitkeep"})


def resolve_workspace_root(explicit: str | None = None) -> Path:
    """Resolve a raiz do projeto. Este script vive na raiz do repositório."""
    if explicit:
        return Path(explicit).resolve()

    for key in ("WORKSPACE_FOLDER", "CURSOR_WORKSPACE"):
        raw = os.environ.get(key, "").strip()
        if raw:
            return Path(raw).resolve()

    script_dir = Path(__file__).resolve().parent
    if (script_dir / ".cursor").is_dir():
        return script_dir

    cwd = Path.cwd().resolve()
    if (cwd / ".cursor").is_dir():
        return cwd

    raise RuntimeError(
        "Não foi possível resolver o workspace. "
        "Execute na raiz do projeto ou defina WORKSPACE_FOLDER."
    )


def state_file(root: Path) -> Path:
    return root / ".cursor" / "plans" / ".watcher-state.json"


def load_state(root: Path) -> dict:
    path = state_file(root)
    if not path.exists():
        return {"processed": {}}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        logger.warning("Estado do watcher corrompido; reiniciando.")
        return {"processed": {}}


def save_state(root: Path, state: dict) -> None:
    path = state_file(root)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(state, indent=2) + "\n", encoding="utf-8")


def is_main_plan_file(path: Path) -> bool:
    name = path.name
    if name in _IGNORED_FILES or name.startswith("."):
        return False
    if re.search(r"\.v\d+\.md$", name):
        return False
    return bool(_PLAN_FILE_PATTERN.match(name))


def task_id_from_path(path: Path) -> str:
    return path.stem


def find_agent_command() -> list[str]:
    for name in ("agent", "cursor-agent"):
        resolved = shutil.which(name)
        if resolved:
            return [resolved]

    local_app = os.environ.get("LOCALAPPDATA", "")
    for candidate in (
        Path(local_app) / "Programs" / "cursor" / "agent.exe",
        Path(local_app) / "cursor-agent" / "agent.exe",
    ):
        if candidate.exists():
            return [str(candidate)]

    raise FileNotFoundError(
        "Cursor CLI não encontrado. Instale:\n"
        "  irm 'https://cursor.com/install?win32=true' | iex"
    )


def pending_file(root: Path) -> Path:
    return root / ".cursor" / "plans" / ".pending-implementation.json"


def build_cursor_ide_prompt(task_id: str) -> str:
    """Prompt curto para colar no chat do Cursor IDE."""
    return (
        f"Siga plan-orchestration. Use plan-broker get_plan com task_id "
        f'"{task_id}" e implemente o plano publicado pelo Grok Build.'
    )


def build_agent_prompt(root: Path, task_id: str, plan_path: Path) -> str:
    rel_plan = plan_path.relative_to(root).as_posix()
    return f"""# Orquestração de plano — Grok Build → Cursor (Nível 2)

Plano publicado via PlanBroker MCP (servidor em ~/mcp-servers/plan-broker/).

## Identificação
- **task_id:** `{task_id}`
- **arquivo:** `{rel_plan}`

## Instruções obrigatórias

1. **Ler o plano** via MCP `plan-broker` → `get_plan("{task_id}")` ou arquivo `{rel_plan}`.
2. **Regras:** `AGENTS.md`, `ACCEPTANCE_CRITERIA.md`, `.cursor/rules/plan-orchestration.md`.
3. **Implementar** passo a passo; subagentes paralelos só para áreas independentes.
4. **Validar:** dotnet build/test (backend), npm lint/build (frontend).
5. **Encerrar** com resumo; não commitar sem pedido explícito.

Comece lendo o plano e confirme os passos antes de editar código.
"""


def run_cursor_agent(
    root: Path,
    task_id: str,
    plan_path: Path,
    *,
    dry_run: bool = False,
    force: bool = True,
) -> int:
    prompt = build_agent_prompt(root, task_id, plan_path)

    if dry_run:
        logger.info("[dry-run] Dispararia agent para task_id=%s", task_id)
        logger.info("[dry-run] Prompt: %d chars", len(prompt))
        try:
            cmd = find_agent_command()
            logger.info("[dry-run] CLI: %s -p --force ...", cmd[0])
        except FileNotFoundError:
            logger.warning("[dry-run] Cursor CLI não instalado")
        return 0

    agent_cmd = find_agent_command()
    cmd = [*agent_cmd, "-p", "--output-format", "text"]
    if force:
        cmd.append("--force")
    cmd.append(prompt)

    logger.info("Disparando Cursor Agent: task_id=%s", task_id)
    env = os.environ.copy()
    env.setdefault("WORKSPACE_FOLDER", str(root))

    return subprocess.run(cmd, cwd=str(root), env=env, text=True).returncode


def notify_plan_ready(
    root: Path,
    task_id: str,
    plan_path: Path,
    *,
    dry_run: bool = False,
) -> int:
    """
    Modo notify-only: não dispara agent CLI.
    Grava prompt pendente, exibe no log e tenta notificação Windows.
    """
    rel_plan = plan_path.relative_to(root).as_posix()
    ide_prompt = build_cursor_ide_prompt(task_id)

    if dry_run:
        logger.info("[dry-run] Notificaria plano: %s", task_id)
        logger.info("[dry-run] Prompt IDE: %s", ide_prompt)
        return 0

    payload = {
        "task_id": task_id,
        "plan_path": rel_plan,
        "cursor_prompt": ide_prompt,
        "notified_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "status": "awaiting_cursor_ide",
    }
    pending_file(root).write_text(
        json.dumps(payload, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    banner = (
        f"\n{'=' * 60}\n"
        f"  PLANO PRONTO PARA IMPLEMENTAR NO CURSOR IDE\n"
        f"  task_id: {task_id}\n"
        f"  arquivo: {rel_plan}\n"
        f"\n"
        f"  Cole no chat do Cursor:\n"
        f"  {ide_prompt}\n"
        f"{'=' * 60}\n"
    )
    print(banner, flush=True)
    logger.info("Plano %s aguardando implementação no Cursor IDE", task_id)

    _try_windows_toast(task_id)
    _try_copy_clipboard(ide_prompt)
    return 0


def _try_windows_toast(task_id: str) -> None:
    """Notificação balloon no Windows (sem dependências extras)."""
    if sys.platform != "win32":
        return
    title = "Portfolio — Plano pronto"
    message = f"{task_id}: implemente no Cursor IDE"
    ps = (
        "Add-Type -AssemblyName System.Windows.Forms; "
        "Add-Type -AssemblyName System.Drawing; "
        "$n = New-Object System.Windows.Forms.NotifyIcon; "
        "$n.Icon = [System.Drawing.SystemIcons]::Information; "
        f"$n.BalloonTipTitle = '{title}'; "
        f"$n.BalloonTipText = '{message}'; "
        "$n.Visible = $true; "
        "$n.ShowBalloonTip(8000); "
        "Start-Sleep -Seconds 2; "
        "$n.Dispose()"
    )
    try:
        subprocess.run(
            ["powershell", "-NoProfile", "-Command", ps],
            capture_output=True,
            timeout=10,
        )
    except (OSError, subprocess.TimeoutExpired):
        logger.debug("Toast Windows indisponível")


def _try_copy_clipboard(text: str) -> None:
    """Copia o prompt para a área de transferência no Windows."""
    if sys.platform != "win32":
        return
    escaped = text.replace("'", "''")
    ps = f"Set-Clipboard -Value '{escaped}'"
    try:
        subprocess.run(
            ["powershell", "-NoProfile", "-Command", ps],
            capture_output=True,
            timeout=5,
        )
        logger.info("Prompt copiado para a área de transferência")
    except (OSError, subprocess.TimeoutExpired):
        logger.debug("Clipboard indisponível")


def handle_plan(
    root: Path,
    task_id: str,
    plan_path: Path,
    *,
    dry_run: bool = False,
    notify_only: bool = True,
    run_agent: bool = False,
) -> int:
    if run_agent:
        return run_cursor_agent(root, task_id, plan_path, dry_run=dry_run)
    return notify_plan_ready(root, task_id, plan_path, dry_run=dry_run)


class PlanWatcherHandler(FileSystemEventHandler):
    def __init__(
        self,
        root: Path,
        *,
        dry_run: bool = False,
        notify_only: bool = True,
        run_agent: bool = False,
        debounce: float = 2.0,
    ) -> None:
        super().__init__()
        self.root = root
        self.dry_run = dry_run
        self.notify_only = notify_only
        self.run_agent = run_agent
        self.debounce = debounce
        self._pending: dict[str, float] = {}
        self._state = load_state(root)

    def _should_process(self, path: Path) -> bool:
        if not path.is_file() or not is_main_plan_file(path):
            return False
        try:
            mtime = path.stat().st_mtime
        except OSError:
            return False
        task_id = task_id_from_path(path)
        last = self._state.get("processed", {}).get(task_id)
        return not (last is not None and mtime <= float(last))

    def _schedule(self, path: Path) -> None:
        self._pending[task_id_from_path(path)] = time.monotonic() + self.debounce

    def flush_pending(self) -> None:
        now = time.monotonic()
        for task_id in [t for t, d in self._pending.items() if now >= d]:
            del self._pending[task_id]
            plan_path = self.root / ".cursor" / "plans" / f"{task_id}.md"
            if plan_path.exists() and self._should_process(plan_path):
                self._process(plan_path)

    def _process(self, plan_path: Path) -> None:
        task_id = task_id_from_path(plan_path)
        mode = "run-agent" if self.run_agent else "notify-only"
        logger.info("Plano detectado (%s): %s", mode, plan_path.name)
        code = handle_plan(
            self.root,
            task_id,
            plan_path,
            dry_run=self.dry_run,
            notify_only=self.notify_only,
            run_agent=self.run_agent,
        )
        if code == 0:
            self._state.setdefault("processed", {})[task_id] = plan_path.stat().st_mtime
            save_state(self.root, self._state)
            logger.info("Concluído (%s): %s", mode, task_id)
        else:
            logger.error("Falha (exit %s): %s", code, task_id)

    def on_created(self, event: FileSystemEvent) -> None:
        if not event.is_directory and is_main_plan_file(Path(event.src_path)):
            self._schedule(Path(event.src_path))

    def on_modified(self, event: FileSystemEvent) -> None:
        if not event.is_directory and is_main_plan_file(Path(event.src_path)):
            self._schedule(Path(event.src_path))


def main() -> None:
    parser = argparse.ArgumentParser(description="Watcher Grok Build → Cursor")
    parser.add_argument(
        "--run-agent",
        action="store_true",
        help="Dispara agent CLI headless (padrão: --notify-only).",
    )
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--once", metavar="TASK_ID")
    parser.add_argument("--workspace", help="Caminho do projeto (opcional)")
    parser.add_argument("--debounce", type=float, default=2.0)
    args = parser.parse_args()

    try:
        root = resolve_workspace_root(args.workspace)
    except RuntimeError as exc:
        logger.error("%s", exc)
        sys.exit(1)

    watch_dir = root / ".cursor" / "plans"
    watch_dir.mkdir(parents=True, exist_ok=True)
    mode_label = "run-agent" if args.run_agent else "notify-only"
    logger.info("Workspace: %s", root)
    logger.info("Monitorando: %s (%s)", watch_dir, mode_label)

    if args.once:
        plan_path = watch_dir / f"{args.once}.md"
        if not plan_path.exists():
            logger.error("Plano não encontrado: %s", plan_path)
            sys.exit(1)
        sys.exit(
            handle_plan(
                root,
                args.once,
                plan_path,
                dry_run=args.dry_run,
                run_agent=args.run_agent,
            )
        )

    handler = PlanWatcherHandler(
        root,
        dry_run=args.dry_run,
        notify_only=not args.run_agent,
        run_agent=args.run_agent,
        debounce=args.debounce,
    )
    observer = Observer()
    observer.schedule(handler, str(watch_dir), recursive=False)
    observer.start()
    logger.info("Watcher ativo — modo %s (Ctrl+C para parar).", mode_label)

    try:
        while True:
            handler.flush_pending()
            time.sleep(0.5)
    except KeyboardInterrupt:
        logger.info("Encerrando.")
    finally:
        observer.stop()
        observer.join()


if __name__ == "__main__":
    main()
