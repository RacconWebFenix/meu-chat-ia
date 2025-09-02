/**
 * Hook for Equivalence Search
 * Following Single Responsibility Principle
 */

import { useState, useCallback } from "react";
import {
  EquivalenceSearchService,
  EquivalenceSearchData,
  EquivalenceSearchState,
} from "../types";

export const useEquivalenceSearch = (service: EquivalenceSearchService) => {
  const [state, setState] = useState<EquivalenceSearchState>({
    isLoading: false,
    results: null,
    error: null,
  });

  const searchEquivalences = useCallback(
    async (searchData: EquivalenceSearchData) => {
      setState({ isLoading: true, results: null, error: null });

      try {
        const results = await service.searchEquivalences(searchData);
        setState({ isLoading: false, results, error: null });
      } catch (error) {
        setState({
          isLoading: false,
          results: null,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        });
      }
    },
    [service]
  );

  const reset = useCallback(() => {
    setState({ isLoading: false, results: null, error: null });
  }, []);

  return {
    ...state,
    searchEquivalences,
    reset,
  };
};
