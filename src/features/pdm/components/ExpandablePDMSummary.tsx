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
} from "@mui/material";
import {
  KeyboardArrowDown as ExpandIcon,
  KeyboardArrowUp as CollapseIcon,
  KeyboardArrowDown,
} from "@mui/icons-material";

interface ExpandablePDMSummaryProps {
  readonly summaryText: string;
  readonly maxLines?: number;
  readonly title?: string;
}

export default function ExpandablePDMSummary({
  summaryText,
  maxLines = 5,
  title = "Resumo PDM",
}: ExpandablePDMSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calcular se o texto precisa ser truncado
  const shouldTruncate = useMemo(() => {
    const lines = summaryText.split('\n');
    return lines.length > maxLines;
  }, [summaryText, maxLines]);

  // Texto truncado para preview
  const truncatedText = useMemo(() => {
    if (!shouldTruncate) return summaryText;

    const lines = summaryText.split('\n');
    return lines.slice(0, maxLines).join('\n') + '\n...';
  }, [summaryText, shouldTruncate, maxLines]);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
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
