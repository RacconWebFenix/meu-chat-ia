/**
 * Entry form component com layout "Aço Escovado" (B2B, minimalista).
 * Adicionados novos campos: Breve Descrição, Aplicação e Unidade de Medida.
 */

import React from "react";
import {
  Box,
  Paper,
  Typography,
  Alert,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import { useEntryForm } from "../hooks";
import {
  EntryFormField,
  EntryFormSubmitHandler,
  EntryFormResetHandler,
} from "../types";

interface EntryFormProps {
  readonly onSubmit?: EntryFormSubmitHandler;
  readonly onCancel?: EntryFormResetHandler; // Corrigido para EntryFormResetHandler
  readonly disabled?: boolean;
  readonly title?: string;
  readonly subtitle?: string;
}

// Configuração dos campos com as novas adições
const FORM_FIELDS: EntryFormField[] = [
  {
    key: "nome",
    label: "Nome do Material",
    placeholder: "Ex: Rolamento de esferas, Parafuso sextavado...",
    required: true, // Mantido como true para a UI, mas a validação do hook é flexível
    maxLength: 100,
    helpText: "Nome principal ou tipo do material.",
  },
  {
    key: "referencia",
    label: "Referência / Part Number",
    placeholder: "Ex: 6205-2Z, DIN 933...",
    required: false,
    maxLength: 50,
    helpText: "Código do fabricante ou norma técnica (opcional).",
  },
  {
    key: "marcaFabricante",
    label: "Marca / Fabricante",
    placeholder: "Ex: SKF, Gerdau, 3M...",
    required: false,
    maxLength: 50,
    helpText: "A marca do produto (opcional).",
  },
  // NOVOS CAMPOS ADICIONADOS
  {
    key: "breveDescricao",
    label: "Breve Descrição",
    placeholder: "Descrição curta do item, como aparece em uma nota fiscal.",
    required: false,
    maxLength: 250,
    helpText: "Uma descrição concisa do material.",
  },
  {
    key: "aplicacao",
    label: "Aplicação",
    placeholder:
      "Ex: Usado em motores elétricos de 50cv, parafusadeira de impacto...",
    required: false,
    maxLength: 250,
    helpText: "Onde este item é utilizado (equipamento, processo, etc.).",
  },
  {
    key: "unidadeMedida",
    label: "Unidade de Medida",
    placeholder: "Ex: Peça, Unidade, Caixa, Kg, Metro...",
    required: false,
    maxLength: 20,
    helpText: "Como o item é quantificado.",
  },
];

export default function EntryForm({
  onSubmit,
  onCancel,
  disabled = false,
  title = "Análise de Descrição de Material",
  subtitle = "Forneça os dados abaixo para iniciar o processo de padronização (PDM).",
}: EntryFormProps) {
  const { state, updateField, handleSubmit, handleReset, canSubmit } =
    useEntryForm({
      onSubmit,
      onReset: onCancel,
    });

  const renderField = (field: EntryFormField) => {
    const error = state.validation.errors[field.key];
    // Campos de texto mais longos terão múltiplas linhas
    const isMultiline =
      field.key === "aplicacao" || field.key === "breveDescricao";

    return (
      <Box key={field.key}>
        <TextField
          fullWidth
          id={field.key}
          name={field.key}
          label={field.label}
          placeholder={field.placeholder}
          value={state.data[field.key] || ""}
          // Corrigido para usar o updateField do hook
          onChange={(e) => updateField(field.key, e.target.value)}
          required={field.required}
          disabled={state.isSubmitting || disabled}
          error={!!error}
          helperText={error || field.helpText}
          inputProps={{ maxLength: field.maxLength }}
          multiline={isMultiline}
          rows={isMultiline ? 3 : 1}
        />
      </Box>
    );
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 4 } }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {subtitle}
      </Typography>
      <Stack component="form" noValidate gap={3}>
        {FORM_FIELDS.map(renderField)}

        {state.validation.errors.form && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {state.validation.errors.form}
          </Alert>
        )}

        <Stack direction="row" gap={2} justifyContent="flex-end" sx={{ mt: 3 }}>
          {onCancel && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              disabled={state.isSubmitting}
            >
              Limpar
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!canSubmit || disabled}
            size="large"
          >
            {state.isSubmitting ? "Analisando..." : "Analisar Material"}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
