/**
 * PDM Model Display Component
 * Following Single Responsibility Principle
 */

import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Alert,
  CardMedia,
  IconButton,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { MaterialIdentificationResult } from "../../types";

interface PDMModelDisplayProps {
  result: MaterialIdentificationResult | null;
  error: string | null;
}

export const PDMModelDisplay: React.FC<PDMModelDisplayProps> = ({
  result,
  error,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  // Função para renderizar o texto com títulos em negrito
  const renderPDMText = (text: string, expanded: boolean = false) => {
    const lines = text.split("\n");

    // Se não estiver expandido, mostra apenas título + primeira seção
    const displayLines = expanded ? lines : lines.slice(0, 5); // Mostra título + primeira seção completa

    return displayLines.map((line, index) => {
      // Verifica se a linha é um título (começa com número + ponto + espaço)
      const isTitle = /^\d+\.\s/.test(line.trim());

      return (
        <Typography
          key={index}
          variant="body2"
          sx={{
            fontSize: "0.875rem",
            lineHeight: 1.2,
            fontWeight: isTitle ? "bold" : "normal",
            mb: index < displayLines.length - 1 ? 0.5 : 0,
          }}
        >
          {line}
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
          {renderPDMText(resumoPDM, isExpanded)}

          {/* Indicador de conteúdo truncado */}
          {!isExpanded && (
            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "center",
                color: "text.secondary",
                mt: 1,
                fontStyle: "italic",
              }}
            >
              Clique na seta para ver mais detalhes...
            </Typography>
          )}

          {/* Botão de expansão */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <IconButton
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-label={
                isExpanded ? "Recolher conteúdo" : "Expandir conteúdo"
              }
              size="small"
              sx={{
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.light",
                  color: "primary.contrastText",
                },
              }}
            >
              {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </Box>
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
