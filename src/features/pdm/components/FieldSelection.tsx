// src/features/pdm/components/FieldSelection.tsx
// Layout Horizontal 65/35 - Ultra Compacto - Sem Scroll

import React, { useState } from "react";
import {
  Typography,
  Paper,
  Button,
  Stack,
  TextField,
  Box,
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

// Interface para dados editáveis
interface EditableData {
  readonly categoria: string;
  readonly aplicacao: string;
  readonly informacoes: string;
  readonly especificacoesTecnicas: SpecItem[];
}

// Utilitário para converter specs para array
const specsToArray = (specs: Record<string, unknown>): Array<{key: string; value: string}> => {
  return Object.entries(specs || {}).map(([key, value]) => ({ key, value: String(value) }));
};

// Utilitário para converter array para specs object
const specsToObject = (specs: SpecItem[]): Record<string, unknown> => {
  return specs.reduce((acc, spec) => {
    if (spec.checked) {
      acc[spec.key] = spec.value;
    }
    return acc;
  }, {} as Record<string, unknown>);
};

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
  // Estado para dados editáveis
  const [editableData, setEditableData] = useState<EditableData>(() => {
    const formattedSpecs = specsToArray(
      enrichmentResult.enriched.especificacoesTecnicas || {}
    ).map((spec) => ({
      id: uuidv4(),
      key: formatTechnicalKey(spec.key),
      value: spec.value,
      checked: true,
    }));

    return {
      categoria: enrichmentResult.enriched.categoria || "",
      aplicacao: enrichmentResult.enriched.aplicacao || "",
      informacoes: enrichmentResult.original.informacoes || "",
      especificacoesTecnicas: formattedSpecs,
    };
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Handlers para atualizar campos básicos
  const handleFieldChange = (
    field: keyof Omit<EditableData, "especificacoesTecnicas">,
    value: string
  ) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpecAdd = (key: string, value: string) => {
    const newSpec: SpecItem = {
      id: uuidv4(),
      key,
      value,
      checked: true,
    };
    setEditableData((prev) => ({
      ...prev,
      especificacoesTecnicas: [...prev.especificacoesTecnicas, newSpec],
    }));
  };

  const handleContinue = () => {
    const modifiedData: EnrichedProductData = {
      ...enrichmentResult.enriched,
      categoria: editableData.categoria,
      aplicacao: editableData.aplicacao,
      especificacoesTecnicas: specsToObject(editableData.especificacoesTecnicas),
    };
    onContinue(modifiedData);
  };

  return (
    <Box sx={{ height: "calc(100vh - 120px)", display: "flex", gap: 2 }}>
      {/* Painel Esquerdo - 65% */}
      <Paper
        elevation={1}
        sx={{
          flex: "0 0 65%",
          p: 2,
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontSize: "0.9rem" }}>
          Características
        </Typography>

        {/* Grid de Cards */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 1,
            alignContent: "start",
          }}
        >
          {editableData.especificacoesTecnicas.map((spec) => (
            <CheckboxSpecCard
              key={spec.id}
              id={spec.id}
              label={spec.key}
              value={spec.value}
              checked={spec.checked}
              onCheck={(id, checked) => {
                setEditableData((prev) => ({
                  ...prev,
                  especificacoesTecnicas: prev.especificacoesTecnicas.map((s) =>
                    s.id === id ? { ...s, checked } : s
                  ),
                }));
              }}
              onValueChange={(id, newValue) => {
                setEditableData((prev) => ({
                  ...prev,
                  especificacoesTecnicas: prev.especificacoesTecnicas.map((s) =>
                    s.id === id ? { ...s, value: newValue } : s
                  ),
                }));
              }}
              onLabelChange={(id, newLabel) => {
                setEditableData((prev) => ({
                  ...prev,
                  especificacoesTecnicas: prev.especificacoesTecnicas.map((s) =>
                    s.id === id ? { ...s, key: newLabel } : s
                  ),
                }));
              }}
              editable={true}
            />
          ))}
        </Box>

        {/* Botão Add */}
        <Button
          variant="outlined"
          onClick={() => setIsDialogOpen(true)}
          startIcon={<AddIcon />}
          sx={{ mt: 2, height: 32, fontSize: "0.7rem" }}
        >
          Adicionar
        </Button>
      </Paper>

      {/* Painel Direito - 35% */}
      <Paper
        elevation={1}
        sx={{
          flex: "0 0 35%",
          p: 2,
          height: "100%",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontSize: "0.9rem" }}>
          Dados do Produto
        </Typography>

        <Stack spacing={1.5}>
          <TextField
            label="Categoria"
            value={editableData.categoria}
            onChange={(e) => handleFieldChange("categoria", e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Aplicação"
            value={editableData.aplicacao}
            onChange={(e) => handleFieldChange("aplicacao", e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Informações Originais"
            value={editableData.informacoes}
            onChange={(e) => handleFieldChange("informacoes", e.target.value)}
            size="small"
            multiline
            rows={4}
            fullWidth
          />
        </Stack>

        {/* Botões de Ação */}
        <Stack direction="row" spacing={1} sx={{ mt: "auto", pt: 2 }}>
          <Button
            variant="outlined"
            onClick={onBack}
            sx={{ height: 32, fontSize: "0.7rem" }}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            onClick={handleContinue}
            sx={{ height: 32, fontSize: "0.7rem", flex: 1 }}
          >
            Continuar
          </Button>
        </Stack>
      </Paper>

      {/* Dialog para adicionar novas especificações */}
      <AddNewSpecDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAdd={handleSpecAdd}
      />
    </Box>
  );
}