// src/features/pdm/services/index.ts

import { EnrichmentService } from "../types";
import { RealEnrichmentService } from "./enrichmentService";

// Exporta outros serviços para manter o padrão
export { MockExportService, createExportService } from "./exportService";
export { N8NService, createN8NService } from "./n8nService";
export type { ExportServiceInterface } from "./exportService";

// --- Serviço de Enriquecimento ---

// Esta função retorna sempre o serviço real que chama o n8n
export const createEnrichmentService = (): EnrichmentService => {
  console.log("Usando RealEnrichmentService para chamadas ao n8n.");
  return new RealEnrichmentService();
};
