/**
 * Hook for N8N Equivalence Search
 */

import { useState, useCallback } from "react";
import {
  N8NEquivalenceSearchApi,
  N8NEquivalenceSearchRequest,
  N8NEquivalenceSearchResponse,
} from "../types/n8n.types";

interface UseN8NEquivalenceSearchState {
  isLoading: boolean;
  result: N8NEquivalenceSearchResponse | null;
  error: string | null;
}

export const useN8NEquivalenceSearch = (api: N8NEquivalenceSearchApi) => {
  const [state, setState] = useState<UseN8NEquivalenceSearchState>({
    isLoading: false,
    result: null,
    error: null,
  });

  const searchEquivalences = useCallback(
    async (request: N8NEquivalenceSearchRequest) => {
      setState({ isLoading: true, result: null, error: null });

      try {
        const result = await api.searchEquivalences(request);
        setState({ isLoading: false, result, error: null });
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro desconhecido";
        setState({ isLoading: false, result: null, error: errorMessage });
        throw error;
      }
    },
    [api]
  );

  const reset = useCallback(() => {
    setState({ isLoading: false, result: null, error: null });
  }, []);

  return {
    ...state,
    searchEquivalences,
    reset,
  };
};
