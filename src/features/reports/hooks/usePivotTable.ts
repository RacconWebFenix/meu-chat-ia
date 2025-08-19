// src/features/reports/hooks/usePivotTable.ts
"use client";

import { useState, useCallback, useEffect } from "react";
import { GridColDef } from "@mui/x-data-grid";
import {
  ReportRow,
  QuotationFilters,
  PivotConfiguration,
  ProcessedPivotData,
  AggregationType,
} from "../types";
import { reportsService } from "../services/reportsService";
import { useGroup } from "@/contexts/GroupContext";

// Configuração inicial da tabela dinâmica
const INITIAL_PIVOT_CONFIG: PivotConfiguration = {
  rows: ["COMPRADOR"],
  columns: ["FORNECEDOR"],
  values: ["VALOR_TOTAL_NEGOCIADO"],
  aggregation: "sum",
};

interface ExtendedQuotationFilters extends QuotationFilters {
  pivotConfig?: PivotConfiguration;
}

// Tipo para as linhas da tabela dinâmica
interface PivotTableRow {
  id: string;
  rowHeader: string;
  total: number;
  [key: string]: string | number;
}

export function usePivotTable() {
  const { selectedGroupId, isLoading: isGroupContextLoading } = useGroup();
  const [loading, setLoading] = useState(false);
  const [rawData, setRawData] = useState<ReportRow[]>([]);
  const [processedPivotData, setProcessedPivotData] =
    useState<ProcessedPivotData | null>(null);
  const [pivotTableColumns, setPivotTableColumns] = useState<
    GridColDef<PivotTableRow>[]
  >([]);
  const [pivotTableRows, setPivotTableRows] = useState<PivotTableRow[]>([]);
  const [totalRowCount, setTotalRowCount] = useState(0);

  const [filters, setFilters] = useState<QuotationFilters>({
    reportType: "cotacao-analitico",
    startDate: "2025-07-01",
    endDate: "2025-07-31",
  });

  const [pivotConfig, setPivotConfig] =
    useState<PivotConfiguration>(INITIAL_PIVOT_CONFIG);
  const [hasSearched, setHasSearched] = useState(false);

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

  // Função para processar dados brutos em tabela dinâmica
  const processPivotData = useCallback(
    (data: ReportRow[], config: PivotConfiguration): ProcessedPivotData => {
      const pivotTable: Record<string, Record<string, number>> = {};
      const rowTotals: Record<string, number> = {};
      const columnTotals: Record<string, number> = {};
      let grandTotal = 0;

      // Coletar todos os valores únicos para linhas e colunas
      const rowHeaders = new Set<string>();
      const columnHeaders = new Set<string>();

      // Primeira passagem: identificar cabeçalhos únicos
      data.forEach((row) => {
        const rowKey = config.rows
          .map((field) => row[field] || "N/A")
          .join(" | ");
        const colKey = config.columns
          .map((field) => row[field] || "N/A")
          .join(" | ");

        rowHeaders.add(rowKey);
        columnHeaders.add(colKey);
      });

      // Segunda passagem: calcular valores agregados
      data.forEach((row) => {
        const rowKey = config.rows
          .map((field) => row[field] || "N/A")
          .join(" | ");
        const colKey = config.columns
          .map((field) => row[field] || "N/A")
          .join(" | ");

        if (!pivotTable[rowKey]) {
          pivotTable[rowKey] = {};
          rowTotals[rowKey] = 0;
        }

        if (!pivotTable[rowKey][colKey]) {
          pivotTable[rowKey][colKey] = 0;
        }

        if (!columnTotals[colKey]) {
          columnTotals[colKey] = 0;
        }

        // Calcular valor agregado baseado no tipo de agregação
        config.values.forEach((valueField) => {
          const value = Number(row[valueField]) || 0;
          let aggregatedValue = value;

          switch (config.aggregation) {
            case "sum":
              aggregatedValue = value;
              break;
            case "avg":
              // Para média, precisamos contar os registros separadamente
              aggregatedValue = value;
              break;
            case "count":
              aggregatedValue = 1;
              break;
            case "max":
              aggregatedValue = Math.max(
                pivotTable[rowKey][colKey] || 0,
                value
              );
              break;
            case "min":
              aggregatedValue =
                pivotTable[rowKey][colKey] === 0
                  ? value
                  : Math.min(pivotTable[rowKey][colKey], value);
              break;
          }

          if (config.aggregation === "max" || config.aggregation === "min") {
            pivotTable[rowKey][colKey] = aggregatedValue;
          } else {
            pivotTable[rowKey][colKey] += aggregatedValue;
          }

          if (config.aggregation !== "max" && config.aggregation !== "min") {
            rowTotals[rowKey] += aggregatedValue;
            columnTotals[colKey] += aggregatedValue;
            grandTotal += aggregatedValue;
          }
        });
      });

      // Para agregação por média, dividir pela contagem
      if (config.aggregation === "avg") {
        const countTable: Record<string, Record<string, number>> = {};

        data.forEach((row) => {
          const rowKey = config.rows
            .map((field) => row[field] || "N/A")
            .join(" | ");
          const colKey = config.columns
            .map((field) => row[field] || "N/A")
            .join(" | ");

          if (!countTable[rowKey]) countTable[rowKey] = {};
          if (!countTable[rowKey][colKey]) countTable[rowKey][colKey] = 0;
          countTable[rowKey][colKey]++;
        });

        Object.keys(pivotTable).forEach((rowKey) => {
          Object.keys(pivotTable[rowKey]).forEach((colKey) => {
            if (countTable[rowKey] && countTable[rowKey][colKey]) {
              pivotTable[rowKey][colKey] =
                pivotTable[rowKey][colKey] / countTable[rowKey][colKey];
            }
          });
        });
      }

      return {
        pivotTable,
        rowTotals,
        columnTotals,
        grandTotal,
        rowHeaders: Array.from(rowHeaders).sort(),
        columnHeaders: Array.from(columnHeaders).sort(),
      };
    },
    []
  );

  // Função para converter dados processados em formato de grid
  const convertToGridFormat = useCallback(
    (processedData: ProcessedPivotData) => {
      const columns: GridColDef<PivotTableRow>[] = [
        {
          field: "rowHeader",
          headerName: pivotConfig.rows.join(" | "),
          minWidth: 200,
          flex: 1,
        },
        ...processedData.columnHeaders.map((header) => ({
          field: header.replace(/[^a-zA-Z0-9]/g, "_"),
          headerName: header,
          minWidth: 120,
          type: "number" as const,
          align: "right" as const,
          headerAlign: "right" as const,
          valueFormatter: (value: number) => {
            if (value == null) return "-";
            return new Intl.NumberFormat("pt-BR", {
              minimumFractionDigits:
                pivotConfig.aggregation === "count" ? 0 : 2,
              maximumFractionDigits:
                pivotConfig.aggregation === "count" ? 0 : 2,
            }).format(value);
          },
        })),
        {
          field: "total",
          headerName: "Total",
          minWidth: 120,
          type: "number" as const,
          align: "right" as const,
          headerAlign: "right" as const,
          valueFormatter: (value: number) => {
            if (value == null) return "-";
            return new Intl.NumberFormat("pt-BR", {
              minimumFractionDigits:
                pivotConfig.aggregation === "count" ? 0 : 2,
              maximumFractionDigits:
                pivotConfig.aggregation === "count" ? 0 : 2,
            }).format(value);
          },
        },
      ];

      const rows = processedData.rowHeaders.map((rowHeader, index) => {
        const row: PivotTableRow = {
          id: `row_${index}`,
          rowHeader,
          total: processedData.rowTotals[rowHeader] || 0,
        };
        processedData.columnHeaders.forEach((colHeader) => {
          const fieldName = colHeader.replace(/[^a-zA-Z0-9]/g, "_");
          row[fieldName] =
            processedData.pivotTable[rowHeader]?.[colHeader] || 0;
        });

        return row;
      });

      return { columns, rows };
    },
    [pivotConfig]
  );

  const fetchData = useCallback(async () => {
    if (isGroupContextLoading) return;

    setLoading(true);
    if (!hasSearched) setHasSearched(true);

    const apiFilters: ExtendedQuotationFilters = {
      ...filters,
      page: 1,
      pageSize: 10000, // Buscar mais dados para processamento de pivot
      groupId: selectedGroupId,
      pivotConfig: pivotConfig,
    };

    try {
      const result = await reportsService.getQuotations(apiFilters);

      if (result.rows && result.rows.length > 0) {
        setRawData(result.rows);
        setTotalRowCount(result.totalRowCount);

        // Processar dados para tabela dinâmica
        const processedData = processPivotData(result.rows, pivotConfig);
        setProcessedPivotData(processedData);

        // Converter para formato de grid
        const { columns, rows } = convertToGridFormat(processedData);
        setPivotTableColumns(columns);
        setPivotTableRows(rows);
      } else {
        setRawData([]);
        setProcessedPivotData(null);
        setPivotTableColumns([]);
        setPivotTableRows([]);
        setTotalRowCount(0);
      }
    } catch (error) {
      console.error("Hook usePivotTable falhou ao buscar dados:", error);
      setRawData([]);
      setProcessedPivotData(null);
      setPivotTableColumns([]);
      setPivotTableRows([]);
      setTotalRowCount(0);
    } finally {
      setLoading(false);
    }
  }, [
    isGroupContextLoading,
    hasSearched,
    filters,
    selectedGroupId,
    pivotConfig,
    processPivotData,
    convertToGridFormat,
  ]);

  const applyFilters = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const applyPivot = useCallback(() => {
    if (rawData.length > 0) {
      // Se já temos dados, apenas reprocessar
      const processedData = processPivotData(rawData, pivotConfig);
      setProcessedPivotData(processedData);

      const { columns, rows } = convertToGridFormat(processedData);
      setPivotTableColumns(columns);
      setPivotTableRows(rows);
    } else {
      // Se não temos dados, buscar novamente
      fetchData();
    }
  }, [rawData, pivotConfig, processPivotData, convertToGridFormat, fetchData]);

  // REMOVIDO: Busca automática de dados iniciais
  // Agora só busca quando o usuário clicar em "Aplicar Filtros" ou "Gerar Tabela Dinâmica"

  return {
    loading,
    rawData,
    processedPivotData,
    pivotTableColumns,
    pivotTableRows,
    totalRowCount,
    filters,
    pivotConfig,
    handleFilterChange,
    handlePivotConfigChange,
    applyFilters,
    applyPivot,
    hasSearched,
  };
}
