/**
 * Enrichment types following Interface Segregation Principle
 * Each interface has a single, specific responsibility
 */

import { BaseProductInfo, ConfidenceMetrics, DataSource } from './base.types';

// Single Responsibility: Handle enrichment request
export interface EnrichmentRequest {
  readonly productInfo: BaseProductInfo;
  readonly options?: EnrichmentOptions;
}

// Single Responsibility: Handle enrichment configuration
export interface EnrichmentOptions {
  readonly prioritizeManufacturer?: boolean;
  readonly includeAlternatives?: boolean;
  readonly detailLevel?: 'basic' | 'detailed' | 'comprehensive';
}

// Single Responsibility: Handle enriched product data
export interface EnrichedProductData {
  readonly categoria: string;
  readonly subcategoria?: string;
  readonly especificacoesTecnicas: Record<string, string>;
  readonly aplicacao?: string;
  readonly normas?: string[];
  readonly pdmPadronizado: string;
  readonly observacoes?: string[];
}

// Single Responsibility: Handle enrichment response
export interface EnrichmentResponse {
  readonly original: BaseProductInfo;
  readonly enriched: EnrichedProductData;
  readonly metrics: ConfidenceMetrics;
  readonly suggestions?: EnrichmentSuggestion[];
  readonly warnings?: string[];
}

// Single Responsibility: Handle AI suggestions
export interface EnrichmentSuggestion {
  readonly type: 'manufacturer' | 'category' | 'specification';
  readonly field: string;
  readonly suggestedValue: string;
  readonly confidence: number;
  readonly reason: string;
}

// Single Responsibility: Handle enrichment service contract
export interface EnrichmentService {
  enrichProduct(request: EnrichmentRequest): Promise<EnrichmentResponse>;
  isManufacturerSupported(manufacturer: string): boolean;
  getSupportedCategories(): string[];
}
