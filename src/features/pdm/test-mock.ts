/**
 * Teste rápido para verificar o MockEnrichmentService
 * Este arquivo pode ser removido após validação
 */

import { MockEnrichmentService } from "./services/mockEnrichmentService";
import { EnrichmentRequest } from "./types/enrichment.types";
import { BaseProductInfo } from "./types/base.types";

// Teste básico do service
async function testMockService() {
  const service = new MockEnrichmentService();

  const testProduct: BaseProductInfo = {
    nome: "Rolamento de Esferas",
    referencia: "6205-2rs",
    marcaFabricante: "SKF",
  };

  const request: EnrichmentRequest = {
    productInfo: testProduct,
  };

  try {
    const result = await service.enrichProduct(request);
    console.log("✅ Mock service funcionando:", result.enriched.categoria);
    console.log("✅ PDM gerado:", result.enriched.pdmPadronizado);
  } catch (error) {
    console.error("❌ Erro no mock service:", error);
  }
}

// Para uso em desenvolvimento
if (typeof window === "undefined") {
  testMockService();
}

export {};
