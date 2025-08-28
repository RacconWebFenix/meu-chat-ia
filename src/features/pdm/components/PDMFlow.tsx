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
  EnrichedProductData,
  N8NEquivalenceResponse,
} from "../types";
import { createEnrichmentService, createN8NService } from "../services";
import EntryForm from "./EntryForm";
import FieldSelection from "./FieldSelection";
import N8NEquivalenceResults from "./N8NEquivalenceResults";

interface PDMFlowProps {
  readonly className?: string;
}

const STEPS = [
  { key: PDMStep.ENTRY, label: "Entrada de Dados" },
  { key: PDMStep.FIELD_SELECTION, label: "Revisão e Ajuste" },
  { key: PDMStep.EQUIVALENCE_SEARCH, label: "Resultados da Equivalência" },
];

export default function PDMFlow({ className }: PDMFlowProps) {
  const { state, goToStep, setStatus, setError } = usePDMFlow();
  const [enrichmentResult, setEnrichmentResult] =
    React.useState<EnrichmentResponse | null>(null);
  const [n8nResult, setN8nResult] =
    React.useState<N8NEquivalenceResponse | null>(null);

  const enrichmentService = createEnrichmentService();
  const n8nService = createN8NService();

  const handleEntrySubmit = async (data: BaseProductInfo) => {
    try {
      setStatus(ProcessingStatus.PROCESSING);
      const result = await enrichmentService.enrichProduct({
        productInfo: data,
      });
      setEnrichmentResult(result);
      goToStep(PDMStep.FIELD_SELECTION);
      setStatus(ProcessingStatus.COMPLETED);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro desconhecido");
      setStatus(ProcessingStatus.ERROR);
    }
  };

  // A função agora usa o N8NService para buscar equivalências
  const handleFieldSelectionContinue = async (
    modifiedEnrichedData: EnrichedProductData
  ) => {
    // Verifica se enrichmentResult existe
    if (!enrichmentResult) {
      setError("Dados de enriquecimento não encontrados");
      setStatus(ProcessingStatus.ERROR);
      return;
    }

    // Cria uma nova versão do resultado do enriquecimento com os dados modificados pelo usuário.
    const finalEnrichmentResult: EnrichmentResponse = {
      ...enrichmentResult,
      enriched: modifiedEnrichedData,
    };

    // Atualizamos o estado para refletir as edições do usuário.
    setEnrichmentResult(finalEnrichmentResult);

    try {
      setStatus(ProcessingStatus.PROCESSING);
      goToStep(PDMStep.EQUIVALENCE_SEARCH);

      // Cria o objeto BaseProductInfo a partir dos dados originais e enriquecidos
      const productInfo: BaseProductInfo = {
        nome: enrichmentResult.original.nome || "Produto sem nome",
        referencia:
          enrichmentResult.original.referencia ||
          (modifiedEnrichedData.especificacoesTecnicas[
            "Referência"
          ] as string) ||
          (modifiedEnrichedData.especificacoesTecnicas["Código"] as string),
        marcaFabricante:
          modifiedEnrichedData.marcaFabricante ||
          enrichmentResult.original.marcaFabricante ||
          "Marca não informada",
        caracteristicas: Object.entries(
          modifiedEnrichedData.especificacoesTecnicas
        )
          .map(([key, value]) => `${key}: ${value}`)
          .join(", "),
        aplicacao:
          modifiedEnrichedData.aplicacao ||
          enrichmentResult.original.aplicacao ||
          "Aplicação não especificada",
        unidadeMedida:
          enrichmentResult.original.unidadeMedida ||
          (modifiedEnrichedData.especificacoesTecnicas["Unidade"] as string) ||
          "unidade",
        breveDescricao:
          enrichmentResult.original.breveDescricao ||
          `Produto da categoria ${
            modifiedEnrichedData.categoria || "não informada"
          }`,
      };

      console.log("Enviando para N8N:", productInfo);
      console.log("Dados originais:", enrichmentResult.original);
      console.log("Dados modificados:", modifiedEnrichedData);

      const result = await n8nService.searchEquivalents(productInfo);
      setN8nResult(result);
      setStatus(ProcessingStatus.COMPLETED);
    } catch (error) {
      console.error("Erro ao buscar equivalências no N8N:", error);
      setError(
        error instanceof Error ? error.message : "Erro ao buscar equivalências"
      );
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
      case PDMStep.FIELD_SELECTION:
        return enrichmentResult ? (
          <FieldSelection
            enrichmentResult={enrichmentResult}
            onBack={() => goToStep(PDMStep.ENTRY)}
            onContinue={handleFieldSelectionContinue}
          />
        ) : null;
      case PDMStep.EQUIVALENCE_SEARCH:
        return n8nResult ? (
          <N8NEquivalenceResults
            searchResult={n8nResult}
            onBack={() => goToStep(PDMStep.FIELD_SELECTION)}
            isLoading={state.status === ProcessingStatus.PROCESSING}
            originalProduct={{
              nome: enrichmentResult?.original.nome || "Produto Original",
              especificacoesTecnicas:
                enrichmentResult?.enriched.especificacoesTecnicas || {},
              precoEstimado: undefined, // O produto original pode não ter preço definido
            }}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <Box
      className={className}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header Ultra Compacto */}
      <Box
        sx={{
          p: 0.8,
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        {/* Stepper Horizontal Minimalista */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 0.4,
          }}
        >
          {STEPS.map((step, index) => {
            const isActive = step.key === state.currentStep;
            const isCompleted =
              STEPS.findIndex((s) => s.key === state.currentStep) > index;

            return (
              <React.Fragment key={step.key}>
                <Box
                  sx={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    bgcolor: isCompleted
                      ? "success.main"
                      : isActive
                      ? "primary.main"
                      : "grey.300",
                    color: isCompleted || isActive ? "white" : "grey.600",
                  }}
                >
                  {isCompleted ? "✓" : index + 1}
                </Box>
                {index < STEPS.length - 1 && (
                  <Box
                    sx={{
                      width: 14,
                      height: 1,
                      bgcolor: isCompleted ? "success.main" : "grey.300",
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </Box>
      </Box>

      {/* Conteúdo da Etapa - Ocupa todo espaço restante */}
      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          p: 0.4,
          minHeight: 0,
        }}
      >
        {renderStepContent()}
      </Box>
    </Box>
  );
}
