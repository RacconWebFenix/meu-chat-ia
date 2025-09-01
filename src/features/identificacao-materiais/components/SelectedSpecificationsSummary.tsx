/**
 * Selected Specifications Summary Component
 * Displays selected characteristics in a unified format
 */

import React from "react";
import { Paper, Typography, Box, Grid } from "@mui/material";
import { CheckboxSpecCard } from "../../pdm";
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
        p: 2,
        mt: 2,
        backgroundColor: "background.paper",
      }}
    >
      {/* Texto unificado das informações selecionadas */}
      <Box sx={{ p: 2, backgroundColor: "grey.50", borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
          Informações Unificadas:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {selectedCaracteristicas
            .map((item) => `${item.label}: ${item.value}`)
            .join(", ")}
        </Typography>
      </Box>
    </Paper>
  );
};
