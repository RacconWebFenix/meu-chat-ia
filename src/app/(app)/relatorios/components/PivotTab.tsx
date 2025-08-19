// src/app/(app)/relatorios/components/PivotTab.tsx
"use client";

import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import QuotationsFilters from "./QuotationsFilters";
import PivotControls from "./PivotControls";
import { usePivotTable } from "@/features/reports/hooks/usePivotTable";
import AdvancedDataGrid from "@/components/shared/AdvancedDataGrid/AdvancedDataGrid";

export default function PivotTab() {
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

      {/* Controles da Tabela Dinâmica */}
      <PivotControls
        config={pivotConfig}
        onConfigChange={handlePivotConfigChange}
        onApplyPivot={applyPivot}
        loading={loading}
      />

      {/* Estatísticas da Tabela Dinâmica */}
      {processedPivotData && (
        <Box sx={{ mb: 2, p: 2, backgroundColor: "grey.50", borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            📊 <strong>Resumo:</strong> {processedPivotData.rowHeaders.length}{" "}
            linhas × {processedPivotData.columnHeaders.length} colunas
            {processedPivotData.grandTotal > 0 && (
              <>
                {" "}
                | <strong>Total Geral:</strong>{" "}
                {new Intl.NumberFormat("pt-BR", {
                  minimumFractionDigits:
                    pivotConfig.aggregation === "count" ? 0 : 2,
                  maximumFractionDigits:
                    pivotConfig.aggregation === "count" ? 0 : 2,
                }).format(processedPivotData.grandTotal)}
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
        />
      ) : (
        <Box sx={{ textAlign: "center", py: 4 }}>
          {!hasSearched ? (
            <Box>
              <Typography variant="h6" color="primary" gutterBottom>
                🎯 Como usar a Tabela Dinâmica
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                1. Configure os <strong>filtros de dados</strong> acima
                (período, termo de busca)
                <br />
                2. Clique em <strong>&quot;Aplicar Filtros&quot;</strong> para
                buscar os dados
                <br />
                3. Configure a <strong>tabela dinâmica</strong> (linhas,
                colunas, valores)
                <br />
                4. Clique em <strong>
                  &quot;Gerar Tabela Dinâmica&quot;
                </strong>{" "}
                para processar
              </Typography>
              <Typography variant="body2" color="warning.main">
                💡 Nenhuma requisição será feita automaticamente
              </Typography>
            </Box>
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
