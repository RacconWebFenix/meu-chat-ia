/**
 * Material Identification Service
 * Following Dependency Inversion Principle
 */

import {
  MaterialIdentificationService,
  MaterialIdentificationResult,
  MaterialSearchData,
} from "../types";
import { mockMaterialIdentificationData } from "@/mocks/material-identification";
import {
  N8NMaterialIdentificationApi,
  N8NMaterialIdentificationRequest,
} from "../types/n8n.types";

export class MockMaterialIdentificationService
  implements MaterialIdentificationService
{
  async identifyMaterial(
    searchData: MaterialSearchData
  ): Promise<MaterialIdentificationResult> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

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

    // Return mock data
    return mockMaterialIdentificationData;
  }
}

export class N8NMaterialIdentificationService
  implements MaterialIdentificationService
{
  constructor(private readonly api: N8NMaterialIdentificationApi) {}

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

    // Convert to N8N format
    const request: N8NMaterialIdentificationRequest = {
      nome: searchData.nome,
      caracteristicas: searchData.caracteristicas,
      fabricanteMarca: searchData.fabricanteMarca,
      referencia: searchData.referencia,
    };

    // Call N8N API
    const response = await this.api.identifyMaterial(request);

    if (!response.success) {
      throw new Error(response.message || "Falha na identificação do material");
    }

    // Convert N8N response to our format
    return response.data;
  }
}

export class HybridMaterialIdentificationService
  implements MaterialIdentificationService
{
  constructor(
    private readonly mockService: MaterialIdentificationService,
    private readonly n8nService: MaterialIdentificationService,
    private readonly isMockMode: boolean
  ) {}

  async identifyMaterial(
    searchData: MaterialSearchData
  ): Promise<MaterialIdentificationResult> {
    if (this.isMockMode) {
      return this.mockService.identifyMaterial(searchData);
    } else {
      // For now, show implementation message
      alert(
        "Implementação da API N8N em andamento. Use o modo Mock para testar."
      );
      throw new Error("API N8N ainda não implementada");
    }
  }
}

// Factory function following Dependency Inversion
export const createMaterialIdentificationService = (
  isMockMode: boolean = true,
  n8nApi?: N8NMaterialIdentificationApi
): MaterialIdentificationService => {
  const mockService = new MockMaterialIdentificationService();

  if (isMockMode) {
    return mockService;
  }

  if (n8nApi) {
    const n8nService = new N8NMaterialIdentificationService(n8nApi);
    return new HybridMaterialIdentificationService(
      mockService,
      n8nService,
      false
    );
  }

  return mockService;
};
