/**
 * FieldSelection component for selecting fields to use in equivalence search
 * Following Single Responsibility Principle
 */

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  Alert,
  Chip,
  Divider,
} from "@mui/material";
import { EnrichmentResponse, SelectedFields } from "../types";

interface FieldSelectionProps {
  readonly enrichmentResult: EnrichmentResponse;
  readonly onBack: () => void;
  readonly onContinue: (selectedFields: SelectedFields) => void;
}

export default function FieldSelection({
  enrichmentResult,
  onBack,
  onContinue,
}: FieldSelectionProps) {
  const { enriched } = enrichmentResult;

  // State for field selection
  const [selectedFields, setSelectedFields] = useState<SelectedFields>({
    categoria: true, // Default selected
    subcategoria: !!enriched.subcategoria,
    especificacoesTecnicas: [],
    aplicacao: !!enriched.aplicacao,
    normas: !!enriched.normas?.length,
  });

  // Handle main field toggle
  const handleMainFieldToggle = (
    field: keyof Omit<SelectedFields, "especificacoesTecnicas">
  ) => {
    setSelectedFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle technical specs selection
  const handleSpecToggle = (specKey: string) => {
    setSelectedFields((prev) => ({
      ...prev,
      especificacoesTecnicas: prev.especificacoesTecnicas.includes(specKey)
        ? prev.especificacoesTecnicas.filter((key) => key !== specKey)
        : [...prev.especificacoesTecnicas, specKey],
    }));
  };

  // Check if at least one field is selected
  const hasSelections =
    selectedFields.categoria ||
    selectedFields.subcategoria ||
    selectedFields.aplicacao ||
    selectedFields.normas ||
    selectedFields.especificacoesTecnicas.length > 0;

  const handleContinue = () => {
    if (hasSelections) {
      onContinue(selectedFields);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          ☑️ Seleção de Campos para Equivalência
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Escolha quais campos serão utilizados para buscar produtos
          equivalentes
        </Typography>
      </Box>

      {/* Instructions */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Dica:</strong> Campos selecionados serão usados como critérios
          de busca. Mais campos = busca mais específica. Menos campos = busca
          mais ampla.
        </Typography>
      </Alert>

      <Paper sx={{ p: 3 }}>
        {/* Basic Fields */}
        <Typography variant="h6" gutterBottom>
          📋 Campos Básicos
        </Typography>

        <FormGroup sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedFields.categoria}
                onChange={() => handleMainFieldToggle("categoria")}
              />
            }
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography>Categoria</Typography>
                <Chip label={enriched.categoria} size="small" />
              </Box>
            }
          />

          {enriched.subcategoria && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFields.subcategoria}
                  onChange={() => handleMainFieldToggle("subcategoria")}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography>Subcategoria</Typography>
                  <Chip label={enriched.subcategoria} size="small" />
                </Box>
              }
            />
          )}

          {enriched.aplicacao && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFields.aplicacao}
                  onChange={() => handleMainFieldToggle("aplicacao")}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography>Aplicação</Typography>
                  <Chip
                    label={enriched.aplicacao}
                    size="small"
                    color="secondary"
                  />
                </Box>
              }
            />
          )}

          {enriched.normas && enriched.normas.length > 0 && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFields.normas}
                  onChange={() => handleMainFieldToggle("normas")}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography>Normas</Typography>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    {enriched.normas.slice(0, 2).map((norma, index) => (
                      <Chip
                        key={index}
                        label={norma}
                        size="small"
                        color="success"
                      />
                    ))}
                    {enriched.normas.length > 2 && (
                      <Chip
                        label={`+${enriched.normas.length - 2}`}
                        size="small"
                      />
                    )}
                  </Box>
                </Box>
              }
            />
          )}
        </FormGroup>

        <Divider sx={{ my: 3 }} />

        {/* Technical Specifications */}
        {enriched.especificacoesTecnicas &&
          Object.keys(enriched.especificacoesTecnicas).length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                🔧 Especificações Técnicas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Selecione as especificações mais importantes para encontrar
                equivalências:
              </Typography>

              <FormGroup>
                {Object.entries(enriched.especificacoesTecnicas).map(
                  ([key, value]) => (
                    <FormControlLabel
                      key={key}
                      control={
                        <Checkbox
                          checked={selectedFields.especificacoesTecnicas.includes(
                            key
                          )}
                          onChange={() => handleSpecToggle(key)}
                        />
                      }
                      label={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography>{key}</Typography>
                          <Chip
                            label={value}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </Box>
                      }
                    />
                  )
                )}
              </FormGroup>
            </>
          )}

        {/* Selection Summary */}
        <Box sx={{ mt: 4, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            📊 Resumo da Seleção:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {hasSelections ? (
              <>
                {[
                  selectedFields.categoria && "Categoria",
                  selectedFields.subcategoria && "Subcategoria",
                  selectedFields.aplicacao && "Aplicação",
                  selectedFields.normas && "Normas",
                  selectedFields.especificacoesTecnicas.length > 0 &&
                    `${selectedFields.especificacoesTecnicas.length} especificação(ões) técnica(s)`,
                ]
                  .filter(Boolean)
                  .join(" + ")}
              </>
            ) : (
              "Nenhum campo selecionado"
            )}
          </Typography>
        </Box>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button variant="outlined" onClick={onBack} size="large">
          ← Voltar
        </Button>
        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={!hasSelections}
          size="large"
        >
          Buscar Equivalências →
        </Button>
      </Box>
    </Box>
  );
}
