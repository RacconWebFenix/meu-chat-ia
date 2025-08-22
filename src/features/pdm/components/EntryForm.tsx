/**
 * Entry form component following SOLID principles
 * 
 * Single Responsibility: Handle product data entry
 * Open/Closed: Extensible via props without modification
 * Interface Segregation: Uses specific, focused interfaces
 * Dependency Inversion: Depends on abstractions (hooks)
 */

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  FormHelperText
} from '@mui/material';
import { CustomInput, CustomButton } from '@/components/shared';
import { useEntryForm } from '../hooks';
import { BaseProductInfo, EntryFormField, EntryFormSubmitHandler } from '../types';

interface EntryFormProps {
  readonly onSubmit?: EntryFormSubmitHandler;
  readonly onCancel?: () => void;
  readonly disabled?: boolean;
  readonly title?: string;
  readonly subtitle?: string;
}

// Field configuration following Open/Closed Principle
const FORM_FIELDS: EntryFormField[] = [
  {
    key: 'nome',
    label: 'Nome do Material',
    placeholder: 'Ex: Rolamento, Parafuso, Filtro, Trator...',
    required: true,
    maxLength: 100,
    helpText: 'Digite o nome ou tipo do material que você está procurando'
  },
  {
    key: 'referencia',
    label: 'Referência/Código',
    placeholder: 'Ex: 6205, M8x20, WL1013, 5075E...',
    required: false,
    maxLength: 50,
    helpText: 'Código, referência ou número do fabricante (opcional)'
  },
  {
    key: 'marcaFabricante',
    label: 'Marca/Fabricante',
    placeholder: 'Ex: SKF, Bosch, Wega, John Deere...',
    required: false,
    maxLength: 50,
    helpText: 'Informar a marca garante dados mais precisos (opcional)'
  },
  {
    key: 'caracteristicas',
    label: 'Características Físicas',
    placeholder: 'Ex: 25x52x15mm, M8 x 20mm, Para Fiat Cronos...',
    required: false,
    maxLength: 200,
    helpText: 'Dimensões, aplicações ou outras características (opcional)'
  }
];

export default function EntryForm({
  onSubmit,
  onCancel,
  disabled = false,
  title = 'Informações do Material',
  subtitle = 'Preencha os dados que você possui sobre o material'
}: EntryFormProps) {
  const { state, updateField, handleSubmit, handleReset, canSubmit } = useEntryForm({
    onSubmit
  });

  const handleFormSubmit = async () => {
    try {
      await handleSubmit();
    } catch (error) {
      console.error('Erro no formulário:', error);
    }
  };

  const handleCancel = () => {
    handleReset();
    onCancel?.();
  };

  const renderField = (field: EntryFormField) => {
    const value = state.data[field.key] || '';
    const error = state.validation.errors[field.key];
    const hasError = Boolean(error);

    return (
      <Box key={field.key} sx={{ mb: 2 }}>
        <CustomInput
          label={field.required ? `${field.label} *` : field.label}
          value={value}
          onChange={(e) => updateField(field.key, e.target.value)}
          placeholder={field.placeholder}
          disabled={disabled || state.isSubmitting}
          error={hasError}
          fullWidth
          margin="normal"
          inputProps={{ maxLength: field.maxLength }}
        />
        {error && (
          <FormHelperText error sx={{ mt: 0.5 }}>
            {error}
          </FormHelperText>
        )}
        {!error && field.helpText && (
          <FormHelperText sx={{ mt: 0.5 }}>
            {field.helpText}
          </FormHelperText>
        )}
      </Box>
    );
  };

  return (
    <Card elevation={2} sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 3 }}
        >
          {subtitle}
        </Typography>

        <Box component="form" noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {FORM_FIELDS.map(renderField)}
          </Box>

          {!state.validation.isValid && Object.keys(state.validation.errors).length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Por favor, corrija os campos destacados antes de continuar.
            </Alert>
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            {onCancel && (
              <CustomButton
                colorType="secondary"
                onClick={handleCancel}
                disabled={state.isSubmitting}
              >
                Cancelar
              </CustomButton>
            )}
            
            <CustomButton
              colorType="primary"
              onClick={handleFormSubmit}
              disabled={!canSubmit || disabled}
            >
              {state.isSubmitting ? 'Processando...' : 'Gerar PDM'}
            </CustomButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
