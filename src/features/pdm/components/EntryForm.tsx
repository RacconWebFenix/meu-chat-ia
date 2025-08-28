/**
 * Entry form component ultra-compacto
 * Otimizado para eliminar scroll vertical - Updated: 2025-08-28
 */

import React from "react";
import {
  Box,
  Typography,
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
    <Box 
      sx={{ 
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        px: 3,
        py: 2,
      }}
    >
      {/* Container Central */}
      <Box sx={{ 
        width: "100%", 
        maxWidth: 600,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}>
        {/* Campo de Entrada */}
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
          rows={4}
          variant="outlined"
          sx={{
            "& .MuiFormHelperText-root": {
              fontSize: "0.75rem",
            },
            "& .MuiInputLabel-root": {
              fontSize: "0.9rem",
            },
          }}
        />

        {/* Botões de Ação */}
        <Stack direction="row" gap={1.5} justifyContent="flex-end">
          {onCancel && (
            <Button
              variant="outlined"
              onClick={handleReset}
              disabled={state.isSubmitting}
              sx={{ 
                minWidth: 80,
                height: 36,
                fontSize: "0.8rem",
              }}
            >
              Limpar
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!canSubmit || disabled}
            sx={{ 
              minWidth: 160,
              height: 36,
              fontSize: "0.8rem",
            }}
          >
            {state.isSubmitting ? "Analisando..." : "Analisar Material"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
