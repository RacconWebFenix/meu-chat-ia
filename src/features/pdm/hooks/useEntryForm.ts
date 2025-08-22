/**
 * Entry form hook following Single Responsibility Principle
 * Responsibility: Manage entry form state, validation and submission
 */

import { useState, useCallback, useMemo } from "react";
import {
  BaseProductInfo,
  EntryFormState,
  EntryFormValidation,
  EntryFormSubmitHandler,
  EntryFormResetHandler,
} from "../types";

interface UseEntryFormReturn {
  readonly state: EntryFormState;
  readonly updateField: (field: keyof BaseProductInfo, value: string) => void;
  readonly handleSubmit: () => Promise<void>;
  readonly handleReset: () => void;
  readonly canSubmit: boolean;
}

interface UseEntryFormParams {
  readonly onSubmit?: EntryFormSubmitHandler;
  readonly onReset?: EntryFormResetHandler;
}

const INITIAL_DATA: BaseProductInfo = {
  nome: "",
  referencia: "",
  marcaFabricante: "",
  caracteristicas: "",
};

export function useEntryForm(
  params: UseEntryFormParams = {}
): UseEntryFormReturn {
  const { onSubmit, onReset } = params;

  const [data, setData] = useState<BaseProductInfo>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation logic following Single Responsibility
  const validation = useMemo((): EntryFormValidation => {
    const errors: Record<string, string> = {};

    // Nome é obrigatório
    if (!data.nome.trim()) {
      errors.nome = "Nome do material é obrigatório";
    } else if (data.nome.length < 2) {
      errors.nome = "Nome deve ter pelo menos 2 caracteres";
    } else if (data.nome.length > 100) {
      errors.nome = "Nome deve ter no máximo 100 caracteres";
    }

    // Validação opcional para referência
    if (data.referencia && data.referencia.length > 50) {
      errors.referencia = "Referência deve ter no máximo 50 caracteres";
    }

    // Validação opcional para marca
    if (data.marcaFabricante && data.marcaFabricante.length > 50) {
      errors.marcaFabricante = "Marca deve ter no máximo 50 caracteres";
    }

    // Validação opcional para características
    if (data.caracteristicas && data.caracteristicas.length > 200) {
      errors.caracteristicas =
        "Características devem ter no máximo 200 caracteres";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }, [data]);

  // Update field with validation
  const updateField = useCallback(
    (field: keyof BaseProductInfo, value: string) => {
      setData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!validation.isValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.(data);
    } catch (error) {
      console.error("Erro ao submeter formulário:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [data, validation.isValid, isSubmitting, onSubmit]);

  // Handle form reset
  const handleReset = useCallback(() => {
    setData(INITIAL_DATA);
    setIsSubmitting(false);
    onReset?.();
  }, [onReset]);

  // Can submit calculation
  const canSubmit = useMemo(
    () => validation.isValid && !isSubmitting && data.nome.trim().length > 0,
    [validation.isValid, isSubmitting, data.nome]
  );

  const state: EntryFormState = {
    data,
    validation,
    isSubmitting,
  };

  return {
    state,
    updateField,
    handleSubmit,
    handleReset,
    canSubmit,
  };
}
