/**
 * PDMFlow main component following SOLID principles
 *
 * Single Responsibility: Orchestrate PDM flow
 * Open/Closed: Extensible without modification via step components
 * Liskov Substitution: Can replace any other flow component
 * Interface Segregation: Uses specific, small interfaces
 * Dependency Inversion: Depends on abstractions (hooks), not concretions
 */

import React, { useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { usePDMFlow } from "../hooks";
import {
  PDMStep,
  ProcessingStatus,
  BaseProductInfo,
  EnrichmentResponse,
  SelectedFields,
} from "../types";
import { MockEnrichmentService } from "../services";
import EntryForm from "./EntryForm";
import EnrichmentResult from "./EnrichmentResult";
import FieldSelection from "./FieldSelection";

interface PDMFlowProps {
  readonly className?: string;
}

/**
 * Main PDM Flow component
 * Following Single Responsibility Principle: Only orchestrates the flow
 */
export default function PDMFlow({ className }: PDMFlowProps) {
  const { state, goToStep, setStatus, setError } = usePDMFlow();
  const [enrichmentResult, setEnrichmentResult] =
    useState<EnrichmentResponse | null>(null);
  const [selectedFields, setSelectedFields] = useState<SelectedFields | null>(
    null
  );

  // Initialize service following Dependency Inversion
  const enrichmentService = new MockEnrichmentService();

  // Handle form submission with actual enrichment
  const handleEntrySubmit = async (data: BaseProductInfo) => {
    try {
      setStatus(ProcessingStatus.PROCESSING);
      setError(null);

      // Call enrichment service
      const result = await enrichmentService.enrichProduct({
        productInfo: data,
      });

      // Store result and proceed
      setEnrichmentResult(result);
      goToStep(PDMStep.ENRICHMENT);
      setStatus(ProcessingStatus.COMPLETED);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro no enriquecimento";
      setError(errorMessage);
      setStatus(ProcessingStatus.ERROR);
    }
  };

  // Handle form cancellation
  const handleEntryCancel = () => {
    goToStep(PDMStep.ENTRY);
    setStatus(ProcessingStatus.IDLE);
    setEnrichmentResult(null);
    setSelectedFields(null);
    setError(null);
  };

  // Handle field selection submission
  const handleFieldSelectionSubmit = (fields: SelectedFields) => {
    setSelectedFields(fields);
    goToStep(PDMStep.EQUIVALENCE_SEARCH);
    setStatus(ProcessingStatus.PROCESSING);

    // TODO: Implement equivalence search in next step
    setTimeout(() => {
      setStatus(ProcessingStatus.COMPLETED);
    }, 2000);
  };

  // Handle field selection back
  const handleFieldSelectionBack = () => {
    goToStep(PDMStep.ENRICHMENT);
    setSelectedFields(null);
  };

  // Render step indicator for development
  const renderStepIndicator = () => (
    <Box sx={{ mb: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
      <Typography variant="body2" color="text.secondary">
        Etapa Atual: {state.currentStep}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Status: {state.status}
      </Typography>
      {state.error && (
        <Typography variant="body2" color="error">
          Erro: {state.error}
        </Typography>
      )}
    </Box>
  );

  // Render current step content
  const renderStepContent = () => {
    switch (state.currentStep) {
      case PDMStep.ENTRY:
        return (
          <EntryForm
            onSubmit={handleEntrySubmit}
            onCancel={handleEntryCancel}
            disabled={state.status === ProcessingStatus.PROCESSING}
          />
        );

      case PDMStep.ENRICHMENT:
        return enrichmentResult ? (
          <EnrichmentResult
            result={enrichmentResult}
            onBack={handleEntryCancel}
            onContinue={() => goToStep(PDMStep.FIELD_SELECTION)}
          />
        ) : (
          <Typography
            variant="h6"
            color="primary"
            sx={{ textAlign: "center", py: 4 }}
          >
            Processando enriquecimento...
          </Typography>
        );

      case PDMStep.FIELD_SELECTION:
        return enrichmentResult ? (
          <FieldSelection
            enrichmentResult={enrichmentResult}
            onBack={handleFieldSelectionBack}
            onContinue={handleFieldSelectionSubmit}
          />
        ) : (
          <Typography
            variant="h6"
            color="error"
            sx={{ textAlign: "center", py: 4 }}
          >
            ❌ Erro: Dados de enriquecimento não encontrados
          </Typography>
        );

      case PDMStep.EQUIVALENCE_SEARCH:
        return (
          <Typography
            variant="h6"
            color="primary"
            sx={{ textAlign: "center", py: 4 }}
          >
            🔍 Etapa: Busca de Equivalências
          </Typography>
        );

      case PDMStep.EXPORT:
        return (
          <Typography
            variant="h6"
            color="primary"
            sx={{ textAlign: "center", py: 4 }}
          >
            📥 Etapa: Exportação
          </Typography>
        );

      default:
        return (
          <Typography
            variant="h6"
            color="error"
            sx={{ textAlign: "center", py: 4 }}
          >
            Etapa desconhecida
          </Typography>
        );
    }
  };
  return (
    <Box className={className} sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
          PDM Flow - Sistema de Padrão de Descrição de Materiais
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: "center", mb: 3 }}
        >
          Em desenvolvimento - Arquitetura SOLID implementada
        </Typography>
        {renderStepIndicator()}
        {renderStepContent()}{" "}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mt: 3 }}
        >
          ✅ Estrutura base criada seguindo princípios SOLID
        </Typography>
      </Paper>
    </Box>
  );
}
