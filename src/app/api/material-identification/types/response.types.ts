/**
 * Response types for Material Identification API
 * Following Interface Segregation Principle
 */

import { EnrichmentRequest } from "./request.types";

export interface EnrichmentResponse {
  response: {
    original: EnrichmentRequest;
    enriched: {
      categoria: string;
      subcategoria: string;
      marcaFabricante: string;
      nomeProdutoEncontrado: string;
      especificacoesTecnicas: {
        resumoPDM: string;
        especificacoesTecnicas: Record<string, string | number | null>;
      };
      imagens: Array<{
        image_url: string;
        origin_url: string;
        height: number;
        width: number;
      }>;
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
  response?: EnrichmentResponse["response"];
  [key: string]: unknown;
}

// Also allow array format
export type N8NResponseArray = N8NResponse[];
