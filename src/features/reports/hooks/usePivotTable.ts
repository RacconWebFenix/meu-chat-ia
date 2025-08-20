// src/features/reports/hooks/usePivotTable.ts
"use client";

import { useState, useCallback, useMemo } from "react";
import { GridColDef, GridSortModel } from "@mui/x-data-grid";
import {
  AggregatedRow,
  QuotationFilters,
  PivotConfiguration,
  ExtendedQuotationFilters,
} from "../types";
import { reportsService } from "../services/reportsService";
import { useGroup } from "@/contexts/GroupContext";
import {
  METRIC_OPTIONS,
  DIMENSION_OPTIONS,
} from "@/app/(app)/relatorios/components/DragDropPivotBuilder/fieldConfig";

const INITIAL_PIVOT_CONFIG: PivotConfiguration = {
  rows: ["COMPRADOR"],
  columns: ["FINALIZADA"], // ✅ Configuração Padrão
  values: ["VALOR_TOTAL_NEGOCIADO"],
  aggregation: "sum",
};

const INITIAL_FILTERS: QuotationFilters = {
  reportType: "cotacao-analitico",
  startDate: "2025-07-01",
  endDate: "2025-07-31",
  searchTerm: "",
};

// ... (Funções formatDateToBR, getMetricLabel, pivotDataFormatter permanecem as mesmas da versão anterior)
const formatDateToBR = (dateString: string): string => {
  if (!/^\d{4}-\d{2}-\d{2}/.test(dateString)) return dateString;
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(date);
  } catch {
    return dateString;
  }
};
const getMetricLabel = (value: string) =>
  METRIC_OPTIONS.find((opt) => opt.value === value)?.label || value;
const pivotDataFormatter = (
  longData: AggregatedRow[],
  config: PivotConfiguration
) => {
  if (
    longData.length === 0 ||
    config.rows.length === 0 ||
    config.values.length === 0
  ) {
    return { pivotRows: [], pivotColumns: [] };
  }
  const pivotDataMap = new Map<string, Record<string, unknown>>();
  const uniqueColumnValues = new Set<string>();
  longData.forEach((item) => {
    const rowKey = config.rows.map((key) => item[key] || "N/A").join(" | ");
    const colKey = config.columns.map((key) => item[key] || "N/A").join(" | ");
    if (!pivotDataMap.has(rowKey)) {
      pivotDataMap.set(rowKey, { id: rowKey, rowHeader: rowKey });
    }
    if (config.columns.length > 0) {
      uniqueColumnValues.add(colKey);
    }
    const currentEntry = pivotDataMap.get(rowKey);
    config.values.forEach((valueKey) => {
      const compositeKey =
        config.columns.length > 0 ? `${colKey}__${valueKey}` : valueKey;
      if (currentEntry) {
        currentEntry[compositeKey] =
          (Number(currentEntry[compositeKey]) || 0) +
          Number(item[valueKey] || 0);
      }
    });
  });
  const sortedColumnValues = Array.from(uniqueColumnValues).sort();
  const finalRows: (AggregatedRow & { rowHeader: string })[] = [];
  let rowIndex = 0;
  pivotDataMap.forEach((entry, rowKey) => {
    finalRows.push({
      ...entry,
      id: `${rowKey}_main_${rowIndex++}`,
      rowHeader: rowKey,
    } as AggregatedRow & { rowHeader: string });
    config.values.forEach((valueKey) => {
      const subRow: Record<string, unknown> = {
        id: `${rowKey}_sub_${valueKey}_${rowIndex++}`,
        rowHeader: `  └─ ${getMetricLabel(valueKey)}`,
      };
      let total = 0;
      if (config.columns.length > 0) {
        sortedColumnValues.forEach((colValue) => {
          const compositeKey = `${colValue}__${valueKey}`;
          const value = Number(entry[compositeKey] || 0);
          subRow[colValue] = value;
          total += value;
        });
      } else {
        const value = Number(entry[valueKey] || 0);
        subRow[config.values[0]] = value;
        total = value;
      }
      subRow.Total = total;
      finalRows.push(subRow as AggregatedRow & { rowHeader: string });
    });
  });
  const pivotColumns: GridColDef[] = [
    {
      field: "rowHeader",
      headerName: config.rows.join(" / ").replace(/_/g, " "),
      minWidth: 250,
      flex: 1,
      sortable: true,
    },
  ];
  if (config.columns.length > 0) {
    sortedColumnValues.forEach((colValue) => {
      pivotColumns.push({
        field: colValue,
        headerName: formatDateToBR(colValue),
        minWidth: 150,
        flex: 1,
        sortable: true,
        type: "number",
        align: "right",
        headerAlign: "right",
        valueFormatter: (value: number) =>
          value != null
            ? new Intl.NumberFormat("pt-BR", {
                minimumFractionDigits: 2,
              }).format(value)
            : "",
      });
    });
  } else {
    pivotColumns.push({
      field: config.values[0],
      headerName: "Valor",
      minWidth: 150,
      flex: 1,
      sortable: true,
      type: "number",
      align: "right",
      headerAlign: "right",
      valueFormatter: (value: number) =>
        value != null
          ? new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2 }).format(
              value
            )
          : "",
    });
  }
  pivotColumns.push({
    field: "Total",
    headerName: "Total Geral",
    minWidth: 160,
    flex: 1,
    sortable: true,
    type: "number",
    align: "right",
    headerAlign: "right",
    valueFormatter: (value: number) =>
      value != null
        ? new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2 }).format(
            value
          )
        : "",
    cellClassName: (params) =>
      params.id.toString().includes("_main") ? "" : "total-column-cell",
  });
  return { pivotRows: finalRows, pivotColumns };
};

export function usePivotTable() {
  const { selectedGroupId, isLoading: isGroupContextLoading } = useGroup();
  const [loading, setLoading] = useState(false);
  const [pivotTableColumns, setPivotTableColumns] = useState<
    GridColDef<AggregatedRow>[]
  >([]);
  const [pivotTableRows, setPivotTableRows] = useState<AggregatedRow[]>([]); // Armazena as linhas originais, sem ordenação
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [filters, setFilters] = useState<QuotationFilters>(INITIAL_FILTERS);
  const [pivotConfig, setPivotConfig] =
    useState<PivotConfiguration>(INITIAL_PIVOT_CONFIG);
  const [hasSearched, setHasSearched] = useState(false);

  // ✅ NOVO: Estado para controlar a ordenação
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const handleFilterChange = useCallback(
    <K extends keyof QuotationFilters>(
      field: K,
      value: QuotationFilters[K]
    ) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handlePivotConfigChange = useCallback((config: PivotConfiguration) => {
    setPivotConfig(config);
  }, []);

  const fetchData = useCallback(async () => {
    // ... (lógica do fetchData permanece a mesma)
    if (isGroupContextLoading) return;
    if (!pivotConfig.values || pivotConfig.values.length === 0) {
      alert("Por favor, selecione pelo menos um campo para a área 'Valores'.");
      return;
    }
    setLoading(true);
    setHasSearched(true);
    setPivotTableRows([]);
    setPivotTableColumns([]);
    const apiFilters: ExtendedQuotationFilters = {
      ...filters,
      groupId: selectedGroupId,
      pivotConfig: pivotConfig,
    };
    try {
      const result = await reportsService.getQuotations(apiFilters);
      if (result.rows && result.rows.length > 0) {
        const { pivotRows, pivotColumns } = pivotDataFormatter(
          result.rows,
          pivotConfig
        );
        setTotalRowCount(pivotRows.length);
        setPivotTableRows(pivotRows); // Salva as linhas originais
        setPivotTableColumns(pivotColumns);
      } else {
        setPivotTableRows([]);
        setPivotTableColumns([]);
        setTotalRowCount(0);
      }
    } catch (error) {
      console.error("Hook usePivotTable falhou ao buscar dados:", error);
      setPivotTableRows([]);
      setPivotTableColumns([]);
      setTotalRowCount(0);
    } finally {
      setLoading(false);
    }
  }, [isGroupContextLoading, filters, selectedGroupId, pivotConfig]);

  // ✅ NOVO: Lógica de ordenação que preserva os grupos
  const sortedAndFilteredRows = useMemo(() => {
    const rowsToSort = pivotTableRows; // Começa com as linhas originais

    if (sortModel.length === 0) {
      return rowsToSort;
    }

    const { field, sort } = sortModel[0];
    const groupedRows: AggregatedRow[][] = [];
    let currentGroup: AggregatedRow[] = [];

    rowsToSort.forEach((row) => {
      if (row.id.toString().includes("_main_")) {
        if (currentGroup.length > 0) groupedRows.push(currentGroup);
        currentGroup = [row];
      } else {
        currentGroup.push(row);
      }
    });
    if (currentGroup.length > 0) groupedRows.push(currentGroup);

    groupedRows.sort((groupA, groupB) => {
      const mainRowA = groupA[0];
      const mainRowB = groupB[0];
      const valueA = mainRowA[field];
      const valueB = mainRowB[field];

      if (valueA < valueB) return sort === "asc" ? -1 : 1;
      if (valueA > valueB) return sort === "asc" ? 1 : -1;
      return 0;
    });

    return groupedRows.flat();
  }, [sortModel, pivotTableRows]);

  const applyFilters = useCallback(() => {
    fetchData();
  }, [fetchData]);
  const applyPivot = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading,
    pivotTableColumns,
    pivotTableRows: sortedAndFilteredRows, // Passa as linhas ordenadas para o componente
    totalRowCount,
    filters,
    pivotConfig,
    sortModel,
    setSortModel, // Expõe o setter
    handleFilterChange,
    handlePivotConfigChange,
    applyFilters,
    applyPivot,
    hasSearched,
  };
}
