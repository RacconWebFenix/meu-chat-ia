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

// ✅ FUNÇÕES AUXILIARES PARA TRATAMENTO DE DATAS
const DATE_FIELDS = ["FINALIZADA", "DATA_REQUISICAO", "DATA_NECESSIDADE"];

// Função para normalizar valores de coluna (especialmente datas)
const normalizeColumnValue = (field: string, value: unknown): string => {
  if (!value) return "N/A";

  // Verificar se é campo de data
  if (DATE_FIELDS.includes(field)) {
    try {
      const date = new Date(String(value));
      // Retornar apenas a parte da data YYYY-MM-DD para agrupamento
      return date.toISOString().split("T")[0];
    } catch {
      return "N/A";
    }
  }

  return String(value);
};

// Função para formatar data para brasileiro
const formatDateToBR = (dateString: string): string => {
  try {
    // Se já está formatado, retornar como está
    if (dateString.includes("/")) return dateString;

    // Se é formato YYYY-MM-DD, formatar para DD/MM/YYYY
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const date = new Date(dateString + "T00:00:00.000Z");
      return date.toLocaleDateString("pt-BR");
    }

    return dateString;
  } catch {
    return dateString;
  }
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
      const pivotTable: Record<
        string,
        Record<string, Record<string, number>>
      > = {};
      const rowTotals: Record<string, Record<string, number>> = {};
      const columnTotals: Record<string, Record<string, number>> = {};
      const grandTotal: Record<string, number> = {};

      // Inicializar grandTotal para cada métrica
      config.values.forEach((valueField) => {
        grandTotal[valueField] = 0;
      });

      // Coletar todos os valores únicos para linhas e colunas
      const rowHeaders = new Set<string>();
      const columnHeaders = new Set<string>();

      // Primeira passagem: identificar cabeçalhos únicos com normalização de datas
      data.forEach((row) => {
        const rowKey = config.rows
          .map((field) => normalizeColumnValue(field, row[field]))
          .join(" | ");
        const colKey = config.columns
          .map((field) => normalizeColumnValue(field, row[field]))
          .join(" | ");

        rowHeaders.add(rowKey);
        columnHeaders.add(colKey);
      });

      // Segunda passagem: calcular valores agregados com normalização de datas
      data.forEach((row) => {
        const rowKey = config.rows
          .map((field) => normalizeColumnValue(field, row[field]))
          .join(" | ");
        const colKey = config.columns
          .map((field) => normalizeColumnValue(field, row[field]))
          .join(" | ");

        if (!pivotTable[rowKey]) {
          pivotTable[rowKey] = {};
          rowTotals[rowKey] = {};
        }

        if (!pivotTable[rowKey][colKey]) {
          pivotTable[rowKey][colKey] = {};
        }

        if (!columnTotals[colKey]) {
          columnTotals[colKey] = {};
        }

        // Calcular valor agregado baseado no tipo de agregação - PARA CADA MÉTRICA
        config.values.forEach((valueField) => {
          const value = Number(row[valueField]) || 0;
          let aggregatedValue = value;

          // Inicializar estruturas se necessário
          if (!pivotTable[rowKey][colKey][valueField]) {
            pivotTable[rowKey][colKey][valueField] = 0;
          }
          if (!rowTotals[rowKey][valueField]) {
            rowTotals[rowKey][valueField] = 0;
          }
          if (!columnTotals[colKey][valueField]) {
            columnTotals[colKey][valueField] = 0;
          }

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
                pivotTable[rowKey][colKey][valueField] || 0,
                value
              );
              break;
            case "min":
              aggregatedValue =
                pivotTable[rowKey][colKey][valueField] === 0
                  ? value
                  : Math.min(pivotTable[rowKey][colKey][valueField], value);
              break;
          }

          if (config.aggregation === "max" || config.aggregation === "min") {
            pivotTable[rowKey][colKey][valueField] = aggregatedValue;
          } else {
            pivotTable[rowKey][colKey][valueField] += aggregatedValue;
          }

          if (config.aggregation !== "max" && config.aggregation !== "min") {
            rowTotals[rowKey][valueField] += aggregatedValue;
            columnTotals[colKey][valueField] += aggregatedValue;
            grandTotal[valueField] += aggregatedValue;
          }
        });
      });

      // Para agregação por média, dividir pela contagem
      if (config.aggregation === "avg") {
        const countTable: Record<
          string,
          Record<string, Record<string, number>>
        > = {};

        data.forEach((row) => {
          const rowKey = config.rows
            .map((field) => normalizeColumnValue(field, row[field]))
            .join(" | ");
          const colKey = config.columns
            .map((field) => normalizeColumnValue(field, row[field]))
            .join(" | ");

          if (!countTable[rowKey]) countTable[rowKey] = {};
          if (!countTable[rowKey][colKey]) countTable[rowKey][colKey] = {};

          config.values.forEach((valueField) => {
            if (!countTable[rowKey][colKey][valueField]) {
              countTable[rowKey][colKey][valueField] = 0;
            }
            countTable[rowKey][colKey][valueField]++;
          });
        });

        Object.keys(pivotTable).forEach((rowKey) => {
          Object.keys(pivotTable[rowKey]).forEach((colKey) => {
            config.values.forEach((valueField) => {
              if (countTable[rowKey]?.[colKey]?.[valueField]) {
                pivotTable[rowKey][colKey][valueField] =
                  pivotTable[rowKey][colKey][valueField] /
                  countTable[rowKey][colKey][valueField];
              }
            });
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
        valueHeaders: config.values, // ✅ NOVO: Lista das métricas
      };
    },
    []
  );

  // Função para converter dados processados em formato de grid
  const convertToGridFormat = useCallback(
    (processedData: ProcessedPivotData) => {
      // Criar colunas dinamicamente
      const columns: GridColDef<PivotTableRow>[] = [
        {
          field: "rowHeader",
          headerName: pivotConfig.rows.join(" | "),
          minWidth: 250, // Aumentado para comportar indentação
          flex: 1,
        },
        ...processedData.columnHeaders.map((header) => ({
          field: header.replace(/[^a-zA-Z0-9]/g, "_"),
          headerName: formatDateToBR(header), // ✅ APLICAR FORMATAÇÃO PT-BR
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

      // ✅ NOVA LÓGICA: Criar sub-linhas quando há múltiplos valores
      const rows: PivotTableRow[] = [];
      let rowIndex = 0;

      processedData.rowHeaders.forEach((rowHeader) => {
        if (processedData.valueHeaders.length === 1) {
          // Modo simples: uma linha por rowHeader
          const valueField = processedData.valueHeaders[0];
          const row: PivotTableRow = {
            id: `row_${rowIndex++}`,
            rowHeader,
            total: processedData.rowTotals[rowHeader]?.[valueField] || 0,
          };

          processedData.columnHeaders.forEach((colHeader) => {
            const fieldName = colHeader.replace(/[^a-zA-Z0-9]/g, "_");
            row[fieldName] =
              processedData.pivotTable[rowHeader]?.[colHeader]?.[valueField] ||
              0;
          });

          rows.push(row);
        } else {
          // ✅ Modo expandido: sub-linhas para cada métrica
          processedData.valueHeaders.forEach((valueField, valueIndex) => {
            // Buscar label amigável da métrica
            const metricLabel = getMetricLabel(valueField);
            const isFirstMetric = valueIndex === 0;

            const row: PivotTableRow = {
              id: isFirstMetric
                ? `row_${rowIndex++}_main` // Linha principal
                : `row_${rowIndex++}_sub_${valueField}`, // Sub-linha com identificador da métrica
              rowHeader: isFirstMetric
                ? rowHeader // Primeira sub-linha mostra o nome do comprador
                : `  └─ ${metricLabel}`, // Sub-linhas com indentação e nome da métrica
              total: processedData.rowTotals[rowHeader]?.[valueField] || 0,
            };

            processedData.columnHeaders.forEach((colHeader) => {
              const fieldName = colHeader.replace(/[^a-zA-Z0-9]/g, "_");
              row[fieldName] =
                processedData.pivotTable[rowHeader]?.[colHeader]?.[
                  valueField
                ] || 0;
            });

            rows.push(row);
          });
        }
      });

      return { columns, rows };
    },
    [pivotConfig]
  );

  // ✅ FUNÇÃO AUXILIAR: Obter label amigável da métrica
  const getMetricLabel = (valueField: string): string => {
    const metricLabels: Record<string, string> = {
      QUANTIDADE: "Quantidade",
      VALOR_UNIT_ULT_COMPRA: "Valor Unit. Última Compra",
      PRECO_NEGOCIADO: "Preço Negociado",
      VALOR_TOTAL_NEGOCIADO: "Valor Total Negociado",
      SAVING_ULT_COMPRA: "Saving (Última Compra)",
      SAVING_MELHOR_PRECO: "Saving (Melhor Preço)",
      ESTIMATIVA_VALOR: "Estimativa Valor",
    };
    return metricLabels[valueField] || valueField;
  };

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
