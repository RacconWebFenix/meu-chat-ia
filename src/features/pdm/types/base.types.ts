/**
 * Tipos base para o sistema PDM.
 * Interface BaseProductInfo atualizada com os novos campos.
 */

// Interface de informação base do produto
export interface BaseProductInfo {
  readonly nome?: string;
  readonly referencia?: string;
  readonly marcaFabricante?: string;
  readonly caracteristicas?: string;

  // NOVOS CAMPOS ADICIONADOS
  readonly aplicacao?: string;
  readonly breveDescricao?: string;
  readonly unidadeMedida?: string;

  // CAMPO SIMPLIFICADO PARA ENTRADA ÚNICA
  readonly informacoes?: string;
}

// Interface de identificação do produto
export interface ProductIdentification {
  readonly id: string;
  readonly timestamp: Date;
}

// Interface de métricas de confiança
export interface ConfidenceMetrics {
  readonly confidence: number;
  readonly source: DataSource;
}

// Enumeração de fontes de dados
export enum DataSource {
  USER_INPUT = "user_input",
  AI_ENRICHMENT = "ai_enrichment",
  MANUFACTURER_CATALOG = "manufacturer_catalog",
  GENERIC_DATABASE = "generic_database",
}

// Enumeração de status de processamento
export enum ProcessingStatus {
  IDLE = "idle",
  PROCESSING = "processing",
  COMPLETED = "completed",
  ERROR = "error",
}
