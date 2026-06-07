# AI_PROMPTS.md

## Como usar este arquivo

Este arquivo é um roteiro de prompts para conduzir qualquer assistente de IA passo a passo na implementação do portfólio.

Ele **não deve ser executado inteiro de uma vez**.

Use um prompt por etapa, revise o resultado e só então avance para a próxima fase.

---

## Contexto importante

O projeto tem:

- Arquivos `.md` de governança na raiz e documentação detalhada em `docs/`.
- `DESIGN.md` exportado pelo Google Stitch na raiz.
- Uma pasta de exportação do Google Stitch na raiz do projeto.
- Stack definida: Next.js no frontend, .NET no backend e Docker desde o início.

A pasta exportada do Stitch deve ser usada como referência visual, estrutural e de assets, mas **não deve ser copiada cegamente** como arquitetura final.

Hierarquia de decisão:

```txt
1. AGENTS.md
2. DESIGN.md
3. ACCEPTANCE_CRITERIA.md
4. docs/specs/ROUTES.md / docs/specs/COMPONENTS.md / docs/specs/CONTENT.md / docs/specs/PRODUCT.md
5. Pasta exportada do Google Stitch
6. Imagens e screenshots de referência
```

O assistente de IA deve implementar uma base limpa em:

```txt
apps/web  -> Next.js + React + TypeScript + Tailwind CSS
apps/api  -> .NET LTS + ASP.NET Core API
Docker    -> Dockerfiles + Docker Compose
```

Use versões estáveis e LTS quando aplicável. Não use preview/canary/nightly.

---

# Prompt 1 — Initial Planning

Use este primeiro. Ele não deve escrever código.

```txt
Leia os arquivos de documentação obrigatórios (lista em AGENTS.md e `docs/README.md`):

- AGENTS.md
- DESIGN.md
- README.md
- docs/specs/PRODUCT.md
- docs/specs/ROUTES.md
- docs/specs/COMPONENTS.md
- docs/specs/CONTENT.md
- docs/process/IMPLEMENTATION_PLAN.md
- ACCEPTANCE_CRITERIA.md
- docs/ai/AI_PROMPTS.md

A pasta de exportação do Google Stitch está na raiz do projeto.

Antes de implementar qualquer coisa:

1. Inspecione a pasta exportada do Google Stitch.
2. Identifique quais arquivos exportados são úteis como referência visual, estrutural, assets, estilos ou componentes.
3. Use o export do Stitch como referência visual e contextual.
4. Não copie o código exportado cegamente.
5. Não preserve uma arquitetura ruim apenas porque veio do export.
6. A implementação final deve seguir AGENTS.md, DESIGN.md, docs/specs/ROUTES.md, docs/specs/COMPONENTS.md e ACCEPTANCE_CRITERIA.md.

A stack obrigatória é:

- Monorepo simples com apps/web e apps/api
- Frontend em Next.js, React, TypeScript e Tailwind CSS
- Backend em .NET LTS, ASP.NET Core API e C#
- Docker e Docker Compose desde o início
- OpenAPI e Scalar no backend, se compatível
- Projetos servidos pelo backend e consumidos pelo frontend

Use as versões estáveis mais atuais disponíveis no ambiente, preferindo LTS para Node e .NET.

Execute apenas o planejamento inicial.

Não escreva código ainda.

Me devolva:

- Resumo do objetivo do projeto
- Como o export do Stitch será usado
- Arquitetura proposta
- Estrutura de pastas proposta
- Decisão de versões/runtime
- Componentes principais do frontend
- Estrutura principal do backend
- Modelo de dados dos projetos
- Estratégia de API
- Estratégia de rotas frontend
- Estratégia de Docker
- Estratégia de styling
- Estratégia de responsividade
- Riscos técnicos
- Pontos que precisam de validação
- Critérios de aceite antes de começar a codar
```

---

# Prompt 2 — Monorepo and Tooling Setup

```txt
Execute apenas a fase de setup estrutural do monorepo.

Siga:

- AGENTS.md
- DESIGN.md
- docs/process/IMPLEMENTATION_PLAN.md
- ACCEPTANCE_CRITERIA.md

Crie a estrutura:

- apps/web
- apps/api

Crie ou prepare os arquivos raiz:

- docker-compose.yml
- docker-compose.override.yml
- .env.example
- .editorconfig
- .gitignore

Não implemente a UI completa.
Não implemente a API completa ainda.
Não copie cegamente a arquitetura do export do Stitch.

Configure a base para:

- Next.js no apps/web
- .NET no apps/api
- Docker Compose na raiz

Ao final, me devolva:

- Arquivos criados
- Estrutura final
- Decisões tomadas
- O que ficou pendente para a próxima etapa
- Como validar localmente
```

---

# Prompt 3 — Backend Foundation (.NET API)

```txt
Implemente apenas a fundação do backend em apps/api.

Use a versão .NET LTS mais atual disponível no ambiente.

Crie uma API ASP.NET Core com estrutura extensível.

Estrutura recomendada:

apps/api/
  src/
    Portfolio.Api/
    Portfolio.Application/
    Portfolio.Domain/
    Portfolio.Infrastructure/

  tests/
    Portfolio.Api.Tests/
    Portfolio.Application.Tests/

Requisitos:

- Health endpoint
- OpenAPI
- Scalar, se compatível
- CORS configurado para o frontend local
- Estrutura de endpoints separada por domínio
- Program.cs limpo
- Dockerfile para a API
- .dockerignore
- Configuração via appsettings e variáveis de ambiente

Endpoints mínimos:

GET /api/health

Não implemente ainda todos os endpoints de projetos se isso tornar a tarefa grande demais.

Não adicione banco de dados nesta etapa.
Não adicione autenticação nesta etapa.
Não implemente envio real de email nesta etapa.

Ao final, rode o que for possível:

- dotnet build
- dotnet test, se houver testes

Me devolva:

- Estrutura criada
- Endpoints disponíveis
- Como rodar a API
- Como acessar docs OpenAPI/Scalar
- Pendências para próxima etapa
```

---

# Prompt 4 — Frontend Foundation (Next.js)

```txt
Implemente apenas a fundação do frontend em apps/web.

Use:

- Next.js
- React
- TypeScript
- Tailwind CSS
- ESLint
- App Router
- Framer Motion
- lucide-react, se fizer sentido para ícones

Use a versão estável mais atual disponível.

Configure:

- App Router
- Global styles
- Tailwind
- TypeScript strict
- API base URL via variável de ambiente
- Estrutura src/
- Dockerfile para o frontend
- .dockerignore

Não implemente a UI completa ainda.
Não implemente páginas completas ainda.

Crie apenas uma página inicial mínima que confirme que o app está rodando e usando o layout base.

Ao final, rode o que for possível:

- npm run lint
- npm run build

Ou o equivalente do package manager escolhido.

Me devolva:

- Estrutura criada
- Dependências instaladas
- Scripts disponíveis
- Como rodar localmente
- Como rodar via Docker
- Pendências para próxima etapa
```

---

# Prompt 5 — Docker Compose Integration

```txt
Integre frontend e backend via Docker Compose.

Serviços:

- web
- api

Requisitos:

- docker-compose.yml na raiz
- docker-compose.override.yml para desenvolvimento
- .env.example com variáveis necessárias
- Web deve conseguir chamar a API
- API deve aceitar CORS do frontend local
- Healthcheck para API, se possível
- Não adicionar banco de dados ainda
- Não adicionar serviços desnecessários

URLs esperadas:

- Frontend em http://localhost:3000
- API em http://localhost:5000 ou http://localhost:8080
- API docs em /scalar, /docs ou equivalente

Rode ou valide:

- docker compose build
- docker compose up

Se não for possível executar algo no ambiente, explique o motivo.

Me devolva:

- Serviços configurados
- Portas usadas
- Variáveis de ambiente
- Como subir o projeto
- Como validar web e API
```

---

# Prompt 6 — Backend Project Data API

```txt
Implemente os endpoints de projetos no backend.

A fonte de dados inicial deve ser backend-owned, por exemplo:

apps/api/src/Portfolio.Infrastructure/Data/projects.json

ou equivalente fortemente tipado.

Não use banco de dados ainda.

Crie ou complete:

- Domain model de Project
- ProjectStatus
- ProjectCategory
- DTOs explícitos
- Repository interface
- JSON/in-memory repository
- Application service ou query handlers
- Endpoints de projects

Endpoints:

GET /api/projects
GET /api/projects/{slug}

O modelo deve suportar:

- slug
- title
- description
- summary
- category
- status
- stack
- featured
- repositoryUrl
- liveUrl
- overview
- purpose
- technicalHighlights
- implementationNotes
- nextSteps

Projetos iniciais:

1. Portfolio Platform
2. Data Migration & SQL Modeling
3. API Performance Optimization
4. Business Dashboard Interface
5. AI-Assisted Development Workflow
6. Architecture Refactoring Notes

Regras:

- Não inventar empresas.
- Não inventar métricas falsas.
- Não inventar resultados falsos.
- Não criar links falsos de demo pública.
- Se não houver live demo, o campo deve ficar vazio ou ser tratado como indisponível.

Ao final, valide:

- GET /api/projects
- GET /api/projects/portfolio-platform
- GET de slug inválido retorna 404
```

---

# Prompt 7 — Backend Contact Endpoint

```txt
Implemente o endpoint de contato no backend sem fingir envio real de email.

Endpoint:

POST /api/contact

Campos esperados:

- name
- email
- subject
- message

Requisitos:

- Validação explícita
- Respostas claras
- Não enviar email real ainda
- Não salvar dados sensíveis
- Retornar uma resposta honesta, como accepted/validated, deixando claro que a integração de email ainda não está configurada
- Preparar a estrutura para futura integração com provedor de email

Não adicionar banco de dados.
Não adicionar autenticação.
Não adicionar provedor de email ainda.

Atualize a documentação OpenAPI/Scalar se necessário.
```

---

# Prompt 8 — Shared Frontend Layout and UI Primitives

```txt
Implemente apenas os componentes compartilhados do frontend.

Componentes globais:

- Navbar
- Footer
- SectionContainer

Componentes primitivos:

- Button
- Badge
- Card
- SectionHeading

Regras:

- Footer deve ser um único componente reutilizado em todas as páginas.
- Não criar variações de Footer por página.
- Navbar deve ser um único componente reutilizado.
- Usar Tailwind CSS.
- Preservar o visual dark premium SaaS do DESIGN.md e do export do Stitch.
- Não adicionar bibliotecas desnecessárias.

Footer:

Lado esquerdo:
- Lucas Kohler Marques
- Software Engineer
- Built with modern web technologies.

Lado direito:
- GitHub
- LinkedIn
- Email
- Resume

Não incluir:
- Twitter
- Copyright line
- Built with precision

Não implemente ainda todas as páginas completas.
```

---

# Prompt 9 — Frontend API Client and Types

```txt
Implemente a camada de comunicação do frontend com a API .NET.

Crie:

- types de Project no frontend
- client/helper para chamar a API
- funções:
  - getProjects()
  - getProjectBySlug(slug)
- tratamento de erro básico
- configuração de API base URL via env

Regras:

- Não duplicar todo o conteúdo dos projetos no frontend.
- O backend deve ser a fonte principal de dados.
- Tipos do frontend devem ser compatíveis com os DTOs da API.
- Se criar fallback local, documente claramente que é temporário.

Não implemente ainda as páginas completas, exceto se necessário para validar a comunicação.
```

---

# Prompt 10 — Home Page

```txt
Implemente a Home page seguindo o design aprovado.

Use:

- DESIGN.md
- docs/specs/CONTENT.md
- docs/specs/COMPONENTS.md
- Export do Google Stitch como referência visual
- API de projetos para Featured Engineering Work

Seções obrigatórias:

1. Navbar
2. Hero
3. What I bring to engineering teams
4. Featured Engineering Work
5. Contact CTA
6. Footer

Hero:

Headline:
Software Engineer focused on fullstack systems, performance and AI-assisted development.

Supporting text:
I build fullstack applications, APIs, dashboards and data-driven systems with .NET, React, TypeScript and SQL Server — combining architecture, performance and AI-assisted workflows to turn complex requirements into maintainable software.

CTAs:
- View Projects
- View Resume

Não incluir no Hero:
- Contact Me

Badges:
- 4+ Yrs Exp
- .NET Core
- React / TS

Featured Engineering Work:

- Deve usar projetos com `featured: true` vindos da API
- Não hardcodar cards manualmente
- Deve ter CTA “View All Projects”

Footer:

- Usar o componente compartilhado
- Não criar footer específico da Home
```

---

# Prompt 11 — Projects Index Page

```txt
Implemente a página `/projects`.

Use:

- DESIGN.md
- docs/specs/ROUTES.md
- docs/specs/COMPONENTS.md
- ACCEPTANCE_CRITERIA.md
- Export do Google Stitch como referência visual
- API .NET como fonte de dados

A página deve conter:

1. Navbar
2. Header da página
3. Search input
4. Category filters
5. Project grid
6. Contact CTA compacto
7. Footer compartilhado

Título:
Selected Engineering Projects

Supporting text:
A growing collection of software engineering projects, case studies, experiments and technical implementations.

Filtros:

- All
- Fullstack
- Frontend
- Backend
- Data
- AI Workflow
- Architecture

Regras:

- Project cards devem ser renderizados a partir da API
- Não hardcodar cards individualmente
- Cada card deve navegar para `/projects/[slug]`
- Grid responsivo:
  - 3 colunas desktop
  - 2 colunas tablet
  - 1 coluna mobile
- Manter hover states
- Manter status badges
- Manter tech badges
- Usar Footer compartilhado
- Footer precisa ficar idêntico ao da Home
```

---

# Prompt 12 — Dynamic Project Detail Page

```txt
Implemente a página dinâmica `/projects/[slug]`.

Use:

- docs/specs/ROUTES.md
- docs/specs/COMPONENTS.md
- docs/specs/CONTENT.md
- ACCEPTANCE_CRITERIA.md
- Export do Google Stitch como referência visual
- API .NET como fonte de dados

Requisitos:

- Carregar projeto pelo slug a partir da API
- Mostrar estado not-found para slug inválido
- Usar navegação interna
- Incluir Back to Projects
- Incluir breadcrumb
- Incluir título do projeto
- Incluir status badge
- Incluir summary
- Incluir main visual preview placeholder
- Incluir Overview
- Incluir Purpose
- Incluir Technical Highlights
- Incluir Implementation Notes
- Incluir Current Status / Next Steps
- Incluir Tech Stack
- Incluir botões de GitHub / Live Demo de acordo com disponibilidade real
- Usar Footer compartilhado

Não incluir:

- Related Projects
- Fake Results & Impact
- Fake metrics
- Fake Lighthouse score
- Fake load time
- Large System Architecture block
- Fake architecture code panel

Botões:

- Se houver `repositoryUrl`, mostrar “GitHub Repository”
- Se não houver, mostrar “Private Repository” ou ocultar, conforme o status
- Se houver `liveUrl`, mostrar “Live Demo”
- Se não houver, mostrar “Live Demo Coming Soon” como disabled ou secundário

A página deve ser dinâmica e funcionar para todos os projetos da API.
Não criar uma página manual separada para cada projeto.
```

---

# Prompt 13 — Contact and Footer Consistency Review

```txt
Revise especificamente a consistência da Contact section e do Footer.

Objetivo:

- Contact section deve ser área de conversão
- Footer deve ser fechamento simples
- Eles não devem parecer redundantes
- Footer deve ser idêntico em todas as páginas

Contact section:

Deve conter:
- Let’s build reliable software with measurable impact.
- Texto de disponibilidade profissional
- Remote from Brazil · Open to remote opportunities
- Contact Me
- View Resume
- View GitHub
- LinkedIn

Não deve conter:
- Cards grandes de Email, LinkedIn, GitHub e Location
- Repetição excessiva de links
- Layout pesado demais

Footer:

Deve conter:
- Lucas Kohler Marques
- Software Engineer
- Built with modern web technologies.
- GitHub
- LinkedIn
- Email
- Resume

Não deve conter:
- Twitter
- Copyright
- Built with precision
- Variações entre páginas

Valide:

- Home footer
- Projects footer
- Project Detail footer

Se houver diferença visual entre footers, corrija usando um único componente compartilhado.
```

---

# Prompt 14 — Responsive and Visual Polish

```txt
Compare a implementação com o export do Google Stitch e com DESIGN.md.

Ajuste apenas polimento visual e responsividade.

Verifique:

- Espaçamento entre seções
- Hierarquia de títulos
- Tamanho dos textos pequenos
- Contraste de textos muted
- Alinhamento dos cards
- Hover states
- Button hierarchy
- Responsividade mobile
- Responsividade tablet
- Footer idêntico em todas as páginas
- Navbar consistente
- Project grid responsivo
- Project detail limpo e legível

Não adicionar novas seções.
Não alterar a estratégia de conteúdo.
Não inventar métricas.
Não alterar a arquitetura.
Não criar novos componentes desnecessários.
```

---

# Prompt 15 — Final Technical Review

```txt
Faça uma revisão técnica final contra ACCEPTANCE_CRITERIA.md.

Verifique:

- Build do frontend
- Lint do frontend
- TypeScript errors
- Build do backend
- Testes do backend
- Docker Compose
- Rotas frontend
- Endpoints backend
- Links internos
- Links externos
- Estados disabled
- Responsividade
- Acessibilidade básica
- Componentização
- Ausência de duplicação de Footer
- Uso correto da API
- Uso correto de dynamic routes
- Ausência de fake metrics
- Ausência de fake claims

Rode os comandos disponíveis no projeto, por exemplo:

- npm run lint
- npm run build
- dotnet build
- dotnet test
- docker compose build

Se algum comando não existir, informe claramente.

Me devolva:

- O que passou
- O que falhou
- Arquivos corrigidos
- Pendências restantes
- Recomendações finais
```

---

# Prompt 16 — README and Repository Polish

```txt
Atualize o README.md do repositório para refletir o projeto implementado.

O README deve explicar:

- Objetivo do portfólio
- Stack usada
- Estrutura do projeto
- Como rodar localmente sem Docker
- Como rodar localmente com Docker
- Rotas principais
- Endpoints principais
- Como adicionar novos projetos
- Como funciona o modelo de dados dos projetos
- Como fazer build
- Como fazer deploy futuramente
- Como o Google Stitch foi usado como referência visual
- Como assistentes de IA foram usados no workflow de implementação

Não transforme o README em currículo.
Não repita todo o conteúdo profissional do site.
O README deve ser técnico, claro e útil para quem abrir o repositório no GitHub.
```

---

## Prompt de emergência — Quando o assistente de IA começar a sair do escopo

```txt
Pare e revise o escopo.

Você está saindo das instruções do projeto.

Volte a seguir:

- AGENTS.md
- DESIGN.md
- ACCEPTANCE_CRITERIA.md
- docs/specs/COMPONENTS.md
- docs/specs/ROUTES.md

Não adicione novas seções.
Não invente métricas.
Não invente resultados.
Não crie Footer duplicado.
Não crie páginas manuais por projeto.
Não copie cegamente o export do Stitch.
Não transforme o projeto em um template genérico.
Não ignore a arquitetura apps/web + apps/api.
Não ignore Docker.
Não duplique dados dos projetos entre frontend e backend.

Corrija apenas o que for necessário para voltar ao escopo documentado.
```

---

## Prompt de emergência — Footer diferente entre páginas

```txt
O Footer está diferente entre páginas.

Corrija apenas isso.

O Footer deve ser um único componente compartilhado, visualmente idêntico em:

- Home
- Projects Index
- Project Detail
- Futuras páginas

Use exatamente o mesmo:

- Background
- Border
- Container width
- Padding
- Typography
- Text order
- Link order
- Alignment
- Spacing

Conteúdo:

Lucas Kohler Marques
Software Engineer
Built with modern web technologies.

GitHub
LinkedIn
Email
Resume

Não altere mais nada.
```

---

## Prompt de emergência — Projeto parecendo vazio ou fake

```txt
Revise os cards de projetos para que não pareçam vazios, falsos ou inacabados.

Use projetos como case studies técnicos e experimentos documentados.

Não use linguagem como:

- Case Study Pending
- Data Compiling
- Almost Ready

Use statuses profissionais:

- Case Study
- In Progress
- Draft
- Private Repository
- Live Demo
- Coming Soon

Não invente métricas.
Não invente empresas.
Não invente resultados.

Ajuste apenas títulos, descrições e status dos projetos.
```

---

## Prompt de emergência — API ignorada

```txt
A implementação está ignorando o backend .NET.

Corrija a arquitetura.

O backend deve existir em apps/api e expor:

- GET /api/health
- GET /api/projects
- GET /api/projects/{slug}
- POST /api/contact

O frontend em apps/web deve consumir a API para obter projetos.

Não mantenha todo o conteúdo dos projetos apenas hardcoded no frontend.

Não remova o backend.
Não transforme o projeto em frontend-only.
```

---

## Prompt de emergência — Docker ignorado

```txt
A implementação está ignorando Docker.

Corrija isso sem alterar a UI.

Adicione ou corrija:

- apps/web/Dockerfile
- apps/api/Dockerfile
- apps/web/.dockerignore
- apps/api/.dockerignore
- docker-compose.yml
- docker-compose.override.yml
- .env.example

O projeto deve rodar com:

docker compose up --build

Não adicionar banco de dados agora.
Não adicionar serviços desnecessários.
```
