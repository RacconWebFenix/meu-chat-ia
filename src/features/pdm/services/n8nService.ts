/**
 * Serviço de integração com N8N para busca de equivalências
 */

import { BaseProductInfo } from "../types/base.types";
import {
  N8NEquivalenceService,
  N8NEquivalenceResponse,
  N8NEquivalence,
  EquivalenceSearchPayload,
} from "../types/n8n.types";

export class N8NService implements N8NEquivalenceService {
  private readonly webhookUrl: string;

  constructor(webhookUrl?: string) {
    this.webhookUrl =
      webhookUrl ||
      process.env.NEXT_PUBLIC_N8N_PDM_EQUIVALENCE_WEBHOOK_URL ||
      "";
  }

  /**
   * Busca equivalências via N8N
   */
  async searchEquivalents(
    productInfo: BaseProductInfo | EquivalenceSearchPayload
  ): Promise<N8NEquivalenceResponse> {
    if (!this.isServiceAvailable()) {
      throw new Error("Serviço N8N não configurado ou indisponível");
    }

    try {
      // Verifica se é payload estruturado ou simples
      const isStructuredPayload =
        "nome" in productInfo && "categoria" in productInfo;

      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productInfo),
      });

      if (!response.ok) {
        throw new Error(
          `Erro na resposta do N8N: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Validação básica da resposta
      if (!data.equivalencias || !Array.isArray(data.equivalencias)) {
        throw new Error("Resposta do N8N com formato inválido");
      }

      // CORREÇÃO TEMPORÁRIA: Distribuir imagens corretamente entre equivalências
      // O N8N está duplicando o mesmo array de imagens para todas as equivalências
      if (data.equivalencias.length > 0 && data.rawData?.images?.length > 0) {
        const allImages = data.rawData.images;
        const numEquivalencias = data.equivalencias.length;

        // Criar novas equivalências com imagens distribuídas corretamente
        data.equivalencias = data.equivalencias.map(
          (equiv: N8NEquivalence, index: number) => {
            // Distribui uma imagem diferente para cada equivalência
            // Se houver mais equivalências que imagens, reutiliza ciclicamente
            const imageIndex = index % allImages.length;
            return {
              ...equiv,
              images: [allImages[imageIndex]],
            };
          }
        );

        console.log("N8NService - Imagens redistribuídas:", {
          totalEquivalencias: numEquivalencias,
          totalImagensOriginais: allImages.length,
          distribuicao: data.equivalencias.map(
            (equiv: N8NEquivalence, idx: number) => ({
              equivalencia: idx,
              marca: equiv.marcaFabricante,
              imagem: equiv.images[0]?.image_url,
            })
          ),
        });
      }

      return data as N8NEquivalenceResponse;
    } catch (error) {
      console.error("Erro ao buscar equivalências no N8N:", error);
      throw new Error(
        error instanceof Error
          ? `Erro na integração com N8N: ${error.message}`
          : "Erro desconhecido na integração com N8N"
      );
    }
  }

  /**
   * Verifica se o serviço está disponível
   */
  isServiceAvailable(): boolean {
    return Boolean(this.webhookUrl && this.webhookUrl.trim().length > 0);
  }

  /**
   * Busca detalhes de uma equivalência específica
   */
  async getEquivalenceDetails(
    equivalenceId: string
  ): Promise<N8NEquivalence | null> {
    // Por enquanto, retorna null - pode ser implementado futuramente
    // se o N8N fornecer um endpoint específico para detalhes
    console.warn("getEquivalenceDetails ainda não implementado");
    return null;
  }
}

// Factory function para criar instância do serviço
export const createN8NService = (webhookUrl?: string): N8NService => {
  return new N8NService(webhookUrl);
};
