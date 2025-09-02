/**
 * Equivalence Search Service
 * Following Dependency Inversion Principle
 */

import {
  EquivalenceSearchService,
  EquivalenceSearchData,
  EquivalenceSearchResult,
} from "../types";

export class ApiEquivalenceSearchService implements EquivalenceSearchService {
  async searchEquivalences(
    searchData: EquivalenceSearchData
  ): Promise<EquivalenceSearchResult> {
    try {
      const response = await fetch("/api/identificacao-equivalencia", {
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
      return data;
    } catch (error) {
      throw new Error("Falha na busca de equivalências");
    }
  }
}

// Factory function following Dependency Inversion
export const createEquivalenceSearchService = (): EquivalenceSearchService => {
  return new ApiEquivalenceSearchService();
};
