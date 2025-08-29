// src/features/pdm/components/ExpandablePDMSummary.tsx
// Componente expansível para resumo PDM seguindo princípios SOLID e Clean Code
// Single Responsibility: Gerenciar estado de expansão/colapso do texto
// Open/Closed: Extensível através de props sem modificar código interno

import React, { useState, useMemo } from "react";
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Collapse,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import {
  KeyboardArrowDown as ExpandIcon,
  KeyboardArrowUp as CollapseIcon,
  KeyboardArrowDown,
} from "@mui/icons-material";
import Image from "next/image";

interface ProductImage {
  readonly image_url: string;
  readonly origin_url?: string;
  readonly height?: number;
  readonly width?: number;
}

interface ExpandablePDMSummaryProps {
  readonly summaryText: string;
  readonly maxLines?: number;
  readonly title?: string;
  readonly imagens?: readonly ProductImage[];
}

export default function ExpandablePDMSummary({
  summaryText,
  maxLines = 5,
  title = "Resumo PDM",
  imagens = [],
}: ExpandablePDMSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calcular se o texto precisa ser truncado
  const shouldTruncate = useMemo(() => {
    const lines = summaryText.split("\n");
    return lines.length > maxLines;
  }, [summaryText, maxLines]);

  // Texto truncado para preview
  const truncatedText = useMemo(() => {
    if (!shouldTruncate) return summaryText;

    const lines = summaryText.split("\n");
    return lines.slice(0, maxLines).join("\n") + "\n...";
  }, [summaryText, shouldTruncate, maxLines]);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  // Componente para renderizar imagens
  const renderImages = () => {
    if (!imagens || imagens.length === 0) return null;

    return (
      <Box sx={{ mt: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: "0.75rem",
            color: "text.secondary",
            mb: 1,
            fontWeight: 600,
          }}
        >
          Imagens do Produto ({imagens.length})
        </Typography>
        <ImageList
          sx={{
            width: "100%",
            height: "auto",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(120px, 1fr)) !important",
          }}
          cols={Math.min(imagens.length, 4)}
          rowHeight={120}
        >
          {imagens.slice(0, 4).map((image, index) => (
            <ImageListItem
              key={index}
              sx={{
                borderRadius: 1,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box
                sx={{ position: "relative", width: "100%", height: "120px" }}
              >
                <Image
                  src={image.image_url}
                  alt={`Produto ${index + 1}`}
                  width={120}
                  height={120}
                  style={{
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                  onError={(e) => {
                    // Fallback para imagem quebrada
                    const target = e.target as HTMLImageElement;
                    if (
                      target.src !==
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yIDEyTDE1IDJ2MjBNMiAxMnoiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+"
                    ) {
                      target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yIDEyTDE1IDJ2MjBNMiAxMnoiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+";
                    }
                  }}
                />
              </Box>
              {image.origin_url && (
                <ImageListItemBar
                  title=""
                  subtitle={`Fonte: ${
                    image.origin_url
                      ? (() => {
                          try {
                            return new URL(image.origin_url!).hostname;
                          } catch {
                            return "Fonte externa";
                          }
                        })()
                      : "Fonte externa"
                  }`}
                  sx={{
                    "& .MuiImageListItemBar-subtitle": {
                      fontSize: "0.6rem",
                      lineHeight: 1.2,
                    },
                    background: "rgba(0, 0, 0, 0.7)",
                  }}
                />
              )}
            </ImageListItem>
          ))}
        </ImageList>
        {imagens.length > 4 && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 1,
              color: "text.secondary",
              fontSize: "0.65rem",
            }}
          >
            +{imagens.length - 4} imagens adicionais
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        bgcolor: "info.50",
        border: "1px solid",
        borderColor: "info.200",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: "0.9rem",
            color: "info.main",
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>

        {shouldTruncate && (
          <IconButton
            size="small"
            onClick={handleToggle}
            sx={{
              color: "info.main",
              "&:hover": {
                bgcolor: "info.100",
              },
            }}
            aria-label={isExpanded ? "Recolher resumo" : "Expandir resumo"}
          >
            {isExpanded ? (
              <CollapseIcon sx={{ fontSize: "1.2rem" }} />
            ) : (
              <ExpandIcon sx={{ fontSize: "1.2rem" }} />
            )}
          </IconButton>
        )}
      </Box>

      <Collapse in={isExpanded} collapsedSize="auto">
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.75rem",
            lineHeight: 1.4,
            color: "text.primary",
            whiteSpace: "pre-line",
          }}
        >
          {isExpanded ? summaryText : truncatedText}
        </Typography>
      </Collapse>

      {/* Renderizar imagens se existirem */}
      {renderImages()}

      {shouldTruncate && !isExpanded && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 1,
            cursor: "pointer",
            color: "info.main",
            fontSize: "0.7rem",
            "&:hover": {
              color: "info.dark",
              textDecoration: "underline",
            },
          }}
          onClick={handleToggle}
        >
          <KeyboardArrowDown sx={{ fontSize: "1rem", mr: 0.5 }} />
          Mostrar mais
        </Box>
      )}
    </Paper>
  );
}
