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
  const imagens = result.response.enriched.imagens; // Array completo de imagens

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
          flexDirection: "row", // Lado a lado: texto à esquerda, imagens à direita
          gap: 2,
        }}
      >
        {/* Conteúdo de texto */}
        <Box
          sx={{
            flex: 1, // Ocupa o espaço disponível à esquerda
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

        {/* Galeria de imagens */}
        {imagens && imagens.length > 0 && (
          <Box
            sx={{
              flexShrink: 0,
              width: 320, // Largura fixa para a coluna de imagens
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)", // 2 colunas
              gap: 1,
            }}
          >
            {imagens.map((imagem, index) => (
              <Box
                key={index} // Chave única baseada no índice
                sx={{
                  width: 150, // Largura de cada imagem
                  height: 150,
                  borderRadius: 1,
                  overflow: "hidden",
                  boxShadow: 1,
                }}
              >
                <CardMedia
                  component="img"
                  image={imagem.image_url}
                  alt={`Imagem do produto identificado ${index + 1}`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
};
