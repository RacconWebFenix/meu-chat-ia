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
  readonly onCancel?: EntryFormResetHandler;
  readonly disabled?: boolean;
}

// Configuração do campo único simplificado
const FORM_FIELDS: EntryFormField[] = [
  {
    key: "informacoes",
    label: "Informações do Material",
    placeholder: "Ex: Rolamento SKF 6205-2Z, motor WEG 10cv, parafuso M8x50...",
    required: true,
    maxLength: 500,
    helpText: "Digite nome, marca, referência, aplicação, etc.",
  },
];

export default function EntryForm({
  onSubmit,
  onCancel,
  disabled = false,
}: EntryFormProps) {
  const { state, updateField, handleSubmit, handleReset, canSubmit } =
    useEntryForm({
      onSubmit,
      onReset: onCancel,
    });

  const field = FORM_FIELDS[0]; // Apenas um campo
  const error = state.validation.errors[field.key];

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 0 }}>
      {/* Campo Ultra Compacto */}
      <TextField
        fullWidth
        id={field.key}
        label={field.label}
        placeholder={field.placeholder}
        value={state.data[field.key] || ""}
        onChange={(e) => updateField(field.key, e.target.value)}
        disabled={state.isSubmitting || disabled}
        error={!!error}
        helperText={error || field.helpText}
        inputProps={{ maxLength: field.maxLength }}
        multiline
        rows={3}
        sx={{
          mb: 1.5,
          "& .MuiFormHelperText-root": {
            fontSize: "0.75rem",
            margin: "4px 0 0 0",
          },
        }}
      />

      {/* Erro de Validação Compacto */}
      {state.validation.errors.form && (
        <Alert severity="warning" sx={{ mb: 1.5, py: 0.5 }}>
          {state.validation.errors.form}
        </Alert>
      )}

      {/* Botões Compactos */}
      <Stack direction="row" gap={1.5} justifyContent="flex-end">
        {onCancel && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleReset}
            disabled={state.isSubmitting}
            size="medium"
            sx={{ minWidth: 80 }}
          >
            Limpar
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!canSubmit || disabled}
          size="medium"
          sx={{ minWidth: 160 }}
        >
          {state.isSubmitting ? "Analisando..." : "Analisar Material"}
        </Button>
      </Stack>
    </Box>
  );
}
