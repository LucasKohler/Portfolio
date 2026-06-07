---
description: Orquestração de planos publicados via PlanBroker MCP (fluxo Grok Build → Cursor)
globs:
alwaysApply: false
---

# Plan Orchestration — Grok Build → Cursor (Nível 2)

Esta regra aplica-se quando você recebe um plano de implementação publicado pelo **PlanBroker MCP** ou detectado em `.cursor/plans/{task_id}.md`.

## Contexto do fluxo

1. **Grok Build** gera o plano detalhado (BDD, passos, arquivos, testes).
2. **PlanBroker** (`~/mcp-servers/plan-broker/`, MCP global em `~/.cursor/mcp.json`) persiste via `publish_plan` em `.cursor/plans/`.
3. **Cursor** consome o plano (MCP ou arquivo) e implementa com validação.
4. Tools PlanBroker em `.cursor/permissions.json` podem rodar sem aprovação manual (Run Mode: Auto-review).

Você é o agente de **implementação**, não de planejamento. O plano já foi aprovado para execução.

## Primeiro passo obrigatório

Antes de editar qualquer arquivo:

1. Obter o plano via MCP `plan-broker` → `get_plan(task_id)` ou `get_latest_plan()`.
2. Se MCP não estiver disponível, ler `.cursor/plans/{task_id}.md` diretamente.
3. Ler `AGENTS.md`, `ACCEPTANCE_CRITERIA.md` e docs relevantes ao escopo (backend/frontend).
4. Listar os passos do plano e confirmar ordem de execução em uma mensagem curta ao usuário.

**Catálogo completo de comandos, publicação obrigatória (Grok Build) e integração Notion:** [`docs/ops/PLAN_BROKER_GUIDE.md`](../../docs/ops/PLAN_BROKER_GUIDE.md).

## Padrões de implementação

### Escopo

- Implemente **somente** o que o plano descreve.
- Não invente endpoints, tabelas, métricas ou integrações não listadas.
- Se o plano conflitar com `DESIGN.md` ou `ACCEPTANCE_CRITERIA.md`, pare e reporte o conflito antes de prosseguir.

### Arquitetura

- Backend: respeite `Api → Application → Infrastructure → Domain`.
- Frontend: Server Components por padrão; Client Components só para interação.
- Dados de projetos vêm da API — não duplique em JSON no frontend.

### Subagentes

Use subagentes quando reduzir risco ou paralelizar trabalho independente:

| Agente | Quando usar |
|--------|-------------|
| `explorer` | Mapear arquivos/rotas antes de implementar |
| `architect` | Mudança de boundaries, contratos ou estrutura |
| `qa-reviewer` | Definir testes de proteção antes de implementar |
| `backend-worker` | Implementação backend aprovada e isolada |
| `frontend-worker` | Implementação frontend aprovada e isolada |
| `security-reviewer` | Contact, CORS, secrets, validação de input |

**Regras de paralelismo:**

- Leitura (`explorer`, `architect`, `qa-reviewer`) pode ser paralela.
- **Nunca** rode dois workspace-write workers no mesmo arquivo ou fluxo funcional.
- O agente principal consolida resultados — não retorne respostas de subagentes sem síntese.

### BDD e testes

Se o plano incluir cenários BDD ou lista de testes:

1. Trate cenários BDD como critérios de aceite, não como texto decorativo.
2. Implemente testes que validem comportamento real (contratos, validação, rotas).
3. Não crie testes placeholder que só assertam implementação interna.

### Validação obrigatória

Execute o menor conjunto relevante e reporte resultados com evidência:

| Área alterada | Comandos |
|---------------|----------|
| Backend | `dotnet build apps/api/Portfolio.slnx` + `dotnet test apps/api/Portfolio.slnx` |
| Frontend | `cd apps/web && npm run lint && npm run build` |
| Docker/infra | `docker compose config` (+ `docker compose build` se Dockerfiles mudaram) |
| Apenas docs | `git diff --check` |

Não afirme que build/test passou sem ter executado o comando.

### Commits e PRs

- **Não commite** a menos que o usuário peça explicitamente.
- Ao encerrar, entregue: resumo, arquivos tocados, validações executadas, riscos e próximo passo seguro.

## Formato de resposta ao concluir

```markdown
## Implementação — {task_id}

### Concluído
- ...

### Validação
- [comando] → resultado

### Riscos / não validado
- ...

### Próximo passo
- ...
```

## Segurança

- Não inclua secrets, tokens ou dados pessoais no plano ou nos logs.
- Não exponha `.env` ou credenciais em respostas.
- Valide inputs em endpoints que recebem dados do usuário.
- MCP PlanBroker é local (stdio) — não publique planos com informação sensível em servidores HTTP sem autenticação.
