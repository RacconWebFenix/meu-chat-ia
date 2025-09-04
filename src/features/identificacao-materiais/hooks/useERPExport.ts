/**
 * ERP Export Hook
 * Following Single Responsibility Principle
 */

import { useState, useCallback } from "react";
import {
  ERPExportParser,
  ERPExportService,
  ERPExportState,
} from "../types/erp.types";

export const useERPExport = (
  parserService: ERPExportParser,
  exportService: ERPExportService
) => {
  const [state, setState] = useState<ERPExportState>({
    data: null,
    isExporting: false,
    error: null,
  });

  const [inputValue, setInputValue] = useState("");

  const updateInput = useCallback(
    (input: string) => {
      setInputValue(input);

      try {
        if (!input.trim()) {
          setState((prev) => ({ ...prev, data: null, error: null }));
          return;
        }

        const data = parserService.parse(input);
        setState((prev) => ({ ...prev, data, error: null }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: "Formato inválido. Use: atributo: valor; atributo2: valor2;",
        }));
      }
    },
    [parserService]
  );

  const exportData = useCallback(async () => {
    if (!state.data) return;

    setState((prev) => ({ ...prev, isExporting: true, error: null }));

    try {
      await exportService.exportToXLSX(state.data);
      // Success - could add a success message here if needed
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Erro ao exportar arquivo. Tente novamente.",
      }));
    } finally {
      setState((prev) => ({ ...prev, isExporting: false }));
    }
  }, [state.data, exportService]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    state,
    inputValue,
    updateInput,
    exportData,
    clearError,
    canExport: (state.data?.attributes?.length ?? 0) > 0 && !state.isExporting,
  };
};
