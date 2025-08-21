// src/app/(app)/relatorios/components/PivotTab.tsx
"use client";

import React, { useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { GridPaginationModel } from "@mui/x-data-grid";
import { usePivotTable } from "@/features/reports/hooks/usePivotTable";
import { DragDropPivotBuilder } from "./DragDropPivotBuilder/exports";
import {
  DIMENSION_OPTIONS,
  METRIC_OPTIONS,
} from "./DragDropPivotBuilder/fieldConfig";
import { AdvancedDataGrid } from "@/components/shared";
import { PivotTableSummary } from "@/components/PivotTableSummary";
import { AggregatedRow } from "@/features/reports/types";
import { PivotConfiguration } from "./DragDropPivotBuilder/types";

// Função para converter entre os tipos de PivotConfiguration
const convertPivotConfig = (
  config: PivotConfiguration
): import("@/features/reports/types").PivotConfiguration => ({
  rows: [...config.rows],
  columns: [...config.columns],
  values: [...config.values],
  aggregation: config.aggregation,
});

// Função para converter do tipo features para o tipo DragDrop
const convertToDragDropConfig = (
  config: import("@/features/reports/types").PivotConfiguration
): PivotConfiguration => ({
  rows: config.rows as ReadonlyArray<string>,
  columns: config.columns as ReadonlyArray<string>,
  values: config.values as ReadonlyArray<string>,
  aggregation: config.aggregation,
});

export default function PivotTab() {
  const {
    loading,
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
    pivotSummary, // ✅ NOVO: Informações de resumo
  } = usePivotTable();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });

  // Handler para converter os tipos de configuração
  const handleConfigChange = (config: PivotConfiguration) => {
    handlePivotConfigChange(convertPivotConfig(config));
  };

  // Wrapper para handleFilterChange com tipos compatíveis
  const handleFilterChangeWrapper = (field: string, value: string) => {
    handleFilterChange(field as keyof typeof filters, value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        color="text.primary"
        component="h2"
        gutterBottom
        sx={{ fontWeight: 600, mb: 3 }}
      >
        📊 Análise de Cotações - Tabela Dinâmica
      </Typography>

      <Stack spacing={3}>
        {/* Construtor de Pivot com Filtros Integrados */}
        <Box>
          <DragDropPivotBuilder
            availableFields={DIMENSION_OPTIONS}
            availableMetrics={METRIC_OPTIONS}
            currentConfig={convertToDragDropConfig(pivotConfig)}
            onConfigChange={handleConfigChange}
            isLoading={loading}
            filters={filters as unknown as Record<string, unknown>}
            onFilterChange={handleFilterChangeWrapper}
            onApplyFilters={applyFilters}
            filterLoading={loading}
          />
        </Box>

        {/* Tabela */}
        <Box>
          {hasSearched && (
            <>
              <AdvancedDataGrid<AggregatedRow>
                rows={pivotTableRows}
                columns={pivotTableColumns}
                loading={loading}
                rowCount={totalRowCount}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                sortModel={[]} // ✅ DESABILITAR: Array vazio para não ter ordenação
                onSortModelChange={() => {}} // ✅ DESABILITAR: Função vazia para ignorar mudanças
                sortingMode="client"
                disableColumnFilter
                disableColumnSorting={true} // ✅ NOVO: Desabilita completamente a ordenação
                sx={{
                  "& .total-column-cell": {
                    fontWeight: "bold",
                    backgroundColor: "grey.50",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    cursor: "default !important", // ✅ DESABILITAR: Remove cursor de clique
                  },
                  "& .MuiDataGrid-columnHeader": {
                    "&:hover": {
                      backgroundColor: "transparent !important", // ✅ DESABILITAR: Remove hover
                    },
                  },
                  "& .MuiDataGrid-sortIcon": {
                    display: "none !important", // ✅ DESABILITAR: Remove ícones de ordenação
                  },
                }}
              />

              {/* ✅ NOVO: Resumo da Tabela Dinâmica */}
              <PivotTableSummary summary={pivotSummary} />
            </>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
