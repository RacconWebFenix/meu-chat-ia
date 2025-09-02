/**
 * Response types for Material Identification API
 * Following Interface Segregation Principle
 */

import { EnrichmentRequest } from "./request.types";

export interface EnrichmentResponse {
  response: {
    original: EnrichmentRequest;
    enriched: {
      categoria?: string;
      subcategoria?: string;
      marcaFabricante?: string;
      nomeProdutoEncontrado?: string;
      especificacoesTecnicas: {
        resumoPDM?: string;
        especificacoesTecnicas: Record<string, string | number | null>;
      };
      imagens?: string[];
    };
    metrics: {
      confidence: number;
      source: string;
    };
    suggestions: string[];
    warnings: string[];
  };
}

export interface N8NResponse {
  output?: string;
  [key: string]: unknown;
}
