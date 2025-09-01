/**
 * Custom hook for Material Identification feature
 * Following Single Responsibility Principle and Dependency Inversion
 */

import { useState, useCallback } from "react";
import {
  MaterialIdentificationState,
  MaterialSearchData,
  MaterialIdentificationService,
} from "../types";

interface UseMaterialIdentificationProps {
  service: MaterialIdentificationService;
}

export const useMaterialIdentification = ({
  service,
}: UseMaterialIdentificationProps) => {
  const [state, setState] = useState<MaterialIdentificationState>({
    isLoading: false,
    searchData: {
      nome: "",
      caracteristicas: "",
      fabricanteMarca: "",
      referencia: "",
    },
    result: null,
    error: null,
  });

  const updateSearchData = useCallback(
    (field: keyof MaterialSearchData, value: string) => {
      setState((prev) => ({
        ...prev,
        searchData: {
          ...prev.searchData,
          [field]: value,
        },
      }));
    },
    []
  );

  const identifyMaterial = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await service.identifyMaterial(state.searchData);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        result,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      }));
    }
  }, [service, state.searchData]);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      searchData: {
        nome: "",
        caracteristicas: "",
        fabricanteMarca: "",
        referencia: "",
      },
      result: null,
      error: null,
    });
  }, []);

  return {
    state,
    updateSearchData,
    identifyMaterial,
    reset,
  };
};
