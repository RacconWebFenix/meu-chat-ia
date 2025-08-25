/**
 * PDMFlow - Orquestrador das etapas do fluxo PDM.
 * Corrigido para usar a fábrica de serviços (Dependency Inversion).
 */
import React from "react";
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
} from "@mui/material";
import { usePDMFlow } from "../hooks";
import {
  PDMStep,
  ProcessingStatus,
  BaseProductInfo,
  EnrichmentResponse,
  SelectedFields,
  EquivalenceSearchResponse,
} from "../types";
// CORREÇÃO: Importando a função fábrica em vez da implementação mock.
import { createEnrichmentService, MockEquivalenceService } from "../services";
import EntryForm from "./EntryForm";
import EnrichmentResult from "./EnrichmentResult";
import FieldSelection from "./FieldSelection";
import EquivalenceResults from "./EquivalenceResults";

interface PDMFlowProps {
  readonly className?: string;
}

const STEPS = [
  { key: PDMStep.ENTRY, label: "Entrada de Dados" },
  { key: PDMStep.ENRICHMENT, label: "Enriquecimento" },
  { key: PDMStep.FIELD_SELECTION, label: "Seleção de Campos" },
  { key: PDMStep.EQUIVALENCE_SEARCH, label: "Resultados" },
];

export default function PDMFlow({ className }: PDMFlowProps) {
  const { state, goToStep, setStatus, setError } = usePDMFlow();
  const [enrichmentResult, setEnrichmentResult] =
    React.useState<EnrichmentResponse | null>(null);
  const [selectedFields, setSelectedFields] =
    React.useState<SelectedFields | null>(null);
  const [equivalenceResult, setEquivalenceResult] =
    React.useState<EquivalenceSearchResponse | null>(null);

  // CORREÇÃO: Usando a função fábrica para obter o serviço.
  // A lógica de qual serviço usar (real ou mock) está agora centralizada
  // e isolada no arquivo services/index.ts.
  const enrichmentService = createEnrichmentService();
  const equivalenceService = new MockEquivalenceService(); // Mantido como mock por enquanto

  const handleEntrySubmit = async (data: BaseProductInfo) => {
    try {
      setStatus(ProcessingStatus.PROCESSING);
      const result = await enrichmentService.enrichProduct({
        productInfo: data,
      });
      setEnrichmentResult(result);
      goToStep(PDMStep.ENRICHMENT);
      setStatus(ProcessingStatus.COMPLETED);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro desconhecido");
      setStatus(ProcessingStatus.ERROR);
    }
  };

  const handleFieldSelectionSubmit = async (fields: SelectedFields) => {
    if (!enrichmentResult) return;
    try {
      setStatus(ProcessingStatus.PROCESSING);
      goToStep(PDMStep.EQUIVALENCE_SEARCH);
      const searchCriteria = MockEquivalenceService.createSearchCriteria(
        enrichmentResult,
        fields
      );
      const result = await equivalenceService.searchEquivalents(searchCriteria);
      setEquivalenceResult(result);
      setStatus(ProcessingStatus.COMPLETED);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro desconhecido");
      setStatus(ProcessingStatus.ERROR);
    }
  };

  const renderStepContent = () => {
    switch (state.currentStep) {
      case PDMStep.ENTRY:
        return (
          <EntryForm
            onSubmit={handleEntrySubmit}
            onCancel={() => goToStep(PDMStep.ENTRY)}
            disabled={state.status === ProcessingStatus.PROCESSING}
          />
        );
      case PDMStep.ENRICHMENT:
        return enrichmentResult ? (
          <EnrichmentResult
            result={enrichmentResult}
            onBack={() => goToStep(PDMStep.ENTRY)}
            onContinue={() => goToStep(PDMStep.FIELD_SELECTION)}
          />
        ) : null;
      case PDMStep.FIELD_SELECTION:
        return enrichmentResult ? (
          <FieldSelection
            enrichmentResult={enrichmentResult}
            onBack={() => goToStep(PDMStep.ENRICHMENT)}
            onContinue={handleFieldSelectionSubmit}
          />
        ) : null;
      case PDMStep.EQUIVALENCE_SEARCH:
        return equivalenceResult ? (
          <EquivalenceResults
            searchResult={equivalenceResult}
            onBack={() => goToStep(PDMStep.FIELD_SELECTION)}
            isLoading={state.status === ProcessingStatus.PROCESSING}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <Box className={className}>
      <Paper sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h5" sx={{ textAlign: "center", mb: 1 }}>
          Plataforma de Descrição de Materiais (PDM)
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mb: 4 }}
        >
          Siga as etapas para padronizar e encontrar equivalências.
        </Typography>
        <Stepper
          activeStep={STEPS.findIndex((s) => s.key === state.currentStep)}
          alternativeLabel
          sx={{ mb: 4 }}
        >
          {STEPS.map((step) => (
            <Step key={step.key}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>{renderStepContent()}</div>
      </Paper>
    </Box>
  );
}
