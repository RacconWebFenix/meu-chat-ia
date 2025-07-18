// src/lib/reports.ts

export interface ReportColumn {
  name: string;
  displayName: string;
  type: "string" | "date" | "number";
  filterType: "text" | "select" | "date"; // Adicionado 'date'
  filterOptions?: string[];
  dbName: string;
  // Nova propriedade para buscar opções de um outro "relatório"
  optionsSource?:
    | "get_all_companies"
    | "get_distinct_status"
    | "get_all_clients";
}

export interface Report {
  id: string;
  displayName: string;
  query: string;
  columns: ReportColumn[];
  // NOVA PROPRIEDADE: Define o tipo de relatório
  reportType: "table" | "guided";
}

// src/lib/reports.ts

// ... (interface ReportColumn e Report permanecem iguais)

export const reports: Record<string, Report> = {
  // --- Relatórios do tipo "Tabela" (como antes) ---
  SERVICE_PROCESS: {
    id: "SERVICE_PROCESS",
    reportType: "table",
    displayName: "Tabela: Processos de Serviço",
    query: `
      SELECT
        sp."PROCESS_NUMBER" AS "service_process_id",
        sp."CUSTOMER_STATUS" AS "status",
        sp."REQUESTER" AS "responsible",
        sp."AUDITED_CREATED_AT" AS "creation_date",
        COALESCE(customer."NAME", customer."FANTASY_NAME", 'N/A') AS "customer_name"
      FROM "SERVICE_PROCESS" sp
      LEFT JOIN "COMPANY" customer ON sp."ID_FAVORED_CUSTOMER" = customer."ID_COMPANY"
      ORDER BY sp."AUDITED_CREATED_AT" DESC
    `,
    columns: [
      {
        name: "service_process_id",
        displayName: "ID Processo",
        type: "string",
        filterType: "text",
        dbName: 'sp."PROCESS_NUMBER"',
      },
      // ✅ Status agora usa uma fonte de dados dinâmica
      {
        name: "status",
        displayName: "Status",
        type: "string",
        filterType: "select",
        dbName: 'sp."CUSTOMER_STATUS"',
        optionsSource: "get_distinct_status", // Aponta para o novo relatório auxiliar
      },
      {
        name: "responsible",
        displayName: "Responsável",
        type: "string",
        filterType: "text",
        dbName: 'sp."REQUESTER"',
      },
      // ✅ Cliente agora usa uma fonte de dados dinâmica
      {
        name: "customer_name",
        displayName: "Cliente",
        type: "string",
        filterType: "select",
        dbName: `COALESCE(customer."NAME", customer."FANTASY_NAME", 'N/A')`,
        optionsSource: "get_all_clients", // Aponta para o novo relatório auxiliar
      },
      {
        name: "creation_date",
        displayName: "Data Criação",
        type: "date",
        filterType: "text",
        dbName: 'sp."AUDITED_CREATED_AT"',
      },
    ],
  },

  // --- Relatórios do tipo "Guiado" (Perguntas de Negócio) ---
  how_many_items_quoted: {
    id: "how_many_items_quoted",
    reportType: "guided",
    displayName: "Pergunta: Quantos itens uma empresa cotou?",
    query: `
      SELECT
        c."NAME" as "empresa",
        qi."NAME" as "item",
        COUNT(qi."ID_QUOTATION_ITEM") as "quantidade_cotada"
      FROM "QUOTATION_ITEM" qi
      JOIN "QUOTATION_PROCESS" qp ON qi."ID_QUOTATION_PROCESS" = qp."process_ptr_id"
      JOIN "COMPANY" c ON qp."ID_FAVORED_CUSTOMER" = c."ID_COMPANY"
      -- As cláusulas WHERE serão adicionadas dinamicamente
      GROUP BY c."NAME", qi."NAME"
      ORDER BY quantidade_cotada DESC;
    `,
    columns: [
      {
        name: "empresa",
        displayName: "Empresa",
        type: "string",
        filterType: "select",
        dbName: 'c."NAME"',
        optionsSource: "get_all_companies",
      },
      {
        name: "item",
        displayName: "Nome do Item",
        type: "string",
        filterType: "text",
        dbName: 'qi."NAME"',
      },
      {
        name: "periodo_inicial",
        displayName: "Data Inicial",
        type: "date",
        filterType: "date",
        dbName: 'qp."AUDITED_CREATED_AT"',
      },
      {
        name: "periodo_final",
        displayName: "Data Final",
        type: "date",
        filterType: "date",
        dbName: 'qp."AUDITED_CREATED_AT"',
      },
    ],
  },

  // --- Relatórios Auxiliares (para popular selects) ---
  get_all_companies: {
    id: "get_all_companies",
    reportType: "table", // É uma tabela simples
    displayName: "Auxiliar: Buscar todas as empresas",
    query: `SELECT "NAME" as "name" FROM "COMPANY" WHERE "NAME" IS NOT NULL ORDER BY "NAME" ASC;`,
    columns: [
      {
        name: "name",
        displayName: "Nome",
        type: "string",
        filterType: "text",
        dbName: '"NAME"',
      },
    ],
  },

  get_distinct_status: {
    id: "get_distinct_status",
    reportType: "table",
    displayName: "Auxiliar: Buscar Status Distintos",
    query: `SELECT DISTINCT "CUSTOMER_STATUS" as "name" FROM "SERVICE_PROCESS" WHERE "CUSTOMER_STATUS" IS NOT NULL ORDER BY "CUSTOMER_STATUS" ASC;`,
    columns: [],
  },

  get_all_clients: {
    id: "get_all_clients",
    reportType: "table",
    displayName: "Auxiliar: Buscar todos os Clientes",
    // ✅ CORREÇÃO: Agrupando por nome para garantir unicidade e selecionando o primeiro ID.
    query: `
      SELECT 
        COALESCE("NAME", "FANTASY_NAME") as "name",
        MIN("ID_COMPANY") as "id"
      FROM "COMPANY" 
      WHERE COALESCE("NAME", "FANTASY_NAME") IS NOT NULL 
      GROUP BY COALESCE("NAME", "FANTASY_NAME")
      ORDER BY "name" ASC;
    `,
    columns: [],
  },
};
