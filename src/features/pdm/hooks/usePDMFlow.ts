/**
 * PDM Flow hook following Single Responsibility Principle
 * Responsibility: Manage PDM flow state and transitions
 */

import { useState, useCallback } from "react";
import { PDMFlowState, PDMStep, ProcessingStatus } from "../types";

interface UsePDMFlowReturn {
  readonly state: PDMFlowState;
  readonly goToStep: (step: PDMStep) => void;
  readonly setStatus: (status: ProcessingStatus) => void;
  readonly setError: (error: string | null) => void;
  readonly reset: () => void;
}

const INITIAL_STATE: PDMFlowState = {
  currentStep: PDMStep.ENTRY,
  status: ProcessingStatus.IDLE,
  error: null,
};

export function usePDMFlow(): UsePDMFlowReturn {
  const [state, setState] = useState<PDMFlowState>(INITIAL_STATE);

  const goToStep = useCallback((step: PDMStep) => {
    setState((prevState) => ({
      ...prevState,
      currentStep: step,
      error: null,
    }));
  }, []);

  const setStatus = useCallback((status: ProcessingStatus) => {
    setState((prevState) => ({
      ...prevState,
      status,
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prevState) => ({
      ...prevState,
      error,
      status: error ? ProcessingStatus.ERROR : ProcessingStatus.IDLE,
    }));
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    state,
    goToStep,
    setStatus,
    setError,
    reset,
  };
}
