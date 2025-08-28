// src/features/pdm/components/FieldSelection.tsx
// Layout Vertical em Coluna Única - Scroll Único - Updated: 2025-08-28
// Seção 1: Resumo PDM (largura 100%, conteúdo fixo)
// Seção 2: Características (largura 100%, grid de cards)
// Seção 3: Dados do Produto (largura 100%, formulário)
// Todas as seções rolam juntas com scroll único

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
  readonly marca: string;
  readonly especificacoesTecnicas: SpecItem[];
}

// Utilitário para converter specs para array
const specsToArray = (
  specs: Record<string, unknown>
): Array<{ key: string; value: string }> => {
  return Object.entries(specs || {}).map(([key, value]) => ({
    key,
    value: String(value),
  }));
};

// Utilitário para converter array para specs object
const specsToObject = (specs: SpecItem[]): Record<string, unknown> => {
  return specs.reduce((acc, spec) => {
    acc[spec.key] = spec.value;
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
    // Acessar as especificações técnicas da nova estrutura
    const specs =
      enrichmentResult.enriched.especificacoesTecnicas
        ?.especificacoesTecnicas || {};
    const formattedSpecs = specsToArray(specs).map((spec) => ({
      id: uuidv4(),
      key: formatTechnicalKey(spec.key),
      value: spec.value,
      checked: true,
    }));

    // Debug para verificar as especificações
    console.log("🔍 Especificações encontradas:", specs);
    console.log("📋 Especificações formatadas:", formattedSpecs);
    console.log("📄 Estrutura completa do enrichmentResult:", enrichmentResult);

    return {
      categoria: enrichmentResult.enriched.categoria || "",
      aplicacao: enrichmentResult.enriched.aplicacao || "",
      informacoes: enrichmentResult.original.informacoes || "",
      marca: enrichmentResult.enriched.marcaFabricante || "",
      especificacoesTecnicas: formattedSpecs,
    };
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [marcaError, setMarcaError] = useState("");

  // Função para gerar dados completos
  const getDadosCompletos = () => {
    const nomeOriginal = editableData.informacoes || "Não informado";
    const marca = editableData.marca || "Não informada";
    const caracteristicas = editableData.especificacoesTecnicas
      .map((spec) => `${spec.key}: ${spec.value}`)
      .join(", ");

    return `Nome Original: ${nomeOriginal}\n\nMarca: ${marca}\n\nCaracterísticas Selecionadas:\n${
      caracteristicas || "Nenhuma característica selecionada"
    }`;
  };

  // Função para gerar resumo
  const getResumo = () => {
    const nomeOriginal = editableData.informacoes || "Produto";
    const marca = editableData.marca || "Marca não informada";
    return `${nomeOriginal} - ${marca}`;
  };

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
    // Validação da marca
    if (!editableData.marca.trim()) {
      setMarcaError("A marca é obrigatória para prosseguir");
      return;
    }

    setMarcaError("");

    const modifiedData: EnrichedProductData = {
      ...enrichmentResult.enriched,
      categoria: editableData.categoria,
      aplicacao: editableData.aplicacao,
      marcaFabricante: editableData.marca,
      // Também passamos as informações originais editadas
      informacoes: editableData.informacoes,
      especificacoesTecnicas: {
        // Preserva o resumoPDM original
        resumoPDM: enrichmentResult.enriched.especificacoesTecnicas?.resumoPDM,
        // Atualiza as especificações técnicas editadas
        especificacoesTecnicas: specsToObject(
          editableData.especificacoesTecnicas
        ),
      },
    };
    onContinue(modifiedData);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3, // Espaçamento entre seções
        width: "100%",
        // Removido padding para não criar limitações
      }}
    >
      {/* SEÇÃO 1: Resumo PDM - Conteúdo Fixo - Largura Total */}
      {enrichmentResult.enriched.especificacoesTecnicas?.resumoPDM && (
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
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontSize: "0.9rem",
              color: "info.main",
              fontWeight: 600,
            }}
          >
            Resumo PDM
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.75rem",
              lineHeight: 1.4,
              color: "text.primary",
              whiteSpace: "pre-line",
            }}
          >
            {enrichmentResult.enriched.especificacoesTecnicas.resumoPDM}
          </Typography>
        </Paper>
      )}

      {/* SEÇÃO 2: Características - Largura Total */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          width: "100%",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontSize: "0.9rem" }}>
          Características ({editableData.especificacoesTecnicas.length})
        </Typography>

        {/* Grid de Cards - Mantendo funcionamento original */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 0.8,
            mb: 2,
          }}
        >
          {editableData.especificacoesTecnicas.length === 0 ? (
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.75rem",
                color: "text.secondary",
                gridColumn: "1 / -1",
                textAlign: "center",
                py: 4,
              }}
            >
              Nenhuma característica encontrada. Use o botão
              &quot;Adicionar&quot; para criar novas características.
            </Typography>
          ) : (
            editableData.especificacoesTecnicas.map((spec) => (
              <CheckboxSpecCard
                key={spec.id}
                id={spec.id}
                label={spec.key}
                value={spec.value}
                checked={spec.checked}
                onCheck={(id, checked) => {
                  setEditableData((prev) => ({
                    ...prev,
                    especificacoesTecnicas: checked
                      ? prev.especificacoesTecnicas.map((s) =>
                          s.id === id ? { ...s, checked } : s
                        )
                      : prev.especificacoesTecnicas.filter((s) => s.id !== id),
                  }));
                }}
                onValueChange={(id, newValue) => {
                  setEditableData((prev) => ({
                    ...prev,
                    especificacoesTecnicas: prev.especificacoesTecnicas.map(
                      (s) => (s.id === id ? { ...s, value: newValue } : s)
                    ),
                  }));
                }}
                onLabelChange={(id, newLabel) => {
                  setEditableData((prev) => ({
                    ...prev,
                    especificacoesTecnicas: prev.especificacoesTecnicas.map(
                      (s) => (s.id === id ? { ...s, key: newLabel } : s)
                    ),
                  }));
                }}
                editable={true}
              />
            ))
          )}
        </Box>

        {/* Botão Add */}
        <Button
          variant="outlined"
          onClick={() => setIsDialogOpen(true)}
          startIcon={<AddIcon />}
          sx={{
            height: 32,
            fontSize: "0.7rem",
          }}
        >
          Adicionar
        </Button>
      </Paper>

      {/* SEÇÃO 3: Dados do Produto - Largura Total */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          width: "100%",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontSize: "0.9rem" }}>
          Dados do Produto
        </Typography>

        <Stack spacing={2} sx={{ mb: 3 }}>
          {/* Campo Informações Originais */}
          <TextField
            label="Informações Originais"
            value={editableData.informacoes}
            onChange={(e) => handleFieldChange("informacoes", e.target.value)}
            size="small"
            fullWidth
            helperText="Edite as informações originais conforme necessário"
          />

          {/* Campo Marca */}
          <TextField
            label="Marca"
            value={editableData.marca}
            onChange={(e) => {
              handleFieldChange("marca", e.target.value);
              if (marcaError) setMarcaError("");
            }}
            size="small"
            fullWidth
            error={!!marcaError}
            helperText={marcaError || "Informe a marca do produto"}
            required
          />

          {/* Dados Completos */}
          <Box
            sx={{
              p: 1.5,
              bgcolor: "grey.50",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontSize: "0.8rem", mb: 1, fontWeight: 600 }}
            >
              Dados Completos:
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontSize: "0.65rem",
                lineHeight: 1.4,
                color: "text.secondary",
                whiteSpace: "pre-line",
              }}
            >
              {getDadosCompletos()}
            </Typography>
          </Box>

          {/* Resumo */}
          <Box
            sx={{
              p: 1.5,
              bgcolor: "grey.50",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontSize: "0.8rem", mb: 1, fontWeight: 600 }}
            >
              Resumo:
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontSize: "0.65rem",
                lineHeight: 1.4,
                color: "text.secondary",
              }}
            >
              {getResumo()}
            </Typography>
          </Box>
        </Stack>

        {/* Botões de Ação */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            pt: 2,
            borderTop: "1px solid",
            borderColor: "grey.200",
          }}
        >
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
