// src/features/pdm/components/FieldSelection.tsx
// Layout Horizontal 50/50 - Ultra Compacto - Sem Scroll

import React, { useState } from "react";
import {
  Typography,
  Paper,
  Button,
  Stack,
  TextField,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { EnrichmentResponse, EnrichedProductData } from "../types";
import { formatTechnicalKey } from "@/Utils/formatUtils";
import CheckboxSpecCard from "./CheckboxSpecCard";
import AddNewSpecDialog from "./AddNewSpecDialog";

// Interface para especificações com checkbox
interface SpecItem {
  readonly id: string;
  readonly key: string;
  readonly value: string;
  readonly checked: boolean;
}

interface FieldSelectionProps {
  readonly enrichmentResult: EnrichmentResponse;
  readonly onBack: () => void;
  readonly onContinue: (modifiedData: EnrichedProductData) => void;
}

export default function FieldSelection({
  enrichmentResult,
  onBack,
  onContinue,
}: FieldSelectionProps) {
  // Estado para informações originais editáveis
  const [originalInfo, setOriginalInfo] = useState(
    enrichmentResult.original.informacoes || ""
  );

  // Estado para especificações com checkbox
  const [specs, setSpecs] = useState<SpecItem[]>(() => {
    return Object.entries(
      enrichmentResult.enriched.especificacoesTecnicas || {}
    ).map(([key, value]) => ({
      id: uuidv4(),
      key: formatTechnicalKey(key),
      value: String(value),
      checked: false, // Todas desmarcadas por padrão
    }));
  });

  // Estado para diálogo de adicionar nova especificação
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Funções para gerenciar especificações
  const handleSpecCheck = (id: string, checked: boolean) => {
    setSpecs((prev) =>
      prev.map((spec) => (spec.id === id ? { ...spec, checked } : spec))
    );
  };

  const handleSpecValueChange = (id: string, newValue: string) => {
    setSpecs((prev) =>
      prev.map((spec) => (spec.id === id ? { ...spec, value: newValue } : spec))
    );
  };

  const handleSpecLabelChange = (id: string, newLabel: string) => {
    setSpecs((prev) =>
      prev.map((spec) => (spec.id === id ? { ...spec, key: newLabel } : spec))
    );
  };

  const handleAddNewSpec = (key: string, value: string) => {
    const newSpec: SpecItem = {
      id: uuidv4(),
      key,
      value,
      checked: true,
    };
    setSpecs((prev) => [...prev, newSpec]);
  };

  // Função para continuar o fluxo
  const handleContinue = () => {
    // Criar objeto de especificações apenas com itens selecionados
    const selectedSpecs = specs
      .filter((spec) => spec.checked)
      .reduce((acc, spec) => {
        acc[spec.key] = spec.value;
        return acc;
      }, {} as Record<string, string>);

    // Criar dados enriquecidos atualizados
    const enrichedData: EnrichedProductData = {
      ...enrichmentResult.enriched,
      especificacoesTecnicas: selectedSpecs,
    };

    onContinue(enrichedData);
  };

  // Estatísticas para exibição
  const selectedSpecs = specs.filter((spec) => spec.checked);
  const selectedCount = selectedSpecs.length;
  const totalCount = specs.length;

  // Gerar preview
  const previewText =
    selectedSpecs.length > 0
      ? selectedSpecs.map((spec) => `${spec.key}: ${spec.value}`).join(", ")
      : "Nenhuma característica selecionada";

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header Ultra Compacto */}
      <Box sx={{ mb: 0.8, flexShrink: 0 }}>
        <Typography
          variant="subtitle1"
          sx={{ mb: 0, fontWeight: 600, fontSize: "0.95rem" }}
        >
          Revisão e Ajuste ({selectedCount}/{totalCount})
        </Typography>
      </Box>

      {/* Layout Horizontal - 65% Características / 35% Preview */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flex: 1,
          overflow: "hidden",
          minHeight: 0,
          "@media (max-width: 900px)": {
            flexDirection: "column",
          },
        }}
      >
        {/* LADO ESQUERDO - Características (65%) */}
        <Paper
          variant="outlined"
          sx={{
            flex: "0 0 65%",
            p: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          {/* Header das Características */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 0.6,
              flexShrink: 0,
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight="600"
              sx={{ fontSize: "0.8rem" }}
            >
              Características
            </Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setAddDialogOpen(true)}
              sx={{ fontSize: "0.65rem", py: 0.2, px: 0.5, minWidth: "auto" }}
            >
              +
            </Button>
          </Box>

          {/* Grid Ultra Compacto de Especificações */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
                lg: "repeat(5, 1fr)",
              },
              gap: 0.5,
              alignContent: "start",
              pr: 0.2,
            }}
          >
            {specs.map((spec) => (
              <CheckboxSpecCard
                key={spec.id}
                id={spec.id}
                checked={spec.checked}
                label={spec.key}
                value={spec.value}
                onCheck={handleSpecCheck}
                onValueChange={handleSpecValueChange}
                onLabelChange={handleSpecLabelChange}
                editable={true}
              />
            ))}
          </Box>
        </Paper>

        {/* LADO DIREITO - Preview Compacto (35%) */}
        <Box
          sx={{
            flex: "0 0 35%",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {/* Seção de Preview Ultra Compacta */}
          <Paper
            variant="outlined"
            sx={{
              flex: 1,
              p: 0.6,
              mb: 0.6,
              bgcolor: "grey.50",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              minHeight: 0,
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight="600"
              sx={{ mb: 0.6, fontSize: "0.7rem" }}
            >
              Preview
            </Typography>

            {/* Campo Original */}
            <Box sx={{ mb: 0.6, flexShrink: 0 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.2, fontSize: "0.55rem", display: "block" }}
              >
                Original:
              </Typography>
              <TextField
                value={originalInfo}
                onChange={(e) => setOriginalInfo(e.target.value)}
                size="small"
                fullWidth
                placeholder="Ex: Retentor"
                sx={{
                  "& .MuiInputBase-root": {
                    fontSize: "0.6rem",
                    bgcolor: "white",
                    height: "24px",
                  },
                  "& .MuiInputBase-input": {
                    py: 0.3,
                    px: 0.6,
                  },
                }}
              />
            </Box>

            {/* Contador */}
            <Box sx={{ mb: 0.4, flexShrink: 0 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.65rem", fontWeight: 500 }}
              >
                {selectedCount}/{totalCount} selecionadas
              </Typography>
            </Box>

            {/* Card com Material Original + Características */}
            <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 1,
                  bgcolor: "white",
                  borderRadius: 1,
                  border: "1px solid #e0e0e0",
                }}
              >
                {originalInfo.trim() || selectedSpecs.length > 0 ? (
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "0.85rem",
                      color: "text.primary",
                      lineHeight: 1.5,
                      wordBreak: "break-word",
                      fontWeight: 400,
                    }}
                  >
                    {[
                      originalInfo.trim() && `Original: ${originalInfo.trim()}`,
                      ...selectedSpecs.map(
                        (spec) => `${spec.key}: ${spec.value}`
                      ),
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </Typography>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.75rem",
                      color: "text.secondary",
                      fontStyle: "italic",
                      textAlign: "center",
                      py: 1,
                    }}
                  >
                    Digite o material original e selecione características
                  </Typography>
                )}
              </Paper>
            </Box>
          </Paper>

          {/* Botões Ultra Compactos */}
          <Stack direction="column" spacing={0.4} sx={{ flexShrink: 0 }}>
            <Button
              variant="contained"
              onClick={handleContinue}
              disabled={selectedCount === 0 && !originalInfo.trim()}
              size="small"
              sx={{ fontSize: "0.65rem", py: 0.4, minHeight: "28px" }}
            >
              Buscar →
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onBack}
              size="small"
              sx={{ fontSize: "0.65rem", py: 0.4, minHeight: "28px" }}
            >
              ← Voltar
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Dialog para adicionar nova especificação */}
      <AddNewSpecDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAddNewSpec}
      />
    </Box>
  );
}
