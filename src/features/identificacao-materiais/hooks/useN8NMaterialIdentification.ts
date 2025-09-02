/**
 * Hook for N8N Material Identification
 */

import { useState, useCallback } from "react";
import {
  N8NMaterialIdentificationApi,
  N8NMaterialIdentificationRequest,
  N8NMaterialIdentificationResponse,
} from "../types/n8n.types";

interface UseN8NMaterialIdentificationState {
  isLoading: boolean;
  result: N8NMaterialIdentificationResponse | null;
  error: string | null;
}

export const useN8NMaterialIdentification = (
  api: N8NMaterialIdentificationApi
) => {
  const [state, setState] = useState<UseN8NMaterialIdentificationState>({
    isLoading: false,
    result: null,
    error: null,
  });

  const identifyMaterial = useCallback(
    async (request: N8NMaterialIdentificationRequest) => {
      setState({ isLoading: true, result: null, error: null });

      try {
        const result = await api.identifyMaterial(request);
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
    identifyMaterial,
    reset,
  };
};
