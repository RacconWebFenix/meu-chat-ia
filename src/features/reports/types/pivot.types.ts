// src/features/reports/types/pivot.types.ts

import { ReportRow } from "./index";

// Tipos de agregação disponíveis
export type AggregationType = "sum" | "avg" | "count" | "max" | "min";

// Configuração da tabela dinâmica
export interface PivotConfiguration {
  readonly rows: string[]; // Campos que aparecerão nas linhas
  readonly columns: string[]; // Campos que aparecerão nas colunas
  readonly values: string[]; // Campos que serão agregados
  readonly aggregation: AggregationType; // Tipo de agregação (soma, média, etc.)
}

// Dados processados da tabela dinâmica
export interface ProcessedPivotData {
  readonly pivotTable: Record<string, Record<string, Record<string, number>>>; // rowKey -> colKey -> valueKey -> value
  readonly rowTotals: Record<string, Record<string, number>>; // rowKey -> valueKey -> total
  readonly columnTotals: Record<string, Record<string, number>>; // colKey -> valueKey -> total
  readonly grandTotal: Record<string, number>; // valueKey -> grandTotal
  readonly rowHeaders: ReadonlyArray<string>;
  readonly columnHeaders: ReadonlyArray<string>;
  readonly valueHeaders: ReadonlyArray<string>; // Nomes das métricas selecionadas
}

// Configuração estendida para incluir pivot
export interface ExtendedQuotationFilters {
  readonly reportType: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly searchTerm: string;
  readonly page?: number;
  readonly pageSize?: number;
  readonly groupId?: number | null;
  readonly filterModel?: Record<string, unknown> | null;
  readonly analysisConfig?: Record<string, unknown> | null;
  readonly pivotConfig?: PivotConfiguration; // Nova configuração de pivot
}

// Opções para dimensões (baseado na sua query SQL)
export interface DimensionOption {
  readonly value: string;
  readonly label: string;
  readonly dataType: "string" | "number" | "date";
}

// Opções para métricas (campos numéricos)
export interface MetricOption {
  readonly value: string;
  readonly label: string;
  readonly aggregations: ReadonlyArray<AggregationType>;
}

// Resultado da API com dados de pivot
export interface PivotApiResponse {
  readonly rows: ReadonlyArray<ReportRow>;
  readonly totalRowCount: number;
  readonly pivotData?: ProcessedPivotData;
}

// Estado do componente de controles de pivot
export interface PivotControlsState {
  readonly availableFields: ReadonlyArray<DimensionOption>;
  readonly numericFields: ReadonlyArray<MetricOption>;
  readonly configuration: PivotConfiguration;
  readonly isProcessing: boolean;
}
