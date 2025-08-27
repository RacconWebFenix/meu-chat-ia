/**
 * PDMFlow - Orquestrador das etapas do fluxo PDM.
 * Corrigido para lidar com os dados editados pelo usuário na etapa de FieldSelection.
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
  EnrichedProductData, // Importamos o tipo que vamos receber
  EquivalenceSearchResponse,
} from "../types";
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
  { key: PDMStep.ENRICHMENT, label: "Resultado do Enriquecimento" },
  { key: PDMStep.FIELD_SELECTION, label: "Revisão e Ajuste" },
  { key: PDMStep.EQUIVALENCE_SEARCH, label: "Resultados da Equivalência" },
];

export default function PDMFlow({ className }: PDMFlowProps) {
  const { state, goToStep, setStatus, setError } = usePDMFlow();
  const [enrichmentResult, setEnrichmentResult] =
    React.useState<EnrichmentResponse | null>(null);
  const [equivalenceResult, setEquivalenceResult] =
    React.useState<EquivalenceSearchResponse | null>(null);

  const enrichmentService = createEnrichmentService();
  const equivalenceService = new MockEquivalenceService();

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

  // --- CORREÇÃO PRINCIPAL AQUI ---
  // A função agora aceita o objeto 'EnrichedProductData' completo e editado.
  const handleFieldSelectionContinue = async (
    modifiedEnrichedData: EnrichedProductData
  ) => {
    // Criamos uma nova versão do resultado do enriquecimento com os dados modificados pelo usuário.
    const finalEnrichmentResult: EnrichmentResponse = {
      ...enrichmentResult!,
      enriched: modifiedEnrichedData,
    };

    // Atualizamos o estado para refletir as edições do usuário.
    setEnrichmentResult(finalEnrichmentResult);

    try {
      setStatus(ProcessingStatus.PROCESSING);
      goToStep(PDMStep.EQUIVALENCE_SEARCH);

      const searchCriteria = MockEquivalenceService.createSearchCriteria(
        finalEnrichmentResult,
        {
          categoria: true,
          subcategoria: true,
          especificacoesTecnicas: Array.isArray(
            modifiedEnrichedData.especificacoesTecnicas
          )
            ? modifiedEnrichedData.especificacoesTecnicas.map(
                (spec: { key: string }) => spec.key
              )
            : Object.keys(modifiedEnrichedData.especificacoesTecnicas),
          aplicacao: true,
          normas: true,
        }
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
            onContinue={handleFieldSelectionContinue}
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
