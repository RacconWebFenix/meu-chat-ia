// src/features/pdm/services/enrichmentService.ts

import {
  EnrichmentRequest,
  EnrichmentResponse,
  EnrichmentService,
} from "../types";

// A nossa função de guarda de tipo continua perfeita e não precisa de mudanças.
function isEnrichmentResponse(data: unknown): data is EnrichmentResponse {
  if (typeof data !== "object" || data === null) {
    return false;
  }
  const hasOriginal = "original" in data;
  const hasEnriched = "enriched" in data;
  const hasMetrics = "metrics" in data;
  return hasOriginal && hasEnriched && hasMetrics;
}

export class RealEnrichmentService implements EnrichmentService {
  private webhookUrl: string;

  constructor() {
    const url = process.env.NEXT_PUBLIC_N8N_ENRICHMENT_WEBHOOK_URL;
    if (!url) {
      throw new Error(
        "A URL do webhook n8n (NEXT_PUBLIC_N8N_ENRICHMENT_WEBHOOK_URL) não está configurada em .env.local"
      );
    }
    this.webhookUrl = url;
  }

  async enrichProduct(request: EnrichmentRequest): Promise<EnrichmentResponse> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request.productInfo),
      });

      if (!response.ok) {
        throw new Error(
          `Erro na chamada ao n8n: ${response.statusText} (Status: ${response.status})`
        );
      }

      const responseData: unknown = await response.json();

      // --- CORREÇÃO PRINCIPAL AQUI ---
      // Verificamos se a resposta é um array e se contém pelo menos um item.
      if (Array.isArray(responseData) && responseData.length > 0) {
        const firstItem = responseData[0]; // Pegamos o primeiro item do array

        // Agora, extraímos a propriedade 'response' DESTE PRIMEIRO ITEM.
        const finalData =
          typeof firstItem === "object" &&
          firstItem !== null &&
          "response" in firstItem
            ? (firstItem as { response: unknown }).response
            : null;

        // E continuamos com a nossa validação normal.
        if (isEnrichmentResponse(finalData)) {
          return finalData;
        }
      }

      // Se a estrutura não for um array com o objeto esperado, lançamos o erro.
      console.error("Formato de resposta inválido do n8n:", responseData);
      throw new Error(
        "A resposta do n8n não corresponde à estrutura esperada (esperado um array com um objeto contendo 'response')."
      );
    } catch (error) {
      console.error(
        "Falha ao comunicar com o serviço de enriquecimento:",
        error
      );
      throw error;
    }
  }

  // Métodos de placeholder
  isManufacturerSupported(manufacturer: string): boolean {
    return true;
  }
  getSupportedCategories(): string[] {
    return [];
  }
}
