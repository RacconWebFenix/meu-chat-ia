// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Perplexity/Sonar API Types
export interface PerplexityResult {
  id: string;
  model: string;
  created: number;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    search_context_size: string;
  };
  citations: Citation[];
  search_results: SearchResult[];
  images: ImageResult[];
  choices: Choice[];
}

export interface Citation {
  url: string;
  siteName: string;
}

export interface SearchResult {
  title: string;
  url: string;
  date: string | null;
  last_updated?: string | null;
}

export interface ImageResult {
  image_url: string;
  origin_url: string;
  height?: number;
  width?: number;
}

export interface Choice {
  index: number;
  finish_reason: string;
  message: {
    role: string;
    content: string;
  };
}

// Grid Types
export type GridRow = Record<string, string | number>;

export interface GridTableData {
  headers: string[];
  rows: string[][];
}

// 1. Defina os tipos de gráfico permitidos
export type ApiChartType = "bar" | "line" | "pie";

// 2. Interface para os datasets do gráfico da API
export interface ApiChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
}

// 3. Interface para o objeto 'data' da resposta da API
export interface ApiChartData {
  labels: string[];
  datasets: ApiChartDataset[];
}

// 4. Interface para a resposta completa de gráfico da API
export interface ApiChartResponse {
  type: ApiChartType;
  data: ApiChartData;
}

// 5. Formato que o seu componente ChartDisplay espera
export interface DisplayChartData {
  group: string;
  value: number;
}

export type SqlQueryResultRow = Record<string, string | number | null>;

export interface Message {
  messageId?: string;
  role: "user" | "bot";
  text: string;
  images?: ImageResult[];
  citations?: Citation[];
  canGenerateChart?: boolean;
  chartPayload?: SqlQueryResultRow[];
  chartData?: DisplayChartData[];
  chartType?: ApiChartType;
  tableData?: [];
}
