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

// ============================================
// CLEAN CODE: Utility Functions (Single Responsibility)
// ============================================

/**
 * Função utilitária para identificar campos de data
 * Princípio: Single Responsibility Principle (SRP)
 */
const isDateField = (fieldName: string): boolean => {
  const datePatterns = [
    /data/i,
    /date/i,
    /finalizada/i,
    /criado/i,
    /atualizado/i,
    /timestamp/i,
  ];

  return datePatterns.some((pattern) => pattern.test(fieldName));
};

/**
 * Interface para estratégia de formatação de valores
 * Princípio: Open/Closed Principle (OCP)
 */
interface ValueFormatter {
  format(value: unknown): string;
  canHandle(fieldName: string): boolean;
}

/**
 * Formatador de datas seguindo Strategy Pattern
 * Princípio: Single Responsibility Principle (SRP)
 */
class DateValueFormatter implements ValueFormatter {
  private readonly DATE_PATTERNS = [
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, // ISO com tempo
    /^\d{4}-\d{2}-\d{2}/, // ISO simples
    /^\d{2}\/\d{2}\/\d{4}/, // DD/MM/AAAA
  ];

  canHandle(fieldName: string): boolean {
    return isDateField(fieldName);
  }

  format(value: unknown): string {
    if (!value) return "";

    // Se for uma string de data ISO
    if (typeof value === "string") {
      const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      if (isoPattern.test(value)) {
        try {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            // Usar UTC para evitar problemas de timezone
            const day = date.getUTCDate().toString().padStart(2, "0");
            const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
            const year = date.getUTCFullYear();
            return `${day}/${month}/${year}`;
          }
        } catch {
          // Se der erro, continua para outras verificações
        }
      }
    }

    // Se for um objeto Date
    if (value instanceof Date && !isNaN(value.getTime())) {
      const day = value.getUTCDate().toString().padStart(2, "0");
      const month = (value.getUTCMonth() + 1).toString().padStart(2, "0");
      const year = value.getUTCFullYear();
      return `${day}/${month}/${year}`;
    }

    return String(value);
  }
}

/**
 * Formatador padrão para valores não especializados
 * Princípio: Single Responsibility Principle (SRP)
 */
class DefaultValueFormatter implements ValueFormatter {
  canHandle(fieldName: string): boolean {
    return true; // Pode lidar com qualquer campo como fallback
  }

  format(value: unknown): string {
    return String(value || "");
  }
}

/**
 * Factory para formatadores seguindo Factory Pattern
 * Princípio: Dependency Inversion Principle (DIP)
 */
class ValueFormatterFactory {
  private readonly formatters: ValueFormatter[] = [
    new DateValueFormatter(),
    new DefaultValueFormatter(), // Sempre por último (fallback)
  ];

  getFormatter(fieldName: string): ValueFormatter {
    return (
      this.formatters.find((formatter) => formatter.canHandle(fieldName)) ||
      new DefaultValueFormatter()
    );
  }
}

/**
 * Classe responsável por formatar chaves de agrupamento
 * Princípio: Single Responsibility Principle (SRP)
 */
class GroupKeyFormatter {
  constructor(private readonly formatterFactory: ValueFormatterFactory) {}

  formatGroupKey(fields: string[], item: Record<string, unknown>): string {
    return fields
      .map((field) => {
        const value = item[field];
        const formatter = this.formatterFactory.getFormatter(field);
        return formatter.format(value) || "N/A";
      })
      .join(" | ");
  }
}

/**
 * Classe responsável por gerar colunas da tabela dinâmica
 * Princípio: Single Responsibility Principle (SRP)
 */
class PivotColumnGenerator {
  constructor(
    private readonly formatterFactory: ValueFormatterFactory,
    private readonly keyFormatter: GroupKeyFormatter
  ) {}

  generateColumns(
    config: PivotConfiguration,
    uniqueColumnValues: string[]
  ): GridColDef[] {
    const columns: GridColDef[] = [
      {
        field: "rowHeader",
        headerName: config.rows.join(" / ").replace(/_/g, " "),
        minWidth: 250,
        flex: 1,
        sortable: true,
      },
    ];

    if (config.columns.length > 0) {
      this.addDynamicColumns(columns, uniqueColumnValues);
    } else {
      this.addValueColumn(columns, config.values[0]);
    }

    this.addTotalColumn(columns);
    return columns;
  }

  private addDynamicColumns(
    columns: GridColDef[],
    uniqueColumnValues: string[]
  ): void {
    const dateFormatter = this.formatterFactory.getFormatter("DATA_REQUISICAO");

    uniqueColumnValues.forEach((colValue) => {
      // Formatar o cabeçalho da coluna se for uma data
      const formattedHeader = this.formatColumnHeader(colValue);

      columns.push({
        field: colValue,
        headerName: formattedHeader,
        minWidth: 150,
        flex: 1,
        sortable: true,
        type: "number",
        align: "right",
        headerAlign: "right",
        valueFormatter: this.formatCurrency,
      });
    });
  }

  private formatColumnHeader(colValue: string): string {
    // Se o valor é uma data ISO, formatar para padrão brasileiro
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

    if (isoDatePattern.test(colValue)) {
      try {
        const date = new Date(colValue);
        if (!isNaN(date.getTime())) {
          // Usar UTC para evitar problemas de timezone
          const day = date.getUTCDate().toString().padStart(2, "0");
          const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
          const year = date.getUTCFullYear();
          return `${day}/${month}/${year}`;
        }
      } catch {
        // Se der erro, retorna o valor original
      }
    }

    return colValue;
  }

  private addValueColumn(columns: GridColDef[], valueField: string): void {
    columns.push({
      field: valueField,
      headerName: "Valor",
      minWidth: 150,
      flex: 1,
      sortable: true,
      type: "number",
      align: "right",
      headerAlign: "right",
      valueFormatter: this.formatCurrency,
    });
  }

  private addTotalColumn(columns: GridColDef[]): void {
    columns.push({
      field: "Total",
      headerName: "Total Geral",
      minWidth: 160,
      flex: 1,
      sortable: true,
      type: "number",
      align: "right",
      headerAlign: "right",
      valueFormatter: this.formatCurrency,
      cellClassName: (params) =>
        params.id.toString().includes("_main") ? "" : "total-column-cell",
    });
  }

  private formatCurrency = (value: number): string => {
    return value != null
      ? new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2 }).format(
          value
        )
      : "";
  };
}

/**
 * Classe principal para processamento de dados do pivot
 * Princípio: Single Responsibility Principle (SRP)
 */
class PivotDataProcessor {
  private readonly formatterFactory = new ValueFormatterFactory();
  private readonly keyFormatter = new GroupKeyFormatter(this.formatterFactory);
  private readonly columnGenerator = new PivotColumnGenerator(
    this.formatterFactory,
    this.keyFormatter
  );

  process(longData: AggregatedRow[], config: PivotConfiguration) {
    if (this.isInvalidInput(longData, config)) {
      return { pivotRows: [], pivotColumns: [] };
    }

    const { pivotDataMap, uniqueColumnValues } = this.aggregateData(
      longData,
      config
    );
    const finalRows = this.generateRows(
      pivotDataMap,
      config,
      uniqueColumnValues
    );
    const pivotColumns = this.columnGenerator.generateColumns(
      config,
      Array.from(uniqueColumnValues).sort()
    );

    return { pivotRows: finalRows, pivotColumns };
  }

  private isInvalidInput(
    longData: AggregatedRow[],
    config: PivotConfiguration
  ): boolean {
    return (
      longData.length === 0 ||
      config.rows.length === 0 ||
      config.values.length === 0
    );
  }

  private aggregateData(longData: AggregatedRow[], config: PivotConfiguration) {
    const pivotDataMap = new Map<string, Record<string, unknown>>();
    const uniqueColumnValues = new Set<string>();

    longData.forEach((item) => {
      const rowKey = this.keyFormatter.formatGroupKey(config.rows, item);
      const colKey = this.keyFormatter.formatGroupKey(config.columns, item);

      this.initializeRowIfNeeded(pivotDataMap, rowKey);

      if (config.columns.length > 0) {
        uniqueColumnValues.add(colKey);
      }

      this.aggregateValues(pivotDataMap.get(rowKey)!, config, item, colKey);
    });

    return { pivotDataMap, uniqueColumnValues };
  }

  private initializeRowIfNeeded(
    pivotDataMap: Map<string, Record<string, unknown>>,
    rowKey: string
  ): void {
    if (!pivotDataMap.has(rowKey)) {
      pivotDataMap.set(rowKey, { id: rowKey, rowHeader: rowKey });
    }
  }

  private aggregateValues(
    currentEntry: Record<string, unknown>,
    config: PivotConfiguration,
    item: AggregatedRow,
    colKey: string
  ): void {
    config.values.forEach((valueKey) => {
      const compositeKey =
        config.columns.length > 0 ? `${colKey}__${valueKey}` : valueKey;
      const currentValue = Number(currentEntry[compositeKey]) || 0;
      const newValue = Number(item[valueKey]) || 0;
      currentEntry[compositeKey] = currentValue + newValue;
    });
  }

  private generateRows(
    pivotDataMap: Map<string, Record<string, unknown>>,
    config: PivotConfiguration,
    uniqueColumnValues: Set<string>
  ): (AggregatedRow & { rowHeader: string })[] {
    const finalRows: (AggregatedRow & { rowHeader: string })[] = [];
    const sortedColumnValues = Array.from(uniqueColumnValues).sort();
    let rowIndex = 0;

    pivotDataMap.forEach((entry, rowKey) => {
      finalRows.push({
        ...entry,
        id: `${rowKey}_main_${rowIndex++}`,
        rowHeader: rowKey,
      } as AggregatedRow & { rowHeader: string });

      this.generateSubRows(
        finalRows,
        entry,
        config,
        sortedColumnValues,
        rowKey,
        rowIndex
      );
    });

    return finalRows;
  }

  private generateSubRows(
    finalRows: (AggregatedRow & { rowHeader: string })[],
    entry: Record<string, unknown>,
    config: PivotConfiguration,
    sortedColumnValues: string[],
    rowKey: string,
    rowIndex: number
  ): void {
    config.values.forEach((valueKey) => {
      const subRow: Record<string, unknown> = {
        id: `${rowKey}_sub_${valueKey}_${rowIndex++}`,
        rowHeader: `  └─ ${this.getMetricLabel(valueKey)}`,
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
  }

  private getMetricLabel(value: string): string {
    return METRIC_OPTIONS.find((opt) => opt.value === value)?.label || value;
  }
}

// ============================================
// LEGACY FUNCTIONS (Compatibilidade com código existente)
// ============================================

const formatDateToBR = (dateString: string): string => {
  const formatter = new DateValueFormatter();
  return formatter.format(dateString);
};

const getMetricLabel = (value: string) =>
  METRIC_OPTIONS.find((opt) => opt.value === value)?.label || value;

const pivotDataFormatter = (
  longData: AggregatedRow[],
  config: PivotConfiguration
) => {
  const processor = new PivotDataProcessor();
  return processor.process(longData, config);
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
