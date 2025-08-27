// src/features/pdm/types/enrichment.types.ts

import { BaseProductInfo, ConfidenceMetrics } from "./base.types";

export interface Specification {
  readonly id: string;
  readonly key: string;
  readonly value: string;
}

export interface EnrichedProductData {
  readonly categoria: string;
  readonly subcategoria?: string;
  readonly marcaFabricante?: string;
  readonly especificacoesTecnicas: Record<string, unknown>;
  readonly aplicacao?: string;
  readonly normas?: string[];
  readonly pdmPadronizado?: string; // Alterado para opcional
}

export interface EnrichmentResponse {
  readonly original: BaseProductInfo;
  readonly enriched: EnrichedProductData;
  readonly metrics: ConfidenceMetrics;
}

export interface EnrichmentService {
  enrichProduct(request: {
    productInfo: BaseProductInfo;
  }): Promise<EnrichmentResponse>;
}
