/**
 * Mock Equivalence Search Service
 * Following Dependency Inversion Principle
 */

import {
  EquivalenceSearchService,
  EquivalenceSearchData,
  EquivalenceSearchResult,
} from "../types";
import { getMockEquivalenceSearchData } from "./mockEquivalenceData";

export class MockEquivalenceSearchService implements EquivalenceSearchService {
  async searchEquivalences(
    searchData: EquivalenceSearchData
  ): Promise<EquivalenceSearchResult> {
    // Validate input
    if (!searchData.nome && !searchData.marcaFabricante) {
      throw new Error(
        "Pelo menos o nome ou fabricante deve ser informado para busca de equivalências"
      );
    }

    // Simulate API delay for realistic behavior
    await this.simulateApiDelay();

    // Get mock data
    const mockResult = getMockEquivalenceSearchData();

    // Filter results based on search criteria to make it more realistic
    const filteredResult = this.filterResultsBySearchData(
      mockResult,
      searchData
    );

    return filteredResult;
  }

  private async simulateApiDelay(): Promise<void> {
    // Simulate realistic API response time (800ms - 2.5s)
    const delay = Math.random() * 1700 + 800;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  private filterResultsBySearchData(
    baseResult: EquivalenceSearchResult,
    searchData: EquivalenceSearchData
  ): EquivalenceSearchResult {
    // Create a deep copy to avoid mutating the original
    const filteredResult = JSON.parse(
      JSON.stringify(baseResult)
    ) as EquivalenceSearchResult;

    // Filter equivalences based on search criteria
    filteredResult.equivalencias = baseResult.equivalencias.filter(
      (equivalence) => {
        const nameMatch =
          !searchData.nome ||
          equivalence.nome
            .toLowerCase()
            .includes(searchData.nome.toLowerCase());

        const manufacturerMatch =
          !searchData.marcaFabricante ||
          equivalence.fabricante
            .toLowerCase()
            .includes(searchData.marcaFabricante.toLowerCase());

        const categoryMatch =
          !searchData.categoria ||
          searchData.categoria.toLowerCase() === "filtro" ||
          searchData.categoria.toLowerCase() === "filtro de óleo";

        return nameMatch && manufacturerMatch && categoryMatch;
      }
    );

    // If no results match, return a subset with modified data
    if (filteredResult.equivalencias.length === 0) {
      filteredResult.equivalencias = baseResult.equivalencias
        .slice(0, 2)
        .map((eq) => ({
          ...eq,
          nome: `${searchData.nome || "Filtro"} ${eq.referencia}`,
          fabricante: searchData.marcaFabricante || eq.fabricante,
        }));
    }

    return filteredResult;
  }
}

// Factory function following Dependency Inversion
export const createMockEquivalenceSearchService =
  (): EquivalenceSearchService => {
    return new MockEquivalenceSearchService();
  };
