# Plan Broker — Guia completo de uso (Grok Build → Cursor)

Manual de referência para **agentes de planejamento** (Grok Build) e **agentes de implementação** (Cursor) no fluxo **Nível 2** deste repositório.

> **Complemento de setup:** para instalação única, arquitetura e diagrama, leia primeiro [SETUP_MCP_FLOW.md](SETUP_MCP_FLOW.md). Este guia foca em **uso diário**, **publicação obrigatória**, **todos os comandos** e **integração com Notion**.

---

## 1. Visão geral e modelo mental

### O que é o fluxo

```txt
Grok Build (planejamento)
    │
    ├─► MCP publish_plan (HTTP ou stdio)
    │       │
    │       ▼
    │   ~/mcp-servers/plan-broker/plan_broker.py
    │       │
    │       ▼
    │   {WORKSPACE}/.cursor/plans/{task_id}.md
    │   {WORKSPACE}/.cursor/plans/index.json
    │
    ▼
watch_plans.py (watcher)
    │
    ├─► notify-only (padrão): toast + clipboard + prompt para Cursor IDE
    └─► --run-agent: dispara `agent -p` headless

Cursor (implementação)
    │
    ├─► MCP get_plan(task_id)  — via plan-broker global
    └─► fallback: ler .cursor/plans/{task_id}.md diretamente
```

### Peças do sistema

| Peça | Local | Função |
|------|-------|--------|
| PlanBroker MCP | `~/mcp-servers/plan-broker/` | Publica e consulta planos |
| MCP global Cursor | `~/.cursor/mcp.json` | Registra `plan-broker` (stdio) |
| MCP projeto | `.cursor/mcp.json` | **Vazio** — servers ficam no global |
| Planos | `.cursor/plans/` | Markdown + `index.json` por projeto |
| Permissões | `.cursor/permissions.json` | Auto-approve das 4 tools |
| Regra Cursor | `.cursor/rules/plan-orchestration.md` | Contrato do agente implementador |
| Watcher | `watch_plans.py` (raiz) | Detecta novos planos |
| Scripts ops | `scripts/*.ps1`, `scripts/fix-grok-mcp.sh` | Setup, start/stop, verify, Grok/WSL |

### Variável crítica: `WORKSPACE_FOLDER`

O broker vive **fora** do repositório. Ele precisa saber **qual projeto** recebe os planos:

```powershell
# PowerShell (teste manual)
$env:WORKSPACE_FOLDER = "C:\Users\lucas\Documents\Projects\Portfolio"
```

```bash
# bash / WSL / Grok CLI
export WORKSPACE_FOLDER="/mnt/c/Users/lucas/Documents/Projects/Portfolio"
```

**Precedência de resolução** (em `plan_broker.py` e `watch_plans.py`):

1. `WORKSPACE_FOLDER` (env)
2. `CURSOR_WORKSPACE` (alias)
3. Diretório do script / cwd se contiver `.cursor/`
4. Erro explícito (broker externo sem env)

---

## 2. Contrato obrigatório — agentes de planejamento

> **⚠️ NUNCA encerre uma sessão de planejamento sem publicar o plano e confirmar `"status": "ok"`.**

Você está em **modo plano** (Grok Build). Ao finalizar:

| # | Ação |
|---|------|
| 1 | Escreva o plano final completo (Markdown com contexto, passos, arquivos, testes, validação) |
| 2 | Escolha um `task_id` em **kebab-case** descritivo (ex.: `feat-contact-validation`, `docs-plan-broker-usage-notion`) |
| 3 | **Grok Build:** `search_tool` com query `"plan-broker"` ou `"publish_plan"` para descobrir nomes qualificados |
| 4 | **Grok Build:** `use_tool` com `plan-broker__publish_plan` (veja exemplo abaixo) |
| 5 | Aguarde resposta e confirme `"status": "ok"` + anote `version`, `path`, `workspace` |
| 6 | **Somente então** chame `exit_plan_mode` |

### Regras de `task_id`

- 1–128 caracteres: letras, números, `.`, `_`, `-`
- Kebab-case descritivo e único por tarefa lógica
- **Republicar o mesmo `task_id`:** arquiva a versão anterior como `{task_id}.v{N}.md` e incrementa `version` no `index.json`

### Exemplo — Grok Build (`use_tool`)

```json
{
  "tool_name": "plan-broker__publish_plan",
  "tool_input": {
    "plan_markdown": "# Meu Plano\n\n## Contexto\n...\n\n## Passos\n1. ...",
    "task_id": "feat-contact-validation",
    "metadata": {
      "source": "grok-build",
      "areas": ["backend", "frontend"],
      "priority": "normal",
      "origin": "planning-agent"
    }
  }
}
```

**Resposta esperada (sucesso):**

```json
{
  "status": "ok",
  "action": "created",
  "task_id": "feat-contact-validation",
  "version": 1,
  "workspace": "C:\\Users\\lucas\\Documents\\Projects\\Portfolio",
  "path": ".cursor/plans/feat-contact-validation.md",
  "title": "Meu Plano",
  "updated_at": "2026-06-07T19:43:19.684452+00:00"
}
```

### Exemplo — Cursor (implementação)

Prompt para o agente Cursor:

```markdown
Siga plan-orchestration. Use plan-broker get_plan com task_id "feat-contact-validation" e implemente o plano publicado pelo Grok Build.
```

Ou leia o arquivo diretamente se o MCP não estiver disponível:

```txt
.cursor/plans/feat-contact-validation.md
```

### Fallback quando o broker MCP não responde

1. Grave manualmente o conteúdo em `.cursor/plans/{task_id}.md`
2. Atualize `.cursor/plans/index.json` (ou deixe o próximo `publish_plan` bem-sucedido corrigir)
3. Dispare o watcher manualmente:

```powershell
cd C:\Users\lucas\Documents\Projects\Portfolio
python watch_plans.py --once feat-contact-validation --dry-run
```

---

## 3. Comandos e cenários (copy-paste)

### 3.1 Setup único (Windows / Cursor)

```powershell
cd C:\Users\lucas\Documents\Projects\Portfolio
.\scripts\setup-mcp-flow.ps1
.\scripts\verify-mcp-flow.ps1
```

**Manual obrigatório (não automatizável):**

- `agent login` — autenticação Cursor CLI
- Cursor Settings → Run Mode → **Auto-review** (ou Allowlist)

### 3.2 Operação diária (Windows)

```powershell
# Iniciar stack (HTTP para Grok + watcher notify-only)
.\scripts\start-mcp-flow.ps1

# Opções
.\scripts\start-mcp-flow.ps1 -Workspace "C:\Users\lucas\Documents\Projects\Portfolio"
.\scripts\start-mcp-flow.ps1 -NoWatch              # só HTTP, sem watcher
.\scripts\start-mcp-flow.ps1 -DryRunWatch          # watcher simula (não executa ações)
.\scripts\start-mcp-flow.ps1 -RunAgent             # watcher dispara agent CLI headless
.\scripts\start-mcp-flow.ps1 -Port 8765

# Parar
.\scripts\stop-mcp-flow.ps1

# Trocar projeto ativo
.\scripts\switch-mcp-workspace.ps1 -Workspace "C:\path\to\outro-projeto"

# Verificar saúde
.\scripts\verify-mcp-flow.ps1
```

#### Tabela de flags — `start-mcp-flow.ps1`

| Flag | Efeito |
|------|--------|
| `-Workspace` | Define projeto alvo (default: raiz do repo com `.cursor/`) |
| `-Port` | Porta HTTP do broker (default: 8765) |
| `-NoWatch` | Não inicia `watch_plans.py` |
| `-DryRunWatch` | Watcher em modo simulação |
| `-RunAgent` | Watcher dispara `agent -p` (headless) |
| `-Watch` | Força watcher mesmo se `-NoWatch` não foi usado |

PIDs salvos em `.cursor/plans/.mcp-flow.pids`.

### 3.3 Grok Build / WSL

O Grok CLI usa stdio MCP (não HTTP). Corrija registro quebrado:

```bash
cd /mnt/c/Users/lucas/Documents/Projects/Portfolio
./scripts/fix-grok-mcp.sh
```

**Antes de rodar:** edite `scripts/fix-grok-mcp.sh` se `PROJECT` apontar para caminho antigo. O valor correto neste repo:

```bash
PROJECT="/mnt/c/Users/lucas/Documents/Projects/Portfolio"
```

**Registro manual (alternativa):**

```bash
BROKER="/mnt/c/Users/lucas/mcp-servers/plan-broker"
VENV_PYTHON="${BROKER}/.venv/bin/python"
PROJECT="/mnt/c/Users/lucas/Documents/Projects/Portfolio"

grok mcp remove plan-broker 2>/dev/null || true
grok mcp add plan-broker \
  --command "$VENV_PYTHON" \
  --args "$BROKER/plan_broker.py" \
  --env "WORKSPACE_FOLDER=$PROJECT"

grok mcp list
```

**Debug (se `unavailable`):**

```bash
grok mcp remove plan-broker
grok mcp add plan-broker \
  --command bash \
  --args /mnt/c/Users/lucas/mcp-servers/plan-broker/grok-mcp-debug.sh \
  --env WORKSPACE_FOLDER=/mnt/c/Users/lucas/Documents/Projects/Portfolio
cat /tmp/plan-broker-grok.log
```

Depois: feche o Grok completamente → reabra no diretório do projeto → `/mcps` ou refresh MCP Servers.

**Grok via HTTP (alternativa):**

1. `.\scripts\start-mcp-flow.ps1` no Windows
2. Configure MCP no Grok: `http://127.0.0.1:8765/mcp`

### 3.4 Python direto (testes / MCP indisponível)

```powershell
$env:WORKSPACE_FOLDER = "C:\Users\lucas\Documents\Projects\Portfolio"
cd $HOME\mcp-servers\plan-broker

python -c @"
from plan_broker import publish_plan, get_plan, list_plans, get_latest_plan
r = publish_plan('# Test\n\n## Objetivo\nTeste manual.', 'test-manual-e2e', {'source': 'manual'})
print('publish:', r)
print('get:', get_plan('test-manual-e2e'))
print('latest:', get_latest_plan())
print('list:', list_plans())
"@
```

```bash
export WORKSPACE_FOLDER="/mnt/c/Users/lucas/Documents/Projects/Portfolio"
cd /mnt/c/Users/lucas/mcp-servers/plan-broker
python -c "from plan_broker import list_plans; print(list_plans())"
```

### 3.5 Watcher standalone

```powershell
cd C:\Users\lucas\Documents\Projects\Portfolio

# Monitor contínuo (notify-only — padrão)
python watch_plans.py

# Uma execução para task_id específico
python watch_plans.py --once docs-plan-broker-usage-notion

# Simular sem executar ações
python watch_plans.py --once docs-plan-broker-usage-notion --dry-run

# Disparar agent CLI
python watch_plans.py --once docs-plan-broker-usage-notion --run-agent

# Workspace explícito
python watch_plans.py --workspace "C:\Users\lucas\Documents\Projects\Portfolio"
```

### 3.6 Sequência Grok Build — sessão de planejamento completa

```markdown
1. Abrir Grok Build no diretório do Portfolio (WSL ou Windows)
2. Confirmar plan-broker disponível: search_tool "plan-broker"
3. Planejar (modo plano) — gerar plan.md com BDD, passos, arquivos, testes
4. use_tool plan-broker__publish_plan (plan_markdown, task_id, metadata)
5. Confirmar status "ok"
6. exit_plan_mode
7. (Opcional) Notificar Cursor: watcher já copia prompt ou peça manualmente:
   "Siga plan-orchestration. Use plan-broker get_plan com task_id \"{task_id}\" ..."
```

### 3.7 Sequência Cursor — implementação

```markdown
1. Agente lê plan-orchestration (.cursor/rules/plan-orchestration.md)
2. get_plan(task_id) via MCP ou leitura direta de .cursor/plans/{task_id}.md
3. Confirmar passos e ordem ao usuário (mensagem curta)
4. Implementar somente o escopo do plano
5. Validar (dotnet/npm/docker conforme área)
6. Entregar resumo — NÃO commitar sem pedido explícito
```

### 3.8 Teste end-to-end documentado

```powershell
.\scripts\setup-mcp-flow.ps1
.\scripts\verify-mcp-flow.ps1
.\scripts\start-mcp-flow.ps1 -DryRunWatch

$env:WORKSPACE_FOLDER = (Get-Location).Path
cd $HOME\mcp-servers\plan-broker
python -c "from plan_broker import publish_plan; print(publish_plan('# Test E2E','test-e2e',{'source':'verify'}))"

cd C:\Users\lucas\Documents\Projects\Portfolio
python watch_plans.py --once test-e2e --dry-run

.\scripts\stop-mcp-flow.ps1
```

No Cursor:

```markdown
Use plan-broker get_plan com task_id "test-e2e"
```

---

## 4. Referência das tools MCP

### Nomes qualificados (Grok Build)

Descobertos via `search_tool`:

| Tool qualificada | Função |
|------------------|--------|
| `plan-broker__publish_plan` | Publica plano + metadados |
| `plan-broker__get_plan` | Retorna plano por `task_id` |
| `plan-broker__get_latest_plan` | Plano mais recente (`latest_task_id`) |
| `plan-broker__list_plans` | Lista metadados de todos os planos |

### Nomes no Cursor (`permissions.json`)

| Allowlist entry | Equivalente |
|-----------------|-------------|
| `plan-broker:publish_plan` | `publish_plan` |
| `plan-broker:get_plan` | `get_plan` |
| `plan-broker:get_latest_plan` | `get_latest_plan` |
| `plan-broker:list_plans` | `list_plans` |

> Grok usa `plan-broker__*` (duplo underscore). Cursor allowlist usa `plan-broker:*` (dois pontos).

### Schemas de entrada

#### `publish_plan`

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `plan_markdown` | string | sim | Plano completo em Markdown |
| `task_id` | string | sim | Identificador kebab-case |
| `metadata` | object \| null | não | Metadados livres (convenções abaixo) |

#### `get_plan`

| Parâmetro | Tipo | Obrigatório |
|-----------|------|-------------|
| `task_id` | string | sim |

#### `get_latest_plan` / `list_plans`

Sem parâmetros obrigatórios.

### Resposta de sucesso — `get_plan`

Inclui campos de metadados **e** `plan_markdown` completo:

```json
{
  "status": "ok",
  "task_id": "docs-plan-broker-usage-notion",
  "filename": "docs-plan-broker-usage-notion.md",
  "title": "Plan: Complete Plan-Broker + publish_plan Documentation + Notion Integration",
  "version": 1,
  "metadata": { "source": "grok-build", "areas": ["documentation", "ops"] },
  "plan_markdown": "# Plan: ..."
}
```

### Resposta de erro

```json
{
  "status": "error",
  "message": "task_id inválido. Use 1–128 caracteres: ..."
}
```

### Convenções de `metadata`

Campos observados em `.cursor/plans/index.json`:

| Campo | Exemplo | Uso |
|-------|---------|-----|
| `source` | `"grok-build"`, `"verify"`, `"manual"` | Origem do plano |
| `areas` | `["backend", "documentation"]` | Áreas afetadas |
| `priority` | `"normal"`, `"high"` | Prioridade |
| `origin` | `"planning-agent"` | Papel do agente |
| `review_focus` | `"md-structure-legibility-and-organization"` | Foco de revisão |

---

## 5. Versionamento, workspaces, estado e segurança

### Versionamento de planos

- Primeira publicação: `{task_id}.md`, `version: 1`
- Republicação: `{task_id}.md` anterior → `{task_id}.v{N}.md`, `version` incrementado
- `index.json` mantém `latest_task_id` apontando para o último publicado

### Arquivos de estado

| Arquivo | Conteúdo |
|---------|----------|
| `.cursor/plans/index.json` | Índice de todos os planos |
| `.cursor/plans/.mcp-flow.pids` | PIDs do broker HTTP + watcher |
| `.cursor/plans/.active-workspace` | Workspace ativo (multi-projeto) |
| `.cursor/plans/.watcher-state.json` | Estado do watcher (planos já processados) |
| `.cursor/plans/.pending-implementation.json` | Prompt pendente para implementação (notify mode) |

### Multi-projeto

```powershell
.\scripts\switch-mcp-workspace.ps1 -Workspace "C:\path\to\outro-projeto"
# ou
.\scripts\start-mcp-flow.ps1 -Workspace "C:\path\to\outro-projeto"
```

Cada projeto tem seu próprio `.cursor/plans/` — o broker **nunca** mistura planos entre repos.

### Segurança

| Risco | Mitigação |
|-------|-----------|
| Secrets no plano | **Nunca** incluir tokens, senhas, `.env`, URLs privadas |
| HTTP exposto | Broker HTTP escuta apenas `127.0.0.1` |
| `agent --force` | Usar apenas em ambiente confiável |
| MCP auto-run | Requer Run Mode + `.cursor/permissions.json` |
| Notion token | Guardar em env / Cursor secrets — **nunca** no git |

---

## 6. Integração Notion — "coloque lá tudo que é necessário fazer"

### Por quê Notion

- Base de conhecimento **pesquisável** e **comentável** fora do clone git
- Visão unificada de workflows de IA, planos publicados e runbooks
- Complemento ao Markdown versionado no repositório

**Política de sync:** arquivos em `docs/ops/` (e governança na raiz) são **fonte da verdade** em git/PRs. Notion é artefato derivado para conveniência e colaboração.

### Pré-requisitos

1. **Integração Notion** — criar em [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. **Compartilhar páginas** com a integração (Invite → selecionar a integration)
3. **MCP Notion** — registrar no Cursor e/ou Grok (padrão igual ao plan-broker)

### Registro MCP Notion — Cursor (global)

Adicionar em `~/.cursor/mcp.json` (ou via Cursor Settings → MCP):

```json
{
  "mcpServers": {
    "notion": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_TOKEN": "<seu-token-via-env-ou-secret>"
      }
    }
  }
}
```

> O pacote exato pode variar. Use o servidor Notion disponível no seu ambiente (plugin Cursor Notion, `@notionhq/notion-mcp-server`, ou equivalente community). **Sempre** descubra tools via schema antes de chamar.

### Permissões — `.cursor/permissions.json`

Após descobrir os nomes reais das tools (ex.: via MCP file system ou primeira sessão), adicione ao `mcpAllowlist`:

```json
{
  "mcpAllowlist": [
    "plan-broker:publish_plan",
    "plan-broker:get_latest_plan",
    "plan-broker:list_plans",
    "plan-broker:get_plan",
    "notion:create_page",
    "notion:search",
    "notion:append_block_children",
    "notion:update_page",
    "notion:query_database"
  ]
}
```

> Substitua `notion:` pelo prefixo real do seu servidor (`plugin-notion-workspace-notion:`, etc.).

### Registro MCP Notion — Grok Build

```bash
grok mcp add notion \
  --command npx \
  --args "-y @notionhq/notion-mcp-server" \
  --env "NOTION_TOKEN=<token>"

grok mcp list
```

### Arquitetura de informação recomendada (criar uma vez)

```
📄 Portfolio — AI Workflows & Orchestration          ← página raiz
├── 📄 Plan Broker Complete Guide                    ← conteúdo deste guia (toggles + code blocks)
├── 📄 Multi-Agent Roles                             ← resumo de AGENTS.md + .agents/
├── 📄 Validation Commands by Area                   ← tabela backend/frontend/docker/docs
├── 📄 Notion Sync Runbook                           ← quando/como atualizar após PR
└── 🗃️ Published Plans (database)
     ├── Task ID (title)
     ├── Title
     ├── Version (number)
     ├── Source (select)
     ├── Areas (multi-select)
     ├── Created / Updated (date)
     ├── Status (select: planned / implemented / archived)
     ├── Repo Link (url)
     ├── Notion Link (url)
     └── Notes (text)
```

### Popular Notion via MCP (sessão conectada)

**Passo 0 — autenticar (Cursor plugin Notion):**

Se o servidor pedir auth, execute a tool `mcp_auth` do servidor Notion e complete o fluxo no browser.

**Passo 1 — descobrir tools:**

```
search_tool query="notion"
```

Anote nomes qualificados e schemas (ex.: `notion__create_page`, `notion__search`).

**Passo 2 — criar página raiz:**

```json
{
  "tool_name": "notion__create_page",
  "tool_input": {
    "title": "Portfolio — AI Workflows & Orchestration",
    "content": "Base de conhecimento para fluxos Grok Build → PlanBroker → Cursor."
  }
}
```

**Passo 3 — criar guia filho:**

Crie página filha com título `Plan Broker Complete Guide` e cole seções deste arquivo usando `append_block_children` ou tool de markdown, se disponível.

**Seções mínimas a publicar primeiro:**

1. Visão geral (diagrama mental)
2. **Contrato obrigatório de publicação** (callout/warning)
3. Tabela de comandos PowerShell/bash
4. Referência das 4 tools plan-broker
5. Troubleshooting

**Passo 4 — database Published Plans:**

Use `create_database` ou crie manualmente com as colunas listadas acima.

**Passo 5 — após cada `publish_plan` bem-sucedido (opcional):**

Adicionar/atualizar linha na database:

| Task ID | Title | Version | Source | Status |
|---------|-------|---------|--------|--------|
| `docs-plan-broker-usage-notion` | Plan: Complete Plan-Broker... | 1 | grok-build | planned |

Repo Link: `https://github.com/<user>/Portfolio/blob/main/.cursor/plans/docs-plan-broker-usage-notion.md`

### Sync após merge de PR

Checklist leve (manual ou agente):

1. PR mergeou alterações em `docs/ops/PLAN_BROKER_GUIDE.md`
2. Abrir Notion → `Plan Broker Complete Guide`
3. Atualizar seções alteradas (ou recolar blocos de código)
4. Atualizar linha na database `Published Plans` → Status: `implemented`

### Fallback — Notion MCP indisponível

**Opção A — criação manual (copy-paste):**

1. Notion → New page → título: `Portfolio — AI Workflows & Orchestration`
2. Subpágina: `Plan Broker Complete Guide`
3. Cole o conteúdo de `docs/ops/PLAN_BROKER_GUIDE.md`
4. Formate: toggles para cenários, code blocks para comandos, callout amarelo no contrato obrigatório
5. Crie database `Published Plans` com colunas da seção acima
6. Adicione linha de exemplo para `docs-plan-broker-usage-notion`

**Opção B — GitHub (quando `grok_com_github` disponível):**

- Criar gist ou wiki entry com o conteúdo do guia
- Linkar na README ou em discussion do repo
- Migrar para Notion quando MCP estiver conectado

**Opção C — adiar:**

O guia em `docs/ops/PLAN_BROKER_GUIDE.md` é autossuficiente. Execute os passos Notion quando o MCP estiver registrado e autenticado.

### Segurança Notion

- **Nunca** commitar `NOTION_TOKEN` no repositório
- Usar variáveis de ambiente ou Cursor secret storage
- Não colocar dados pessoais ou credenciais em planos publicados

---

## 7. Matriz de troubleshooting

| Problema | Causa provável | Solução |
|----------|----------------|---------|
| MCP plan-broker `unavailable` no Grok | venv/path/line-endings | `./scripts/fix-grok-mcp.sh`; quit completo do Grok; `/mcps` refresh |
| Plano no projeto errado | `WORKSPACE_FOLDER` incorreto | `switch-mcp-workspace.ps1` ou `-Workspace`; verificar `.active-workspace` |
| `publish_plan` retorna `error` | `task_id` inválido ou markdown vazio | Corrigir formato; ver mensagem em `message` |
| Tools pedem aprovação no Cursor | Run Mode desativado | Settings → Auto-review; conferir `permissions.json` |
| Watcher não notifica | Não iniciado ou task já processada | `start-mcp-flow.ps1`; apagar entrada em `.watcher-state.json` se necessário |
| `agent` não encontrado | CLI não instalada | `irm 'https://cursor.com/install?win32=true' \| iex`; `agent login` |
| MCP não conecta no Cursor | `mcp.json` global ausente | `.\scripts\setup-mcp-flow.ps1`; reiniciar Cursor |
| uv ausente | fallback automático | `run-broker.ps1` usa `python` diretamente |
| Notion connection failed | token/servidor/auth | Verificar integration invite; `mcp_auth`; reiniciar MCP |
| HTTP broker inacessível | stack parada | `.\scripts\start-mcp-flow.ps1`; verificar porta 8765 |
| Índice corrompido | `index.json` inválido | Restaurar de git; republicar planos afetados |

---

## 8. Referências e arquivos relacionados

### Governança (decision hierarchy)

| Arquivo | Propósito |
|---------|-----------|
| [AGENTS.md](../../AGENTS.md) | Regras do projeto (prioridade máxima) |
| [ACCEPTANCE_CRITERIA.md](../../ACCEPTANCE_CRITERIA.md) | Checklist de aceite |
| [DESIGN.md](../../DESIGN.md) | Contrato visual |
| [.cursor/rules/plan-orchestration.md](../../.cursor/rules/plan-orchestration.md) | Contrato implementador Cursor |

### Ops e fluxo

| Arquivo | Propósito |
|---------|-----------|
| [SETUP_MCP_FLOW.md](SETUP_MCP_FLOW.md) | Setup único + arquitetura |
| [watch_plans.py](../../watch_plans.py) | Watcher de planos |
| [scripts/setup-mcp-flow.ps1](../../scripts/setup-mcp-flow.ps1) | Setup broker + global MCP |
| [scripts/start-mcp-flow.ps1](../../scripts/start-mcp-flow.ps1) | Inicia HTTP + watcher |
| [scripts/stop-mcp-flow.ps1](../../scripts/stop-mcp-flow.ps1) | Para stack |
| [scripts/switch-mcp-workspace.ps1](../../scripts/switch-mcp-workspace.ps1) | Multi-projeto |
| [scripts/verify-mcp-flow.ps1](../../scripts/verify-mcp-flow.ps1) | Health check |
| [scripts/fix-grok-mcp.sh](../../scripts/fix-grok-mcp.sh) | Corrige MCP no Grok/WSL |

### AI workflow

| Arquivo | Propósito |
|---------|-----------|
| [docs/ai/AI_WORKFLOW.md](../ai/AI_WORKFLOW.md) | Multi-agent workflow |
| [docs/ai/AI_PROMPTS.md](../ai/AI_PROMPTS.md) | Prompts de implementação |
| [.agents/skills/feature-delivery/SKILL.md](../../.agents/skills/feature-delivery/SKILL.md) | Entrega de features |

### Broker externo

| Caminho | Propósito |
|---------|-----------|
| `~/mcp-servers/plan-broker/plan_broker.py` | Implementação MCP |
| `~/mcp-servers/plan-broker/run-broker.ps1` | Wrapper stdio/HTTP Windows |
| `~/mcp-servers/plan-broker/grok-mcp-debug.sh` | Debug Grok/WSL |

### Planos publicados (exemplos)

| task_id | Uso |
|---------|-----|
| `review-docs-md-structure` | Exemplo de plano de documentação |
| `docs-plan-broker-usage-notion` | Plano que originou este guia |

### Validação (somente docs)

```powershell
git diff --check
git status --short
```

---

## Apêndice — Prompt template Grok Build

```markdown
Você é o agente de PLANEJAMENTO para o repositório Portfolio (Next.js + .NET).

## Objetivo
Gerar plano detalhado e publicar via MCP PlanBroker.

## Formato (Markdown)
# {Título}
## Contexto / Objetivo / Escopo
## BDD (Gherkin) — se aplicável
## Passos ordenados
## Arquivos prováveis
## Testes obrigatórios
## Validação final

## task_id
Kebab-case descritivo (ex.: feat-contact-validation)

## Publicação OBRIGATÓRIA
1. search_tool "plan-broker"
2. use_tool plan-broker__publish_plan
   - plan_markdown: conteúdo completo
   - task_id: kebab-case
   - metadata: { "source": "grok-build", "areas": [...], "priority": "normal", "origin": "planning-agent" }
3. Confirmar status "ok"
4. Só então exit_plan_mode

Guia completo: docs/ops/PLAN_BROKER_GUIDE.md

NÃO encerre sem publish_plan com status "ok".
```

---

*Última atualização: implementação do plano `docs-plan-broker-usage-notion` (2026-06-07).*
