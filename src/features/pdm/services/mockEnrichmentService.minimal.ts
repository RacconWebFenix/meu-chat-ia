/**
 * Mock enrichment service - Versão simplificada para compatibilidade
 * DEPRECATED: Este mock não está mais sendo usado no fluxo principal
 */

import {
  EnrichmentService,
  EnrichmentRequest,
  EnrichmentResponse,
  BaseProductInfo,
} from "../types";

export class MockEnrichmentService implements EnrichmentService {
  async enrichProduct(request: EnrichmentRequest): Promise<EnrichmentResponse> {
    const { productInfo } = request;
    
    return {
      original: productInfo,
      enriched: {
        categoria: "Categoria Genérica",
        especificacoesTecnicas: {
          resumoPDM: "Resumo PDM genérico",
          especificacoesTecnicas: {
            "Campo Genérico": "Valor Genérico"
          },
        },
        aplicacao: "Aplicação Genérica",
      },
      metrics: {
        confidence: 0.5,
        source: "AI_ENRICHMENT" as any,
      },
      suggestions: [],
      warnings: [],
    };
  }
}
