/**
 * Base types for PDM system following SOLID principles
 * Interface Segregation Principle: Small, specific interfaces
 */

// Base product information interface
export interface BaseProductInfo {
  readonly nome: string;
  readonly referencia?: string;
  readonly marcaFabricante?: string;
  readonly caracteristicas?: string;
}

// Product identification interface
export interface ProductIdentification {
  readonly id: string;
  readonly timestamp: Date;
}

// Confidence tracking interface
export interface ConfidenceMetrics {
  readonly confidence: number;
  readonly source: DataSource;
}

// Data source enumeration
export enum DataSource {
  USER_INPUT = "user_input",
  AI_ENRICHMENT = "ai_enrichment",
  MANUFACTURER_CATALOG = "manufacturer_catalog",
  GENERIC_DATABASE = "generic_database",
}

// Processing status enumeration
export enum ProcessingStatus {
  IDLE = "idle",
  PROCESSING = "processing",
  COMPLETED = "completed",
  ERROR = "error",
}
