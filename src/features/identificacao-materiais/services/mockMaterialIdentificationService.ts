/**
 * Mock Material Identification Service
 * Following Dependency Inversion Principle
 */

import {
  MaterialIdentificationService,
  MaterialIdentificationResult,
  MaterialSearchData,
} from "../types";
import { getMockMaterialIdentificationData } from "./mockData";

export class MockMaterialIdentificationService
  implements MaterialIdentificationService
{
  async identifyMaterial(
    searchData: MaterialSearchData
  ): Promise<MaterialIdentificationResult> {
    // Validate input following the same rules as the real service
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

    // Simulate API delay for realistic behavior
    await this.simulateApiDelay();

    // Get mock data
    const mockResult = getMockMaterialIdentificationData();

    // Customize the result based on search data to make it more realistic
    const customizedResult = this.customizeResultForSearchData(
      mockResult,
      searchData
    );

    return customizedResult;
  }

  private async simulateApiDelay(): Promise<void> {
    // Simulate realistic API response time (500ms - 2s)
    const delay = Math.random() * 1500 + 500;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  private customizeResultForSearchData(
    baseResult: MaterialIdentificationResult,
    searchData: MaterialSearchData
  ): MaterialIdentificationResult {
    // Create a deep copy to avoid mutating the original
    const customizedResult = JSON.parse(
      JSON.stringify(baseResult)
    ) as MaterialIdentificationResult;

    // Update original information based on search data
    customizedResult.response.original.informacoes =
      `${searchData.nome} ${searchData.fabricanteMarca} ${searchData.referencia}`.trim();

    // Update enriched data based on search input
    if (searchData.nome) {
      customizedResult.response.enriched.nomeProdutoEncontrado =
        searchData.nome;
      customizedResult.response.enriched.especificacoesTecnicas.especificacoesTecnicas.nomeProduto =
        searchData.nome;
    }

    if (searchData.fabricanteMarca) {
      customizedResult.response.enriched.marcaFabricante =
        searchData.fabricanteMarca;
      customizedResult.response.enriched.especificacoesTecnicas.especificacoesTecnicas.fabricante =
        searchData.fabricanteMarca;
    }

    if (searchData.referencia) {
      customizedResult.response.enriched.especificacoesTecnicas.especificacoesTecnicas.referenciaEncontrada =
        searchData.referencia;
    }

    // Add search characteristics to suggestions if provided
    if (searchData.caracteristicas) {
      customizedResult.response.suggestions.push(
        `Características pesquisadas: ${searchData.caracteristicas}`
      );
    }

    return customizedResult;
  }
}

// Factory function following Dependency Inversion
export const createMockMaterialIdentificationService =
  (): MaterialIdentificationService => {
    return new MockMaterialIdentificationService();
  };
