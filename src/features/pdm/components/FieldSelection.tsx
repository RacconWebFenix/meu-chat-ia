// src/features/pdm/components/FieldSelection.tsx

import React, { useState } from "react";
import {
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
import { v4 as uuidv4 } from "uuid";
import {
  EnrichmentResponse,
  EnrichedProductData,
  Specification,
  BaseProductInfo, // Importar o tipo BaseProductInfo
} from "../types";
import { formatTechnicalKey } from "@/Utils/formatUtils";

// ... (specsToArray e specsToObject permanecem os mesmos)
const specsToArray = (specs: Record<string, unknown>): Specification[] => {
  return Object.entries(specs).reduce((acc, [key, value]) => {
    if (typeof value === "string") {
      acc.push({ id: uuidv4(), key, value });
    } else if (typeof value === "number") {
      acc.push({ id: uuidv4(), key, value: String(value) });
    }
    return acc;
  }, [] as Specification[]);
};

const specsToObject = (specs: Specification[]): Record<string, string> => {
  return specs.reduce((acc, spec) => {
    if (spec.key.trim()) {
      acc[spec.key.trim()] = spec.value;
    }
    return acc;
  }, {} as Record<string, string>);
};

// Interface para o estado combinado - campos editáveis
type EditableData = Omit<BaseProductInfo, 'nome'> & // nome permanece readonly
  Omit<EnrichedProductData, "especificacoesTecnicas"> & {
    especificacoesTecnicas: Specification[];
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
  const [editableData, setEditableData] = useState<EditableData>(() => {
    const formattedSpecs = specsToArray(
      enrichmentResult.enriched.especificacoesTecnicas
    ).map((spec) => ({
      ...spec,
      key: formatTechnicalKey(spec.key),
    }));

    // Combina os dados, dando prioridade aos valores de 'enriched' somente se eles existirem.
    const combinedData = {
      ...enrichmentResult.original,
      ...enrichmentResult.enriched,
    };

    // Garante que a marca do fabricante do 'original' seja usada se a do 'enriched' for vazia.
    if (
      !combinedData.marcaFabricante &&
      enrichmentResult.original.marcaFabricante
    ) {
      combinedData.marcaFabricante = enrichmentResult.original.marcaFabricante;
    }

    return {
      ...combinedData,
      especificacoesTecnicas: formattedSpecs,
    };
  });

  const handleFieldChange = (
    field: keyof Omit<EditableData, "especificacoesTecnicas">,
    value: string
  ) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

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

  const handleAddNewSpec = () => {
    setEditableData((prev) => ({
      ...prev,
      especificacoesTecnicas: [
        ...prev.especificacoesTecnicas,
        { id: uuidv4(), key: "", value: "" },
      ],
    }));
  };

  const handleDeleteSpec = (id: string) => {
    setEditableData((prev) => ({
      ...prev,
      especificacoesTecnicas: prev.especificacoesTecnicas.filter(
        (spec) => spec.id !== id
      ),
    }));
  };

  const handleContinue = () => {
    const { especificacoesTecnicas, informacoes, ...rest } = editableData;
    
    // Criar dados enriquecidos com base no que foi editado
    const enrichedData: EnrichedProductData = {
      ...enrichmentResult.enriched, // Manter dados do enriquecimento original
      ...rest, // Sobrescrever com edições do usuário
      especificacoesTecnicas: specsToObject(especificacoesTecnicas),
    };
    
    onContinue(enrichedData);
  };

  return (
    <Stack gap={3}>
      <Typography variant="h5">Revisão e Ajuste dos Dados</Typography>
      <Alert severity="info">
        Revise os dados. Você pode editar, adicionar ou remover características
        para melhorar a qualidade da busca.
      </Alert>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack gap={2}>
          {/* Campo de informações originais - editável */}
          <TextField
            label="Informações do Material"
            value={editableData.informacoes || ""}
            onChange={(e) => handleFieldChange("informacoes", e.target.value)}
            fullWidth
            multiline
            rows={3}
            helperText="Informações originais digitadas pelo usuário - você pode editar se necessário"
          />
        </Stack>
        <Divider sx={{ my: 3 }}>
          <Typography variant="overline">Especificações Técnicas</Typography>
        </Divider>
        <Stack gap={2}>
          {/* ... A lógica de mapeamento das especificações técnicas permanece a mesma ... */}
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
