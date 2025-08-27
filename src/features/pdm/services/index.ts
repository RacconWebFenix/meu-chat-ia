// src/features/pdm/services/index.ts

import { EnrichmentService } from "../types";
import { MockEnrichmentService } from "./mockEnrichmentService";
import { RealEnrichmentService } from "./enrichmentService"; // Agora a importação funciona

// Exporta outros serviços para manter o padrão
export { MockEquivalenceService } from "./mockEquivalenceService";
export { MockExportService, createExportService } from "./exportService";
export { N8NService, createN8NService } from "./n8nService";
export type { ExportServiceInterface } from "./exportService";

// --- Inversão de Dependência (SOLID) ---

// Esta função fábrica decide qual implementação do serviço de enriquecimento usar
// com base na flag 'NEXT_PUBLIC_USE_MOCK_API' do seu arquivo .env.local
export const createEnrichmentService = (): EnrichmentService => {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

  console.log(useMock);

  if (useMock) {
    // Se a flag for 'true', usamos o serviço mock.
    console.warn(
      "FLAG ATIVA: Usando MockEnrichmentService para dados simulados."
    );
    return new MockEnrichmentService();
  } else {
    // Se a flag for 'false' ou não estiver definida, usamos o serviço real que chama o n8n.
    console.log(
      "FLAG INATIVA: Usando RealEnrichmentService para chamadas ao n8n."
    );
    return new RealEnrichmentService();
  }
};
