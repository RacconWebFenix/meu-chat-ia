"use client";
import { useState, useEffect } from "react";
import { useGrid } from "../../../contexts/GridContext";
import { validarInformacoesService } from "../services";
import { ValidarInformacoesState, ValidarInformacoesConfig } from "../types";
import { parseSelectedRows } from "../../../app/(app)/validar-informacoes/utils/parseSelectedRows";

const DEFAULT_CONFIG: ValidarInformacoesConfig = {
  useMock: false, // Toggle between mock and real API
  autoLoadMock: true, // Auto-load mock data on mount
};

export function useValidarInformacoes(
  config: Partial<ValidarInformacoesConfig> = {}
) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // State management
  const [state, setState] = useState<ValidarInformacoesState>({
    selectedRows: [],
    selectedRowData: null,
    result: null,
    pesquisadasRows: [],
  });

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Grid context
  const { selectedGrid, inputRows, inputHeaders } = useGrid();
  const dataArr = parseSelectedRows(selectedGrid) || [];

  // Auto-load mock data on mount
  useEffect(() => {
    if (finalConfig.useMock && finalConfig.autoLoadMock) {
      validarInformacoesService.getMockData().then((mockData) => {
        setState((prev) => ({ ...prev, result: mockData }));
      });
    }
  }, [finalConfig.useMock, finalConfig.autoLoadMock]);

  // Row selection handlers
  const handleRowSelect = (rowIdx: number | null) => {
    if (rowIdx === null) {
      setState((prev) => ({
        ...prev,
        selectedRows: [],
        selectedRowData: null,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        selectedRows: [rowIdx],
        selectedRowData: dataArr[rowIdx] || null,
      }));
    }
  };

  const markRowAsPesquisada = (rowIdx: number) => {
    setState((prev) => ({
      ...prev,
      pesquisadasRows: [...prev.pesquisadasRows, rowIdx].filter(
        (v, i, arr) => arr.indexOf(v) === i
      ),
    }));
  };

  // Validation handler
  const handleValidar = async () => {
    if (!state.selectedRowData) return;

    // If using mock, data is already loaded, just mark as pesquisada
    if (finalConfig.useMock) {
      if (state.selectedRows.length > 0) {
        markRowAsPesquisada(state.selectedRows[0]);
        handleRowSelect(null);
      }
      return;
    }

    // Real API call
    setLoading(true);
    setError(null);

    try {
      const result = await validarInformacoesService.validateProduct(
        state.selectedRowData,
        false
      );

      setState((prev) => ({ ...prev, result }));
      if (state.selectedRows.length > 0) {
        markRowAsPesquisada(state.selectedRows[0]);
        handleRowSelect(null);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    selectedRows: state.selectedRows,
    selectedRowData: state.selectedRowData,
    result: state.result,
    pesquisadasRows: state.pesquisadasRows,

    // Grid data
    dataArr,
    inputRows,
    inputHeaders,

    // Loading & Error
    loading,
    error,

    // Actions
    handleRowSelect,
    handleValidar,
    markRowAsPesquisada,

    // Config
    config: finalConfig,
  };
}
