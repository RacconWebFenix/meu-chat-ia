// src/components/shared/AdvancedDataGrid/AdvancedDataGrid.tsx
"use client";

import React from "react";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridFilterModel,
  GridSortModel, // ✅ 1. IMPORTAR GridSortModel
} from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { Box, SxProps, Theme } from "@mui/material";

interface BaseRow {
  id: string | number;
}

interface AdvancedDataGridProps<T extends BaseRow> {
  rows: T[];
  columns: GridColDef<T>[];
  loading: boolean;
  rowCount: number;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  filterModel?: GridFilterModel;
  onFilterModelChange?: (model: GridFilterModel) => void;
  sx?: SxProps<Theme>;

  // ✅ 2. ADICIONAR AS NOVAS PROPRIEDADES
  disableColumnFilter?: boolean;
  sortModel?: GridSortModel;
  onSortModelChange?: (model: GridSortModel) => void;
  sortingMode?: "client" | "server";
}

export default function AdvancedDataGrid<T extends BaseRow>({
  rows,
  columns,
  loading,
  rowCount,
  paginationModel,
  onPaginationModelChange,
  filterModel,
  onFilterModelChange,
  sx,

  // ✅ 3. RECEBER AS NOVAS PROPRIEDADES
  disableColumnFilter,
  sortModel,
  onSortModelChange,
  sortingMode = "client",
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
        filterMode="server"
        filterModel={filterModel}
        onFilterModelChange={onFilterModelChange}
        disableColumnFilter={disableColumnFilter}
        sortingMode={sortingMode}
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        sx={sx}
      />
    </Box>
  );
}
