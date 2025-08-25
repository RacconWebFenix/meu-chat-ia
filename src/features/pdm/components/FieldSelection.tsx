/**
 * FieldSelection component, refatorado para ser uma interface de edição interativa.
 * O usuário agora pode editar, adicionar e remover especificações.
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Stack,
  TextField,
  IconButton,
  Divider,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid"; // Para gerar IDs únicos
import {
  EnrichmentResponse,
  EnrichedProductData,
  Specification,
} from "../types";

// Função utilitária para converter especificações de objeto para array
const convertSpecificationsToArray = (
  specs: Specification[] | Record<string, string> | unknown
): Specification[] => {
  if (Array.isArray(specs)) {
    // Se já é array, retorna como está
    return specs;
  }

  if (specs && typeof specs === "object") {
    // Se é objeto, converte para array
    return Object.entries(specs as Record<string, string>).map(
      ([key, value]) => ({
        id: uuidv4(),
        key,
        value: String(value),
      })
    );
  }

  // Se não é nem array nem objeto, retorna array vazio
  return [];
};

// Função utilitária para converter array de especificações de volta para objeto
const convertSpecificationsToObject = (
  specs: Specification[]
): Record<string, string> => {
  const result: Record<string, string> = {};
  specs.forEach((spec) => {
    if (spec.key && spec.value) {
      result[spec.key] = spec.value;
    }
  });
  return result;
};

// A prop 'onContinue' agora passará os dados enriquecidos e modificados
interface FieldSelectionProps {
  readonly enrichmentResult: EnrichmentResponse;
  readonly onBack: () => void;
  readonly onContinue: (modifiedData: EnrichedProductData) => void;
}

// Tipo interno para o estado local do componente (sempre array)
interface EditableEnrichedData
  extends Omit<EnrichedProductData, "especificacoesTecnicas"> {
  readonly especificacoesTecnicas: Specification[];
}

export default function FieldSelection({
  enrichmentResult,
  onBack,
  onContinue,
}: FieldSelectionProps) {
  // Função para processar os dados enriquecidos e garantir que especificações seja array
  const processEnrichedData = (
    data: EnrichedProductData
  ): EditableEnrichedData => {
    return {
      ...data,
      especificacoesTecnicas: convertSpecificationsToArray(
        data.especificacoesTecnicas
      ),
    };
  };

  // Cria uma "cópia de trabalho" dos dados enriquecidos no estado local
  const [editableData, setEditableData] = useState<EditableEnrichedData>(() =>
    processEnrichedData(structuredClone(enrichmentResult.enriched))
  );

  // Efeito para sincronizar o estado se o resultado do enriquecimento mudar
  useEffect(() => {
    setEditableData(
      processEnrichedData(structuredClone(enrichmentResult.enriched))
    );
  }, [enrichmentResult]);

  // Handler para editar campos de texto principais (categoria, subcategoria)
  const handleFieldChange = (
    field: keyof EditableEnrichedData,
    value: string
  ) => {
    setEditableData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handler para editar uma especificação técnica (seja a chave ou o valor)
  const handleSpecChange = (
    id: string,
    field: "key" | "value",
    value: string
  ) => {
    setEditableData((prev) => ({
      ...prev,
      especificacoesTecnicas: prev.especificacoesTecnicas.map((spec) =>
        spec.id === id ? { ...spec, [field]: value } : spec
      ),
    }));
  };

  // Handler para adicionar uma nova especificação em branco
  const handleAddNewSpec = () => {
    const newSpec: Specification = { id: uuidv4(), key: "", value: "" };
    setEditableData((prev) => ({
      ...prev,
      especificacoesTecnicas: [...prev.especificacoesTecnicas, newSpec],
    }));
  };

  // Handler para remover uma especificação
  const handleDeleteSpec = (id: string) => {
    setEditableData((prev) => ({
      ...prev,
      especificacoesTecnicas: prev.especificacoesTecnicas.filter(
        (spec) => spec.id !== id
      ),
    }));
  };

  // Função para preparar os dados finais antes de enviar
  const handleContinue = () => {
    const finalData: EnrichedProductData = {
      ...editableData,
      especificacoesTecnicas: convertSpecificationsToObject(
        editableData.especificacoesTecnicas
      ),
    };
    onContinue(finalData);
  };

  return (
    <Stack gap={3}>
      <Typography variant="h5">Revisão e Ajuste dos Dados</Typography>
      <Alert severity="info">
        Revise os dados extraídos pela IA. Você pode editar, adicionar ou
        remover características para melhorar a qualidade do PDM antes de
        prosseguir.
      </Alert>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack gap={2}>
          <TextField
            label="Categoria"
            value={editableData.categoria}
            onChange={(e) => handleFieldChange("categoria", e.target.value)}
            fullWidth
          />
          <TextField
            label="Subcategoria"
            value={editableData.subcategoria || ""}
            onChange={(e) => handleFieldChange("subcategoria", e.target.value)}
            fullWidth
          />
        </Stack>
        <Divider sx={{ my: 3 }}>
          <Typography variant="overline">Especificações Técnicas</Typography>
        </Divider>
        <Stack gap={2}>
          {editableData.especificacoesTecnicas.map((spec) => (
            <Stack direction="row" key={spec.id} gap={2} alignItems="center">
              <TextField
                label="Característica"
                value={spec.key}
                onChange={(e) =>
                  handleSpecChange(spec.id, "key", e.target.value)
                }
                sx={{ flex: 1 }}
              />
              <TextField
                label="Valor"
                value={spec.value}
                onChange={(e) =>
                  handleSpecChange(spec.id, "value", e.target.value)
                }
                sx={{ flex: 1 }}
              />
              <IconButton
                onClick={() => handleDeleteSpec(spec.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}
          <Button
            onClick={handleAddNewSpec}
            startIcon={<AddIcon />}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            Adicionar Característica
          </Button>
        </Stack>
      </Paper>

      <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
        <Button variant="outlined" color="secondary" onClick={onBack}>
          Voltar
        </Button>
        <Button variant="contained" onClick={handleContinue} size="large">
          Confirmar e Buscar Equivalências
        </Button>
      </Stack>
    </Stack>
  );
}
