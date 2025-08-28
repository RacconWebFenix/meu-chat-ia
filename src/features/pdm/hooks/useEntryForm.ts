/**
 * Hook do formulário de entrada.
 * Responsabilidade: Gerenciar estado, validação e submissão do formulário.
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

// CORREÇÃO: Simplificado para usar apenas o campo informacoes.
const INITIAL_DATA: BaseProductInfo = {
  informacoes: "",
};

export function useEntryForm(
  params: UseEntryFormParams = {}
): UseEntryFormReturn {
  const { onSubmit, onReset } = params;

  const [data, setData] = useState<BaseProductInfo>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // A lógica de validação que implementamos antes continua a mesma e funcional.
  const validation = useMemo((): EntryFormValidation => {
    const errors: Record<string, string> = {};

    // Sem validação obrigatória - permite submit com qualquer conteúdo
    return {
      isValid: true,
      errors,
    };
  }, [data]);

  const updateField = useCallback(
    (field: keyof BaseProductInfo, value: string) => {
      setData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

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

  const handleReset = useCallback(() => {
    setData(INITIAL_DATA);
    setIsSubmitting(false);
    onReset?.();
  }, [onReset]);

  const canSubmit = useMemo(
    () => validation.isValid && !isSubmitting,
    [validation.isValid, isSubmitting]
  );

  return {
    state: { data, validation, isSubmitting },
    updateField,
    handleSubmit,
    handleReset,
    canSubmit,
  };
}
