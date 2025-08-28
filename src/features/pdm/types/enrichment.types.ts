// src/features/pdm/types/enrichment.types.ts

import { BaseProductInfo, ConfidenceMetrics } from "./base.types";

// Responsabilidade Única: Lidar com a requisição de enriquecimento
export interface EnrichmentRequest {
  readonly productInfo: BaseProductInfo;
  readonly options?: EnrichmentOptions;
}

// Responsabilidade Única: Lidar com a configuração do enriquecimento
export interface EnrichmentOptions {
  readonly prioritizeManufacturer?: boolean;
  readonly includeAlternatives?: boolean;
}

export interface Specification {
  readonly id: string;
  readonly key: string;
  readonly value: string;
}

export interface EnrichedProductData {
  readonly categoria: string;
  readonly subcategoria?: string;
  readonly marcaFabricante?: string;
  readonly informacoes?: string; // Campo para informações originais editáveis
  readonly especificacoesTecnicas: Record<string, unknown>;
  readonly aplicacao?: string;
  readonly normas?: string[];
  readonly pdmPadronizado?: string;
  readonly observacoes?: string[];
}

export interface EnrichmentResponse {
  readonly original: BaseProductInfo;
  readonly enriched: EnrichedProductData;
  readonly metrics: ConfidenceMetrics;
  readonly suggestions?: EnrichmentSuggestion[];
  readonly warnings?: string[];
}

export interface EnrichmentService {
  enrichProduct(request: EnrichmentRequest): Promise<EnrichmentResponse>;
}

// Responsabilidade Única: Lidar com as sugestões da IA
export interface EnrichmentSuggestion {
  readonly type: string;
  readonly field: string;
  readonly suggestedValue: string;
  readonly confidence: number;
  readonly reason: string;
}
