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
import { PDMStep, ProcessingStatus } from "../types";

interface PDMFlowProps {
  readonly className?: string;
}

/**
 * Main PDM Flow component
 * Following Single Responsibility Principle: Only orchestrates the flow
 */
export default function PDMFlow({ className }: PDMFlowProps): JSX.Element {
  const { state } = usePDMFlow();

  // Render step indicator for development
  const renderStepIndicator = (): JSX.Element => (
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
  const renderStepContent = (): JSX.Element => {
    switch (state.currentStep) {
      case PDMStep.ENTRY:
        return (
          <Typography variant="h6" color="primary">
            📝 Etapa: Entrada de Dados
          </Typography>
        );

      case PDMStep.ENRICHMENT:
        return (
          <Typography variant="h6" color="primary">
            🤖 Etapa: Enriquecimento via IA
          </Typography>
        );

      case PDMStep.FIELD_SELECTION:
        return (
          <Typography variant="h6" color="primary">
            ☑️ Etapa: Seleção de Campos
          </Typography>
        );

      case PDMStep.EQUIVALENCE_SEARCH:
        return (
          <Typography variant="h6" color="primary">
            🔍 Etapa: Busca de Equivalências
          </Typography>
        );

      case PDMStep.EXPORT:
        return (
          <Typography variant="h6" color="primary">
            📥 Etapa: Exportação
          </Typography>
        );

      default:
        return (
          <Typography variant="h6" color="error">
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

        <Box sx={{ textAlign: "center", py: 4 }}>{renderStepContent()}</Box>

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
