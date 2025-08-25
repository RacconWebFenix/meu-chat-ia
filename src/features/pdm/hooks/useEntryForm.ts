/**
 * Hook do formulário de entrada.
 * Responsabilidade: Gerenciar estado, validação e submissão do formulário.
 * REGRA DE NEGÓCIO ATUALIZADA: A validação passa se 'nome', 'referencia' OU 'marcaFabricante' estiver preenchido.
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

  // Lógica de validação com a nova regra de negócio
  const validation = useMemo((): EntryFormValidation => {
    const errors: Record<string, string> = {};
    const { nome, referencia, marcaFabricante } = data;

    // CORREÇÃO: Verifica se pelo menos um dos campos chave está preenchido.
    const isAnyKeyFieldFilled =
      (nome && nome.trim() !== "") ||
      (referencia && referencia.trim() !== "") ||
      (marcaFabricante && marcaFabricante.trim() !== "");

    if (!isAnyKeyFieldFilled) {
      // Erro genérico para indicar a nova regra.
      // Pode ser exibido em um componente <Alert>.
      errors.form =
        "Preencha ao menos o Nome, Referência ou Fabricante para iniciar a análise.";
    }

    // Mantemos validações individuais para feedback específico no campo (se necessário)
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

  // CORREÇÃO: Lógica de 'canSubmit' simplificada para depender apenas da validação.
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
