// src/app/(app)/relatorios/components/PivotTab.tsx
"use client";

import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import QuotationsFilters from "./QuotationsFilters";
import PivotControls from "./PivotControls";
import { usePivotTable } from "@/features/reports/hooks/usePivotTable";
import AdvancedDataGrid from "@/components/shared/AdvancedDataGrid/AdvancedDataGrid";

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
