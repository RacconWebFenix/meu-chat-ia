import React, { useMemo } from "react";
import { Paper, Typography, Box, Chip, Divider } from "@mui/material";
import { Visibility as PreviewIcon } from "@mui/icons-material";

interface SpecItem {
  readonly id: string;
  readonly key: string;
  readonly value: string;
  readonly checked: boolean;
}

interface PreviewTextProps {
  readonly originalInfo?: string;
  readonly selectedSpecs: SpecItem[];
}

export default function PreviewText({
  originalInfo,
  selectedSpecs,
}: PreviewTextProps) {
  const previewText = useMemo(() => {
    const checkedSpecs = selectedSpecs.filter((spec) => spec.checked);

    if (checkedSpecs.length === 0 && !originalInfo) {
      return "Nenhuma informação selecionada para busca.";
    }

    const parts: string[] = [];

    // Adiciona informações originais se existirem
    if (originalInfo && originalInfo.trim()) {
      parts.push(originalInfo.trim());
    }

    // Adiciona especificações selecionadas
    if (checkedSpecs.length > 0) {
      const specsText = checkedSpecs
        .map((spec) => `${spec.key}: ${spec.value}`)
        .join(", ");
      parts.push(specsText);
    }

    return parts.join(", ");
  }, [originalInfo, selectedSpecs]);

  const selectedCount = selectedSpecs.filter((spec) => spec.checked).length;
  const totalCount = selectedSpecs.length;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        mt: 3,
        backgroundColor: "grey.50",
        border: "2px dashed",
        borderColor: "primary.main",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <PreviewIcon sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6" color="primary.main" fontWeight="medium">
          Preview dos Dados para Busca
        </Typography>
        <Chip
          label={`${selectedCount}/${totalCount} selecionados`}
          size="small"
          color="primary"
          sx={{ ml: 2 }}
        />
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography
        variant="body1"
        sx={{
          lineHeight: 1.6,
          color: "text.primary",
          fontFamily: "monospace",
          backgroundColor: "white",
          p: 2,
          borderRadius: 1,
          border: "1px solid",
          borderColor: "divider",
          minHeight: "60px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {previewText}
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 2, display: "block" }}
      >
        💡 Esta é uma prévia dos dados que serão enviados para busca de
        equivalências. Selecione e edite as características acima para
        personalizar a busca.
      </Typography>
    </Paper>
  );
}
