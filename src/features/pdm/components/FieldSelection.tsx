/**
 * FieldSelection component for selecting fields to use in equivalence search.
 * Refatorado para aplicar o tema "Aço Escovado".
 */

import React, { useState, useMemo } from "react";
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
  Stack,
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
  const hasTechSpecs =
    enriched.especificacoesTecnicas &&
    Object.keys(enriched.especificacoesTecnicas).length > 0;

  const [selectedFields, setSelectedFields] = useState<SelectedFields>({
    categoria: true,
    subcategoria: !!enriched.subcategoria,
    especificacoesTecnicas: [],
    aplicacao: !!enriched.aplicacao,
    normas: !!enriched.normas?.length,
  });

  const handleMainFieldToggle = (
    field: keyof Omit<SelectedFields, "especificacoesTecnicas">
  ) => {
    setSelectedFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSpecToggle = (specKey: string) => {
    setSelectedFields((prev) => ({
      ...prev,
      especificacoesTecnicas: prev.especificacoesTecnicas.includes(specKey)
        ? prev.especificacoesTecnicas.filter((key) => key !== specKey)
        : [...prev.especificacoesTecnicas, specKey],
    }));
  };

  const hasSelections = useMemo(() => {
    return Object.values(selectedFields).some((value) => {
      if (Array.isArray(value)) return value.length > 0;
      return !!value;
    });
  }, [selectedFields]);

  return (
    <Stack gap={3}>
      <Typography variant="h5">Seleção de Campos para Busca</Typography>

      <Alert severity="info">
        Quanto mais campos você selecionar, mais precisa será a busca por
        equivalências. Selecione os campos mais relevantes para seu objetivo.
      </Alert>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" gutterBottom>
          Campos Principais
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedFields.categoria}
                onChange={() => handleMainFieldToggle("categoria")}
              />
            }
            label={`Categoria: ${enriched.categoria}`}
          />
          {enriched.subcategoria && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFields.subcategoria}
                  onChange={() => handleMainFieldToggle("subcategoria")}
                />
              }
              label={`Subcategoria: ${enriched.subcategoria}`}
            />
          )}
        </FormGroup>

        {hasTechSpecs && (
          <>
            <Divider sx={{ my: 2 }}>
              <Chip label="Especificações Técnicas" />
            </Divider>
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
                    label={`${key}: ${value}`}
                  />
                )
              )}
            </FormGroup>
          </>
        )}

        <Box
          sx={{
            mt: 3,
            p: 2,
            // CORREÇÃO: Usando cores do tema para o fundo e borda.
            backgroundColor: "background.default",
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Resumo da Seleção:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {hasSelections
              ? [
                  selectedFields.categoria && "Categoria",
                  selectedFields.subcategoria && "Subcategoria",
                  selectedFields.aplicacao && "Aplicação",
                  selectedFields.normas && "Normas",
                  selectedFields.especificacoesTecnicas.length > 0 &&
                    `${selectedFields.especificacoesTecnicas.length} especificação(ões)`,
                ]
                  .filter(Boolean)
                  .join(" + ")
              : "Nenhum campo selecionado."}
          </Typography>
        </Box>
      </Paper>

      <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
        <Button variant="outlined" color="secondary" onClick={onBack}>
          Voltar
        </Button>
        <Button
          variant="contained"
          onClick={() => onContinue(selectedFields)}
          disabled={!hasSelections}
          size="large"
        >
          Buscar Equivalências
        </Button>
      </Stack>
    </Stack>
  );
}
