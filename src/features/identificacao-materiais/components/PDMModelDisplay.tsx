/**
 * PDM Model Display Component
 * Following Single Responsibility Principle
 */

import React from "react";
import { Paper, Typography, Box, Alert } from "@mui/material";
import { MaterialIdentificationResult } from "../types";

interface PDMModelDisplayProps {
  result: MaterialIdentificationResult | null;
  error: string | null;
}

export const PDMModelDisplay: React.FC<PDMModelDisplayProps> = ({
  result,
  error,
}) => {
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!result) {
    return null;
  }

  const resumoPDM = result.response.enriched.especificacoesTecnicas.resumoPDM;

  const renderPDMContent = (content: string) => {
    const items = content.split(",");

    return items.map((item, index) => {
      const cleanItem = item.trim();

      // Pula itens vazios
      if (cleanItem === "") {
        return null;
      }

      return (
        <Typography
          key={index}
          variant="body2"
          component="span"
          sx={{
            display: "inline-block",
            mr: 0.3,
            mb: 0.3,
            textAlign: "justify",
            lineHeight: 1.2,
            fontSize: "0.875rem",
          }}
        >
          {cleanItem}
          {index < items.length - 1 && ","}
        </Typography>
      );
    });
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 1.5,
        mt: 1.5,
        backgroundColor: "background.paper",
      }}
    >
      <Typography
        variant="h6"
        component="h2"
        gutterBottom
        sx={{ mb: 1.5, fontSize: "1.1rem" }}
      >
        Modelo de PDM para Produto Identificado
      </Typography>

      <Box sx={{ lineHeight: 1.2 }}>{renderPDMContent(resumoPDM)}</Box>
    </Paper>
  );
};
