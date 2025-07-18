# Arquitetura do Projeto de Relatórios com n8n

Este documento descreve a arquitetura e o fluxo de dados para o sistema de geração de relatórios dinâmicos da aplicação.

## 1. Visão Geral

O objetivo é criar um sistema seguro, escalável e de fácil manutenção, onde o frontend solicita relatórios através de um identificador, e o backend orquestra a busca dos dados de forma segura, utilizando o n8n como um executor de queries SQL.

## 2. Diagrama da Arquitetura

O fluxo de uma solicitação de relatório segue três grandes camadas: Frontend, Backend e Infraestrutura Externa.

```mermaid
graph TD
    subgraph "Frontend (Navegador do Usuário)"
        A[React Component: /app/dashboard/page.tsx] -- "1. Usuário seleciona um relatório" --> B{handleReportRequest('ID_DO_RELATORIO')};
        B -- "2. Faz fetch para a API interna" --> C[/api/n8n-query];
        C -- "8. Recebe os dados em JSON" --> D[Componente de Tabela/Gráfico];
        D -- "9. Renderiza o relatório para o usuário" --> A;
    end

    subgraph "Backend (Servidor Next.js)"
        C -- "3. Request chega na API Route" --> E[API Route: /api/n8n-query/route.ts];
        E -- "4. Procura a query SQL usando o ID" --> F[Dicionário de Queries: /lib/reports.ts];
        F -- "5. Retorna a query SQL correspondente" --> E;
    end

    subgraph "Infraestrutura Externa"
        E -- "6. Envia a query SQL para o Webhook" --> G[Webhook n8n];
        G -- "7. Executa a query no banco" --> H[(PostgreSQL DB)];
        H -- "Retorna o resultado da consulta" --> G;
        G -- "Retorna os dados em JSON para a API" --> E;
    end

    style A fill:#D6EAF8,stroke:#3498DB
    style D fill:#D5F5E3,stroke:#2ECC71
    style E fill:#FCF3CF,stroke:#F1C40F
    style G fill:#FADBD8,stroke:#E74C3C
    style H fill:#E5E7E9,stroke:#839192
```

## 3. Fluxo Detalhado da Requisição

1.  **Ação do Usuário (Frontend):** O usuário, em uma página do dashboard, clica em um botão para gerar um relatório (ex: "Itens Mais Comprados").
2.  **Requisição (Frontend):** Uma função no componente React faz uma chamada `fetch` para a API interna do Next.js (`/api/n8n-query`), enviando um identificador único para o relatório solicitado (ex: `{ "reportId": "most_purchased_items" }`).
3.  **API Route (Backend):** A API Route em `/api/n8n-query/route.ts` recebe a requisição.
4.  **Busca da Query (Backend):** A rota de API importa um objeto (ou mapa) de um arquivo centralizador, `/lib/reports.ts`. Usando o `reportId`, ela encontra a query SQL completa e segura correspondente.
5.  **Envio para o n8n (Backend -> n8n):** A API envia a query SQL para o webhook do n8n através de uma requisição POST.
6.  **Execução (n8n):** O workflow do n8n é acionado. Seu nó de PostgreSQL recebe a query SQL.
7.  **Consulta (n8n -> DB):** O n8n executa a query diretamente no banco de dados PostgreSQL.
8.  **Retorno dos Dados (DB -> n8n -> Backend -> Frontend):** O resultado da consulta volta pelo mesmo caminho: O banco de dados envia para o n8n, que responde para a API Route, que por sua vez responde à requisição `fetch` original do frontend com os dados em formato JSON.
9.  **Renderização (Frontend):** O componente React recebe o JSON e renderiza os dados em uma tabela ou gráfico para o usuário.

## 4. Próximos Passos (Plano de Ação)

1.  **Estruturação:** Criar o arquivo `src/lib/reports.ts` para ser nosso dicionário de queries.
2.  **Backend:** Modificar a API Route `src/app/api/n8n-query/route.ts` para ler do novo dicionário de queries.
3.  **Frontend:** Ajustar a página principal (`src/app/page.tsx` ou uma página de dashboard) para disparar as solicitações de relatório usando os novos identificadores.