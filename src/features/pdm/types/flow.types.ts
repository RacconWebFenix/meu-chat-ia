/**
 * PDM Flow interfaces following Interface Segregation Principle
 */

import {
  BaseProductInfo,
  ProcessingStatus,
  ConfidenceMetrics,
} from "./base.types";

// Single Responsibility: Only handles PDM flow state
export interface PDMFlowState {
  readonly currentStep: PDMStep;
  readonly status: ProcessingStatus;
  readonly error: string | null;
}

// Single Responsibility: Only handles product data
export interface PDMProductData extends BaseProductInfo {
  readonly enrichedFields: Record<string, unknown>;
  readonly selectedFields: string[];
}

// Single Responsibility: Only handles enrichment results
export interface EnrichmentResult {
  readonly originalData: BaseProductInfo;
  readonly enrichedData: Record<string, unknown>;
  readonly metrics: ConfidenceMetrics;
}

// PDM Flow steps enumeration
export enum PDMStep {
  ENTRY = "entry",
  ENRICHMENT = "enrichment",
  FIELD_SELECTION = "field_selection",
  EQUIVALENCE_SEARCH = "equivalence_search",
  EXPORT = "export",
}
