# Documentacao da Aplicacao

Este documento explica a estrutura da aplicacao, o papel do frontend, o papel do backend e como os dados fluem entre as partes do projeto.

## Visao Geral

Este projeto e um portfolio fullstack dividido em dois apps principais:

```txt
apps/
  web/  -> Frontend em Next.js
  api/  -> Backend em .NET / ASP.NET Core
```

A ideia principal e que o backend seja a fonte de dados dos projetos, enquanto o frontend renderiza a interface, a navegacao, os filtros, as paginas e os componentes visuais.

URLs locais esperadas:

```txt
Frontend: http://localhost:3000
API:      http://localhost:5000
Docs API: http://localhost:5000/scalar
```

## Estrutura Principal

```txt
/
  apps/
    web/
      src/
        app/
        components/
        config/
        lib/
        types/

    api/
      src/
        Portfolio.Api/
        Portfolio.Application/
        Portfolio.Domain/
        Portfolio.Infrastructure/

      tests/
        Portfolio.Api.Tests/
        Portfolio.Application.Tests/

  docker-compose.yml
  docker-compose.override.yml
  .env.example
  README.md
```

## O Que o Frontend Faz

O frontend fica em:

```txt
apps/web
```

Ele usa:

```txt
Next.js
React
TypeScript
Tailwind CSS
Framer Motion
lucide-react
```

Responsabilidades do frontend:

- Renderizar a Home.
- Renderizar a pagina de projetos.
- Renderizar paginas dinamicas de detalhes de projeto.
- Consumir dados da API .NET.
- Exibir projetos destacados na Home.
- Permitir busca e filtro de projetos.
- Manter layout compartilhado com Navbar e Footer unicos.
- Exibir botoes desabilitados quando nao ha demo ou repositorio real.
- Garantir visual dark premium SaaS baseado no design do Google Stitch.

Rotas do frontend:

```txt
/                  Home
/projects          Lista de projetos
/projects/[slug]   Detalhe dinamico de projeto
```

Arquivos importantes:

```txt
apps/web/src/app/page.tsx
```

Renderiza a Home.

```txt
apps/web/src/app/projects/page.tsx
```

Renderiza a pagina de listagem de projetos.

```txt
apps/web/src/app/projects/[slug]/page.tsx
```

Renderiza dinamicamente o detalhe de um projeto usando o `slug`.

```txt
apps/web/src/lib/api.ts
```

Cliente/helper usado pelo frontend para chamar a API.

```txt
apps/web/src/types/project.ts
```

Tipos TypeScript que representam os projetos vindos do backend.

## Componentes do Frontend

Componentes globais:

```txt
apps/web/src/components/layout/Navbar.tsx
apps/web/src/components/layout/Footer.tsx
apps/web/src/components/layout/AppShell.tsx
```

Esses componentes sao compartilhados por todas as paginas.

Componentes de secoes:

```txt
apps/web/src/components/sections/Hero.tsx
apps/web/src/components/sections/ValueSection.tsx
apps/web/src/components/sections/FeaturedProjects.tsx
apps/web/src/components/sections/ContactCTA.tsx
```

Componentes de projetos:

```txt
apps/web/src/components/projects/ProjectCard.tsx
apps/web/src/components/projects/ProjectGrid.tsx
apps/web/src/components/projects/ProjectFilters.tsx
apps/web/src/components/projects/ProjectDetail.tsx
apps/web/src/components/projects/ProjectStatusBadge.tsx
```

Componentes primitivos de UI:

```txt
apps/web/src/components/ui/Button.tsx
apps/web/src/components/ui/Badge.tsx
apps/web/src/components/ui/Card.tsx
apps/web/src/components/ui/SectionContainer.tsx
apps/web/src/components/ui/SectionHeading.tsx
```

## Fluxo do Frontend

Na Home:

```txt
page.tsx
  -> chama getProjects()
  -> filtra projetos com featured: true
  -> renderiza FeaturedProjects
```

Na pagina `/projects`:

```txt
projects/page.tsx
  -> chama getProjects()
  -> passa dados para ProjectFilters
  -> usuario busca/filtra
  -> ProjectGrid renderiza ProjectCard
```

Na pagina `/projects/[slug]`:

```txt
[slug]/page.tsx
  -> pega slug da URL
  -> chama getProjectBySlug(slug)
  -> se encontrar, renderiza ProjectDetail
  -> se nao encontrar, exibe not-found
```

## O Que o Backend Faz

O backend fica em:

```txt
apps/api
```

Ele usa:

```txt
.NET 10
ASP.NET Core
C#
OpenAPI
Scalar
xUnit
```

Responsabilidades do backend:

- Servir os dados dos projetos.
- Centralizar o modelo de dados.
- Expor endpoints HTTP para o frontend.
- Validar contato sem enviar email real.
- Expor documentacao OpenAPI/Scalar.
- Manter arquitetura separada por camadas.
- Permitir futura migracao para banco de dados, CMS ou MDX.

Endpoints principais:

```txt
GET  /api/health
GET  /api/projects
GET  /api/projects/{slug}
POST /api/contact
GET  /openapi/v1.json
GET  /scalar
```

## Camadas do Backend

```txt
Portfolio.Api
```

Camada HTTP. Contem `Program.cs`, configuracao de CORS/OpenAPI e endpoints.

```txt
Portfolio.Application
```

Camada de casos de uso. Contem servicos, DTOs e interfaces.

```txt
Portfolio.Domain
```

Camada de dominio. Contem modelos como `Project`, `ProjectStatus` e `ProjectCategory`.

```txt
Portfolio.Infrastructure
```

Camada de infraestrutura. Contem o repositorio JSON e o arquivo de dados.

## Estrutura do Backend

```txt
apps/api/src/Portfolio.Api/
  Program.cs
  Endpoints/
    HealthEndpoints.cs
    ProjectsEndpoints.cs
    ContactEndpoints.cs
  Configuration/
    CorsConfiguration.cs
    OpenApiConfiguration.cs
```

```txt
apps/api/src/Portfolio.Application/
  Projects/
    ProjectDtos.cs
    IProjectRepository.cs
    IProjectQueryService.cs
    ProjectQueryService.cs
  Contact/
    ContactDtos.cs
    ContactSubmissionService.cs
```

```txt
apps/api/src/Portfolio.Domain/
  Projects/
    Project.cs
    ProjectStatus.cs
    ProjectCategory.cs
```

```txt
apps/api/src/Portfolio.Infrastructure/
  Projects/
    JsonProjectRepository.cs
  Data/
    projects.json
```

## Modelo de Dados dos Projetos

Os projetos ficam atualmente em:

```txt
apps/api/src/Portfolio.Infrastructure/Data/projects.json
```

Cada projeto tem campos como:

```txt
slug
title
description
summary
category
status
stack
featured
repositoryUrl
liveUrl
overview
purpose
technicalHighlights
implementationNotes
nextSteps
```

Uso de alguns campos:

- `featured: true` faz o projeto aparecer na Home.
- `slug` define a URL do detalhe.
- `repositoryUrl: null` mostra botao de repositorio privado ou indisponivel.
- `liveUrl: null` mostra botao de demo indisponivel.
- `technicalHighlights` aparece na pagina de detalhe.

## Fluxo de Dados

```txt
projects.json
  -> JsonProjectRepository
  -> ProjectQueryService
  -> ProjectsEndpoints
  -> API /api/projects
  -> Frontend getProjects()
  -> ProjectCard / ProjectDetail
```

Passo a passo:

1. O backend le o JSON.
2. O backend converte os dados para modelos e DTOs.
3. A API expoe os dados.
4. O frontend consome a API.
5. O frontend renderiza os projetos.

## Contato

O endpoint existe:

```txt
POST /api/contact
```

Campos esperados:

```txt
name
email
subject
message
```

Atualmente ele ainda nao envia email real.

Ele apenas:

- valida os dados;
- retorna uma resposta honesta;
- informa que o envio de email ainda nao esta configurado;
- nao salva dados sensiveis.

Isso prepara o projeto para uma futura integracao com SendGrid, Resend, SMTP, Azure Communication Services ou outro provedor.

## Docker

O projeto tem dois servicos:

```txt
api
web
```

Arquivos:

```txt
docker-compose.yml
docker-compose.override.yml
apps/api/Dockerfile
apps/web/Dockerfile
```

Para subir:

```bash
docker compose up --build
```

Se a porta 3000 estiver ocupada:

```bash
WEB_PORT=3001 docker compose up --build
```

## Resumo Simples

Frontend:

```txt
Cuida da experiencia visual, rotas, componentes, filtros, paginas e consumo da API.
```

Backend:

```txt
Cuida dos dados, regras de leitura, endpoints, validacao de contato e documentacao da API.
```

Docker:

```txt
Sobe frontend e backend juntos em containers separados.
```

Dados:

```txt
Os projetos vivem no backend em projects.json e sao consumidos pelo frontend via API.
```
