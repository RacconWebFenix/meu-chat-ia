/**
 * Material Identification Service
 * Following Dependency Inversion Principle
 */

import {
  MaterialIdentificationService,
  MaterialIdentificationResult,
  MaterialSearchData,
} from "../types";

export class ApiMaterialIdentificationService
  implements MaterialIdentificationService
{
  async identifyMaterial(
    searchData: MaterialSearchData
  ): Promise<MaterialIdentificationResult> {
    // Validate input
    if (
      !searchData.nome &&
      !searchData.caracteristicas &&
      !searchData.fabricanteMarca &&
      !searchData.referencia
    ) {
      throw new Error(
        "Pelo menos um campo deve ser preenchido para identificação"
      );
    }

    try {
      // Call the internal API
      console.log("Calling API with data:", searchData);
      const response = await fetch("/api/material-identification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("API response data:", JSON.stringify(data, null, 2));

      // Map the API response to MaterialIdentificationResult
      return this.mapApiResponseToResult(data, searchData);
    } catch (error) {
      console.error("Error calling material identification API:", error);
      throw new Error("Falha na identificação do material");
    }
  }

  private mapApiResponseToResult(
    apiResponse: {
      response?: {
        enriched?: {
          categoria?: string;
          subcategoria?: string;
          marcaFabricante?: string;
          especificacoesTecnicas?: {
            resumoPDM?: string;
            especificacoesTecnicas?: Record<string, unknown>;
          };
          imagens?: Array<{
            image_url: string;
            origin_url: string;
            height: number;
            width: number;
          }>;
        };
        metrics?: {
          confidence?: number;
          source?: string;
        };
        suggestions?: string[];
        warnings?: string[];
      };
    },
    originalData: MaterialSearchData
  ): MaterialIdentificationResult {
    const response = apiResponse as {
      response?: {
        enriched?: {
          categoria?: string;
          subcategoria?: string;
          marcaFabricante?: string;
          especificacoesTecnicas?: {
            resumoPDM?: string;
            especificacoesTecnicas?: Record<string, string | number | null>;
          };
          imagens?: Array<{
            image_url: string;
            origin_url: string;
            height: number;
            width: number;
          }>;
        };
        metrics?: {
          confidence?: number;
          source?: string;
        };
        suggestions?: string[];
        warnings?: string[];
      };
    };

    return {
      response: {
        original: {
          informacoes:
            `${originalData.nome} ${originalData.fabricanteMarca} ${originalData.referencia}`.trim(),
        },
        enriched: {
          categoria: response.response?.enriched?.categoria || "",
          subcategoria: response.response?.enriched?.subcategoria || "",
          marcaFabricante: response.response?.enriched?.marcaFabricante || "",
          especificacoesTecnicas: {
            resumoPDM:
              response.response?.enriched?.especificacoesTecnicas?.resumoPDM ||
              "",
            especificacoesTecnicas: {
              nomeProduto:
                ((
                  apiResponse.response?.enriched?.especificacoesTecnicas
                    ?.especificacoesTecnicas as Record<string, unknown>
                )?.nomeProduto as string) || "",
              fabricante:
                ((
                  apiResponse.response?.enriched?.especificacoesTecnicas
                    ?.especificacoesTecnicas as Record<string, unknown>
                )?.fabricante as string) || "",
              referenciaEncontrada:
                ((
                  apiResponse.response?.enriched?.especificacoesTecnicas
                    ?.especificacoesTecnicas as Record<string, unknown>
                )?.referenciaEncontrada as string) || "",
              ncm:
                ((
                  apiResponse.response?.enriched?.especificacoesTecnicas
                    ?.especificacoesTecnicas as Record<string, unknown>
                )?.ncm as string) || "",
              unidadeMedida:
                ((
                  apiResponse.response?.enriched?.especificacoesTecnicas
                    ?.especificacoesTecnicas as Record<string, unknown>
                )?.unidadeMedida as string) || "",
              diametroInternoMm:
                ((
                  apiResponse.response?.enriched?.especificacoesTecnicas
                    ?.especificacoesTecnicas as Record<string, unknown>
                )?.diametroInternoMm as number) || 0,
              diametroExternoMm:
                ((
                  apiResponse.response?.enriched?.especificacoesTecnicas
                    ?.especificacoesTecnicas as Record<string, unknown>
                )?.diametroExternoMm as number) || 0,
              larguraMm:
                ((
                  apiResponse.response?.enriched?.especificacoesTecnicas
                    ?.especificacoesTecnicas as Record<string, unknown>
                )?.larguraMm as number) || 0,
              materialGaiola:
                ((
                  apiResponse.response?.enriched?.especificacoesTecnicas
                    ?.especificacoesTecnicas as Record<string, unknown>
                )?.materialGaiola as string) || "",
              tipoVedacao:
                ((
                  apiResponse.response?.enriched?.especificacoesTecnicas
                    ?.especificacoesTecnicas as Record<string, unknown>
                )?.tipoVedacao as string) || "",
              capacidadeCargaDinamicaKn:
                ((
                  apiResponse.response?.enriched?.especificacoesTecnicas
                    ?.especificacoesTecnicas as Record<string, unknown>
                )?.capacidadeCargaDinamicaKn as number) || 0,
              velocidadeMaximaRpm:
                ((
                  apiResponse.response?.enriched?.especificacoesTecnicas
                    ?.especificacoesTecnicas as Record<string, unknown>
                )?.velocidadeMaximaRpm as number) || 0,
            },
          },
          imagens: response.response?.enriched?.imagens || [],
        },
        metrics: {
          confidence: response.response?.metrics?.confidence || 0.95,
          source: response.response?.metrics?.source || "AI_ENRICHMENT",
        },
        suggestions: response.response?.suggestions || [],
        warnings: response.response?.warnings || [],
      },
    };
  }
}

// Factory function following Dependency Inversion
export const createMaterialIdentificationService =
  (): MaterialIdentificationService => {
    return new ApiMaterialIdentificationService();
  };
