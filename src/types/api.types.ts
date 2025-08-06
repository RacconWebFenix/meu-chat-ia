// src/types/api.types.ts

// Define possíveis tipos para os valores em SqlResultRow
export type SqlValueType = string | number | boolean | null | Date;

// Tipo base para resultados SQL
export type SqlResultRow<T = Record<string, SqlValueType>> = T;

export interface AnalysisPayload<T> {
  summary: string;
  isChartable: boolean;
  rawData: SqlResultRow<T>[];
  originalQuestion: string;
}

export interface AiChartPayload<T> {
  chartType: "bar" | "line" | "pie" | "table";
  chartData: Record<string, string | number>[] | null;
  summary: string;
  rawData: SqlResultRow<T>[];
}

// Definição mais específica para metadados que podem ser incluídos em mensagens
export type MessageMetadata = Record<string, string | number | boolean | null>;

// Para DataGrid e tabelas
export type GridRow = Record<string, string | number | boolean | null>;

// Para ChartDisplay
export type ChartData = { group: string; value: number }[];

// Para Perplexity
export type PerplexityResult = Record<string, unknown>;

// Interface para imagens em mensagens
export interface Image {
  image_url: string;
  origin_url?: string;
  height?: number;
  width?: number;
}

// Interface para citações em mensagens
export interface Citation {
  url: string;
  siteName: string;
}

export interface Message<T = MessageMetadata> {
  messageId: string;
  role: "user" | "bot";
  text: string;
  isTranscription?: boolean;
  analysis?: AnalysisPayload<T>;
  chart?: AiChartPayload<T>;
  isChartLoading?: boolean;
  images?: Image[];
  citations?: Citation[];
  progressStep?: number;
}

/**
 * Alias de tipo para uso nos componentes e hooks.
 * Usa uma definição de metadados mais específica em vez de Record<string, unknown>
 */
export type AppMessage = Message<MessageMetadata>;

// ... final do seu arquivo api.types.ts

// Tipo para a resposta da API de polling
export interface PollingResponse {
  status: "completed" | "processing" | "failed";
  data?: {
    output: string; // O JSON textual vindo do "Analista"
  };
}
