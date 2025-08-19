// src/components/shared/AdvancedDataGrid/AdvancedDataGrid.tsx
"use client";

import React from "react";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridFilterModel, // <<<<<< IMPORTAÇÃO ADICIONADA
} from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { Box, SxProps, Theme } from "@mui/material";

interface BaseRow {
  id: string | number;
}

// ATUALIZAÇÃO DA INTERFACE DE PROPRIEDADES
interface AdvancedDataGridProps<T extends BaseRow> {
  rows: T[];
  columns: GridColDef<T>[];
  loading: boolean;
  rowCount: number;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  filterModel?: GridFilterModel; // <<<<<< PROPRIEDADE ADICIONADA
  onFilterModelChange?: (model: GridFilterModel) => void; // <<<<<< PROPRIEDADE ADICIONADA
  sx?: SxProps<Theme>; // <<<<<< PROPRIEDADE ADICIONADA PARA ESTILOS
}

export default function AdvancedDataGrid<T extends BaseRow>({
  rows,
  columns,
  loading,
  rowCount,
  paginationModel,
  onPaginationModelChange,
  filterModel, // <<<<<< NOVA PROP RECEBIDA
  onFilterModelChange, // <<<<<< NOVA PROP RECEBIDA
  sx, // <<<<<< NOVA PROP RECEBIDA
}: AdvancedDataGridProps<T>) {
  return (
    <Box sx={{ height: 650, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        rowCount={rowCount}
        getRowId={(row) => row.id}
        pageSizeOptions={[10, 25, 50, 100]}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        // ATIVAÇÃO DA FILTRAGEM NO SERVIDOR
        filterMode="server" // <<<<<< PROPRIEDADE ADICIONADA
        filterModel={filterModel}
        onFilterModelChange={onFilterModelChange}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        sx={sx} // <<<<<< PROPRIEDADE ADICIONADA PARA ESTILOS
      />
    </Box>
  );
}
