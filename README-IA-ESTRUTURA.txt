# Estrutura e funcionalidades do projeto (20/06/2025)

## Estrutura principal
- Projeto Next.js (App Router) com TypeScript e SCSS Modules
- Layout global minimalista em `app/layout.tsx` (apenas fontes e estilos globais)
- Área autenticada em `app/(app)/` com layout próprio que inclui Header e Providers
- Rotas públicas `/login` e `/register` com layouts isolados, sem Header nem Providers

## Componentes principais
- `Header`: aparece apenas na área autenticada (dentro de `(app)`)
- `SelectedGridProviders`: provider de contexto para seleção de grids
- `InfoTable`: tabela dinâmica para exibir informações de produtos, com suporte a validação visual
- `ValidarInformacoesClient`: tela de validação de informações, faz requisição para IA e colore campos validados

## Fluxo de validação com IA
- Usuário visualiza informações em uma tabela (`InfoTable`)
- Ao clicar em "Validar", é feita uma requisição para `/api/validar` (simulada, pode ser adaptada para sua IA)
- A resposta da IA é um JSON indicando quais campos estão corretos (ex: `{ Fabricante: true, EAN: false, ... }`)
- Os campos corretos são destacados em verde na tabela
- Mensagens de erro e loading são exibidas conforme o estado da requisição

## Observações
- Para que o Header apareça em todas as rotas autenticadas, coloque as páginas dentro de `app/(app)/`
- Para isolar rotas públicas, mantenha seus layouts sem `<html>`/`<body>` e sem Header/Providers
- O projeto não está versionado com git (recomendado adicionar para controle de alterações)
- Estrutura pronta para expansão de menus, autenticação e outros recursos

---

Este arquivo serve como documentação rápida para qualquer IA ou desenvolvedor entender a estrutura e os fluxos principais do projeto, incluindo os últimos ajustes de UI e validação.
