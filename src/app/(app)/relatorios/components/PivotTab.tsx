// src/app/(app)/relatorios/components/PivotTab.tsx
"use client";

import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import QuotationsFilters from "./QuotationsFilters";
import { DragDropPivotBuilder } from "./DragDropPivotBuilder/exports";
import {
  DIMENSION_OPTIONS,
  METRIC_OPTIONS,
} from "./DragDropPivotBuilder/fieldConfig";
import { usePivotTable } from "@/features/reports/hooks/usePivotTable";
import AdvancedDataGrid from "@/components/shared/AdvancedDataGrid/AdvancedDataGrid";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

// Tipos
import type { PivotConfiguration as OldPivotConfiguration } from "@/features/reports/types/pivot.types";
import type { PivotConfiguration as NewPivotConfiguration } from "./DragDropPivotBuilder/types";

// ====================================
// ADAPTADORES DE TIPOS
// ====================================

const convertToNewConfig = (
  oldConfig: OldPivotConfiguration
): NewPivotConfiguration => {
  return {
    rows: [...oldConfig.rows],
    columns: [...oldConfig.columns],
    values: [...oldConfig.values],
    aggregation: oldConfig.aggregation,
  };
};

const convertToOldConfig = (
  newConfig: NewPivotConfiguration
): OldPivotConfiguration => {
  return {
    rows: [...newConfig.rows],
    columns: [...newConfig.columns],
    values: [...newConfig.values],
    aggregation: newConfig.aggregation,
  };
};

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

export default function PivotTab() {
  // Estado local para filtros do drag & drop (não enviados ao backend)
  const [localFilters, setLocalFilters] = React.useState<string[]>([]);

  const {
    loading,
    pivotTableColumns,
    pivotTableRows,
    totalRowCount,
    filters,
    pivotConfig,
    processedPivotData,
    handleFilterChange,
    handlePivotConfigChange,
    applyFilters,
    applyPivot,
    hasSearched,
  } = usePivotTable();

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, backgroundColor: "white", borderRadius: 2 }}
    >
      {/* Filtros de Dados */}
      <QuotationsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={applyFilters}
        loading={loading}
      />

      {/* Controles da Tabela Dinâmica com Drag & Drop */}
      <Box sx={{ mb: 3 }}>
        <DragDropPivotBuilder
          availableFields={DIMENSION_OPTIONS}
          availableMetrics={METRIC_OPTIONS}
          currentConfig={convertToNewConfig(pivotConfig)}
          onConfigChange={(newConfig) => {
            // Converte para configuração antiga
            const oldConfig = convertToOldConfig(newConfig);
            handlePivotConfigChange(oldConfig);
          }}
          isLoading={loading}
        />

        {/* Botão para Aplicar Configuração */}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            size="large"
            onClick={applyPivot}
            disabled={loading}
            startIcon={<PlayArrowIcon />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4,
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            {loading ? "Gerando Tabela..." : "Gerar Tabela Dinâmica"}
          </Button>
        </Box>
      </Box>

      {/* Estatísticas da Tabela Dinâmica */}
      {processedPivotData && (
        <Box sx={{ mb: 2, p: 2, backgroundColor: "grey.50", borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            📊 <strong>Resumo:</strong> {processedPivotData.rowHeaders.length}{" "}
            linhas × {processedPivotData.columnHeaders.length} colunas
            {processedPivotData.valueHeaders.length > 0 && (
              <>
                {" "}
                | <strong>Métricas:</strong>{" "}
                {processedPivotData.valueHeaders.length}
                {processedPivotData.valueHeaders.map((valueField, index) => {
                  const total = processedPivotData.grandTotal[valueField] || 0;
                  if (total > 0) {
                    return (
                      <span key={valueField}>
                        {index === 0 ? " | " : ", "}
                        <strong>{getMetricLabel(valueField)}:</strong>{" "}
                        {new Intl.NumberFormat("pt-BR", {
                          minimumFractionDigits:
                            pivotConfig.aggregation === "count" ? 0 : 2,
                          maximumFractionDigits:
                            pivotConfig.aggregation === "count" ? 0 : 2,
                        }).format(total)}
                      </span>
                    );
                  }
                  return null;
                })}
              </>
            )}
          </Typography>
        </Box>
      )}

      {/* Tabela Dinâmica */}
      {pivotTableColumns.length > 0 && pivotTableRows.length > 0 ? (
        <AdvancedDataGrid
          rows={pivotTableRows}
          columns={pivotTableColumns}
          loading={loading}
          rowCount={pivotTableRows.length}
          paginationModel={{ page: 0, pageSize: 100 }}
          onPaginationModelChange={() => {}} // Não precisamos de paginação para pivot
          filterModel={{ items: [] }}
          onFilterModelChange={() => {}} // Filtros são aplicados nos controles
          sx={{
            // ✅ Estilos Material-UI para sub-linhas
            "& .MuiDataGrid-row": {
              // Estilo para linhas principais (compradores)
              '&[data-id$="_main"]': {
                fontWeight: 600,
                backgroundColor: "rgba(25, 118, 210, 0.04)",
              },
              // Estilo para sub-linhas (métricas)
              '&[data-id*="_sub_"]': {
                backgroundColor: "rgba(0, 0, 0, 0.02)",
                borderLeft: "3px solid #1976d2",
                '& .MuiDataGrid-cell[data-field="rowHeader"]': {
                  paddingLeft: "24px",
                  fontStyle: "italic",
                  color: "text.secondary",
                  fontSize: "0.875rem",
                },
              },
            },
            '& .MuiDataGrid-cell[data-field="rowHeader"]': {
              fontWeight: "inherit",
            },
          }}
        />
      ) : (
        <Box sx={{ textAlign: "center", py: 4 }}>
          {!hasSearched ? (
            <Typography color="text.secondary">
              Configure a tabela dinâmica e clique em &quot;Gerar Tabela
              Dinâmica&quot;.
            </Typography>
          ) : loading ? (
            <Typography color="text.secondary">Carregando dados...</Typography>
          ) : (
            <Typography color="text.secondary">
              Nenhum dado encontrado com os filtros aplicados.
              <br />
              Configure a tabela dinâmica e clique em &quot;Gerar Tabela
              Dinâmica&quot;.
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );
}
