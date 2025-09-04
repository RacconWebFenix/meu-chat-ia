/**
 * ERP Export Button Component
 * Following Single Responsibility Principle
 */

import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";

interface ERPExportButtonProps {
  onExport: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export const ERPExportButton: React.FC<ERPExportButtonProps> = ({
  onExport,
  disabled,
  isLoading,
}) => (
  <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
    <Button
      variant="contained"
      onClick={onExport}
      disabled={disabled}
      startIcon={isLoading ? <CircularProgress size={16} /> : <DownloadIcon />}
      sx={{
        minWidth: 140,
        backgroundColor: "primary.main",
        "&:hover": {
          backgroundColor: "primary.dark",
        },
      }}
    >
      {isLoading ? "Exportando..." : "Exportar XLSX"}
    </Button>
  </Box>
);
