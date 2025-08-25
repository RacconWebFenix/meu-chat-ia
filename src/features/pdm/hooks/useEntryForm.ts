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

// CORREÇÃO: Adicionados os novos campos ao estado inicial.
const INITIAL_DATA: BaseProductInfo = {
  nome: "",
  referencia: "",
  marcaFabricante: "",
  caracteristicas: "",
  aplicacao: "",
  breveDescricao: "",
  unidadeMedida: "",
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
    const { nome, referencia, marcaFabricante } = data;

    const isAnyKeyFieldFilled =
      (nome && nome.trim() !== "") ||
      (referencia && referencia.trim() !== "") ||
      (marcaFabricante && marcaFabricante.trim() !== "");

    if (!isAnyKeyFieldFilled) {
      errors.form =
        "Preencha ao menos o Nome, Referência ou Fabricante para iniciar a análise.";
    }

    if (nome.trim() && nome.length < 2) {
      errors.nome = "Nome deve ter pelo menos 2 caracteres";
    }

    return {
      isValid: Object.keys(errors).length === 0,
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
