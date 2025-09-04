/**
 * Material Identification Service
 * Following Dependency Inversion Principle
 */

import {
  MaterialIdentificationService,
  MaterialIdentificationResult,
  MaterialSearchData,
} from "../types";
import { MockMaterialIdentificationService } from "./mockMaterialIdentificationService";

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
      const response = await fetch("/api/material-identification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      // Map the API response to MaterialIdentificationResult
      const mappedResult = this.mapApiResponseToResult(data, searchData);

      return mappedResult;
    } catch (error) {
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
          nomeProdutoEncontrado?: string;
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
    },
    originalData: MaterialSearchData
  ): MaterialIdentificationResult {
    const response = apiResponse as {
      response?: {
        enriched?: {
          categoria?: string;
          subcategoria?: string;
          marcaFabricante?: string;
          nomeProdutoEncontrado?: string;
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
          nomeProdutoEncontrado:
            response.response?.enriched?.nomeProdutoEncontrado || "",
          especificacoesTecnicas: {
            resumoPDM:
              response.response?.enriched?.especificacoesTecnicas?.resumoPDM ||
              "",
            especificacoesTecnicas:
              response.response?.enriched?.especificacoesTecnicas
                ?.especificacoesTecnicas || {},
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
    // ✅ Using real API service - MVC architecture implemented
    return new ApiMaterialIdentificationService();
  };
