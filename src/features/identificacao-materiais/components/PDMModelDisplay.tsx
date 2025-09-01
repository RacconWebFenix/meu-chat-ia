/**
 * PDM Model Display Component
 * Following Single Responsibility Principle
 */

import React from "react";
import { Paper, Typography, Box, Alert, CardMedia } from "@mui/material";
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
  const primeiraImagem = result.response.enriched.imagens[0]; // Pega a primeira imagem

  return (
    <Paper
      elevation={2}
      sx={{
        p: 1.5,
        mt: 1.5,
        backgroundColor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "flex-start",
        }}
      >
        {/* Conteúdo de texto */}
        <Box
          sx={{
            flex: 1,
            lineHeight: 1.2,
            textAlign: "justify",
            hyphens: "auto",
            wordBreak: "break-word",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.875rem",
              lineHeight: 1.2,
            }}
          >
            {resumoPDM}
          </Typography>
        </Box>

        {/* Imagem ao lado */}
        {primeiraImagem && (
          <Box
            sx={{
              flexShrink: 0,
              width: 200,
              height: 150,
              borderRadius: 1,
              overflow: "hidden",
              boxShadow: 1,
            }}
          >
            <CardMedia
              component="img"
              image={primeiraImagem.image_url}
              alt="Imagem do produto identificado"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
};
