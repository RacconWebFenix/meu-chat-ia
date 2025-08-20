// src/features/reports/types/pivot.types.ts

// O tipo ReportRow, que representa uma linha de dado agregado vinda da API.
// É um registro flexível que pode ter qualquer chave string, com valores sendo string ou número.
// A propriedade 'id' é obrigatória para compatibilidade com o MUI DataGrid.
export type AggregatedRow = {
  readonly id: string;
} & Record<string, string | number>;

// Tipos de agregação disponíveis (sem alteração)
export type AggregationType = "sum" | "avg" | "count" | "max" | "min";

// Configuração da tabela dinâmica (sem alteração)
export interface PivotConfiguration {
  readonly rows: string[];
  readonly columns: string[];
  readonly values: string[];
  readonly aggregation: AggregationType;
}

// Configuração estendida para os filtros
export interface ExtendedQuotationFilters {
  readonly reportType: string;
  readonly startDate: string;
  readonly endDate: string;
  // ✅ CORRIGIDO: searchTerm agora é opcional para corresponder ao uso real.
  readonly searchTerm?: string;
  readonly page?: number;
  readonly pageSize?: number;
  readonly groupId?: number | null;
  readonly filterModel?: Record<string, unknown> | null;
  readonly analysisConfig?: Record<string, unknown> | null;
  readonly pivotConfig?: PivotConfiguration;
}

// Opções para dimensões (sem alteração)
export interface DimensionOption {
  readonly value: string;
  readonly label: string;
  readonly dataType: "string" | "number" | "date";
}

// Opções para métricas (sem alteração)
export interface MetricOption {
  readonly value: string;
  readonly label: string;
  readonly aggregations: ReadonlyArray<AggregationType>;
}

// Resultado da API com dados de pivot
export interface PivotApiResponse {
  readonly rows: ReadonlyArray<AggregatedRow>;
  readonly totalRowCount: number;
}

// Estado do componente de controles de pivot (sem alteração)
export interface PivotControlsState {
  readonly availableFields: ReadonlyArray<DimensionOption>;
  readonly numericFields: ReadonlyArray<MetricOption>;
  readonly configuration: PivotConfiguration;
  readonly isProcessing: boolean;
}
