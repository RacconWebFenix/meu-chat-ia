/**
 * PDMFlow main component following SOLID principles
 *
 * Single Responsibility: Orchestrate PDM flow
 * Open/Closed: Extensible without modification via step components
 * Liskov Substitution: Can replace any other flow component
 * Interface Segregation: Uses specific, small interfaces
 * Dependency Inversion: Depends on abstractions (hooks), not concretions
 */

import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { usePDMFlow } from "../hooks";
import { PDMStep, ProcessingStatus, BaseProductInfo } from "../types";
import EntryForm from "./EntryForm";

interface PDMFlowProps {
  readonly className?: string;
}

/**
 * Main PDM Flow component
 * Following Single Responsibility Principle: Only orchestrates the flow
 */
export default function PDMFlow({ className }: PDMFlowProps) {
  const { state, goToStep, setStatus } = usePDMFlow();

  // Handle form submission following Dependency Inversion
  const handleEntrySubmit = async (data: BaseProductInfo) => {
    console.log('Dados submetidos:', data);
    setStatus(ProcessingStatus.PROCESSING);
    
    // Simular delay de processamento
    setTimeout(() => {
      goToStep(PDMStep.ENRICHMENT);
      setStatus(ProcessingStatus.COMPLETED);
    }, 1000);
  };

  // Handle form cancellation
  const handleEntryCancel = () => {
    goToStep(PDMStep.ENTRY);
    setStatus(ProcessingStatus.IDLE);
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
        return (
          <Typography variant="h6" color="primary" sx={{ textAlign: 'center', py: 4 }}>
            🤖 Etapa: Enriquecimento via IA
            <br />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Processando dados e buscando informações técnicas...
            </Typography>
          </Typography>
        );
      
      case PDMStep.FIELD_SELECTION:
        return (
          <Typography variant="h6" color="primary" sx={{ textAlign: 'center', py: 4 }}>
            ☑️ Etapa: Seleção de Campos
          </Typography>
        );
      
      case PDMStep.EQUIVALENCE_SEARCH:
        return (
          <Typography variant="h6" color="primary" sx={{ textAlign: 'center', py: 4 }}>
            🔍 Etapa: Busca de Equivalências
          </Typography>
        );
      
      case PDMStep.EXPORT:
        return (
          <Typography variant="h6" color="primary" sx={{ textAlign: 'center', py: 4 }}>
            📥 Etapa: Exportação
          </Typography>
        );
      
      default:
        return (
          <Typography variant="h6" color="error" sx={{ textAlign: 'center', py: 4 }}>
            Etapa desconhecida
          </Typography>
        );
    }
  };  return (
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
        
        {renderStepContent()}        <Typography
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
