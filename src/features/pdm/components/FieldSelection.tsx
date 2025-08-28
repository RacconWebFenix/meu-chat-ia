// src/features/pdm/components/FieldSelection.tsx
// Layout Horizontal 65/35 - Ultra Compacto - Sem Scroll - Updated: 2025-08-28

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
const specsToArray = (specs: Record<string, unknown>): Array<{key: string; value: string}> => {
  return Object.entries(specs || {}).map(([key, value]) => ({ key, value: String(value) }));
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
      .map(spec => `${spec.key}: ${spec.value}`)
      .join(", ");
    
    return `Nome Original: ${nomeOriginal}\n\nMarca: ${marca}\n\nCaracterísticas Selecionadas:\n${caracteristicas || "Nenhuma característica selecionada"}`;
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
      especificacoesTecnicas: specsToObject(editableData.especificacoesTecnicas),
    };
    onContinue(modifiedData);
  };

  return (
    <Box sx={{ 
      height: "100%", // Usa 100% do container pai
      display: "flex", 
      gap: 2,
      overflow: "hidden"
    }}>
      {/* Painel Esquerdo - 65% */}
      <Paper
        elevation={1}
        sx={{
          flex: "0 0 65%",
          p: 2,
          display: "flex",
          flexDirection: "column",
          minHeight: 0, // Permite que o flex funcione corretamente
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontSize: "0.9rem" }}>
          Características
        </Typography>

        {/* Grid de Cards - Layout original com melhorias de scroll */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 0.8,
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
                  especificacoesTecnicas: checked 
                    ? prev.especificacoesTecnicas.map((s) =>
                        s.id === id ? { ...s, checked } : s
                      )
                    : prev.especificacoesTecnicas.filter((s) => s.id !== id)
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
          sx={{ 
            mt: 2, 
            height: 32, 
            fontSize: "0.7rem",
            flexShrink: 0, // Impede que o botão seja comprimido
          }}
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
          display: "flex",
          flexDirection: "column",
          minHeight: 0, // Permite que o flex funcione corretamente
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontSize: "0.9rem" }}>
          Dados do Produto
        </Typography>

        <Box sx={{ 
          flex: 1, 
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2
        }}>
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
          <Box sx={{ 
            p: 1.5, 
            bgcolor: "grey.50", 
            borderRadius: 1,
            border: "1px solid",
            borderColor: "grey.200",
          }}>
            <Typography variant="subtitle2" sx={{ fontSize: "0.8rem", mb: 1, fontWeight: 600 }}>
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
          <Box sx={{ 
            p: 1.5, 
            bgcolor: "grey.50", 
            borderRadius: 1,
            border: "1px solid",
            borderColor: "grey.200",
          }}>
            <Typography variant="subtitle2" sx={{ fontSize: "0.8rem", mb: 1, fontWeight: 600 }}>
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
        </Box>

        {/* Botões de Ação */}
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{ 
            mt: 2, 
            pt: 2,
            flexShrink: 0, // Impede que os botões sejam comprimidos
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