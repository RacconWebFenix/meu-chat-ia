/**
 * Selected Specifications Summary Component
 * Displays selected characteristics in a unified format
 */

import React from "react";
import { Paper, Typography, Box, Grid } from "@mui/material";
import { MaterialIdentificationResult } from "../types";

interface CaracteristicaItem {
  id: string;
  label: string;
  value: string;
  checked: boolean;
}

interface SelectedSpecificationsSummaryProps {
  caracteristicas: CaracteristicaItem[];
  result: MaterialIdentificationResult;
}

export const SelectedSpecificationsSummary: React.FC<
  SelectedSpecificationsSummaryProps
> = ({ caracteristicas, result }) => {
  // Obter características selecionadas
  const selectedCaracteristicas = caracteristicas.filter(
    (item) => item.checked
  );

  if (selectedCaracteristicas.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 0,
        mt: 0,
        backgroundColor: "background.paper",
      }}
    >
      {/* Texto unificado das informações selecionadas */}
      <Box sx={{ p: 1, backgroundColor: "grey.50", borderRadius: 1 }}>
        <Typography
          variant="body1"
          sx={{ mb: 0, fontWeight: "bold", color: "text.primary" }}
        >
          Descrição:
        </Typography>
        <Typography
          variant="body1"
          color="text.primary"
          sx={{ fontWeight: 500 }}
        >
          {selectedCaracteristicas
            .map((item) => `${item.label}: ${item.value}`)
            .join(", ")}
        </Typography>
      </Box>
    </Paper>
  );
};
