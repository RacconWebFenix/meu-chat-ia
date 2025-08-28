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

// Configuração do campo único simplificado
const FORM_FIELDS: EntryFormField[] = [
  {
    key: "informacoes",
    label: "Informações do Material",
    placeholder: "Ex: Rolamento SKF 6205-2Z, parafuso sextavado M8x50, usado em motores elétricos...",
    required: true,
    maxLength: 500,
    helpText: "Digite todas as informações que possui sobre o material. Separe múltiplas informações por vírgula.",
  },
];

export default function EntryForm({
  onSubmit,
  onCancel,
  disabled = false,
  title = "Análise de Descrição de Material",
  subtitle = "Digite todas as informações que possui sobre o material. Você pode incluir nome, marca, referência, aplicação, etc. Separe múltiplas informações por vírgula.",
}: EntryFormProps) {
  const { state, updateField, handleSubmit, handleReset, canSubmit } =
    useEntryForm({
      onSubmit,
      onReset: onCancel,
    });

  const renderField = (field: EntryFormField) => {
    const error = state.validation.errors[field.key];
    // Campo único será sempre multiline para comportar mais informações
    const isMultiline = true;

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
          rows={4}
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
