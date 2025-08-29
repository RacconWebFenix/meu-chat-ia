/**
 * PDMFlow - Orquestrador das etapas do fluxo PDM.
 * Layout flexível sem scroll próprio - Updated: 2025-08-28
 */
import React from "react";
import { Box, Stepper, Step, StepLabel, Typography } from "@mui/material";
import { usePDMFlow } from "../hooks";
import {
  PDMStep,
  ProcessingStatus,
  BaseProductInfo,
  EnrichmentResponse,
  EnrichedProductData,
  N8NEquivalenceResponse,
  EquivalenceSearchPayload,
} from "../types";
import { createEnrichmentService, createN8NService } from "../services";
import EntryForm from "./EntryForm";
import FieldSelection from "./FieldSelection";
import N8NEquivalenceResults from "./N8NEquivalenceResults";
import { useLayout } from "@/contexts/LayoutContext";

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
  const { currentLayout } = useLayout();
  const [enrichmentResult, setEnrichmentResult] =
    React.useState<EnrichmentResponse | null>(null);
  const [n8nResult, setN8nResult] =
    React.useState<N8NEquivalenceResponse | null>(null);

  const enrichmentService = createEnrichmentService();
  const n8nService = createN8NService();

  // Removido: Listener para reset de estados quando layout muda
  // Agora os dados permanecem na mesma etapa ao trocar de layout

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
      console.log("PDMFlow - handleFieldSelectionContinue - INICIANDO BUSCA");
      setStatus(ProcessingStatus.PROCESSING);
      console.log(
        "PDMFlow - handleFieldSelectionContinue - STATUS SETADO PARA PROCESSING"
      );
      goToStep(PDMStep.EQUIVALENCE_SEARCH);
      console.log(
        "PDMFlow - handleFieldSelectionContinue - STEP MUDADO PARA EQUIVALENCE_SEARCH"
      );

      // Cria o objeto com dados estruturados completos para equivalências
      const productInfo: EquivalenceSearchPayload = {
        nome: modifiedEnrichedData.informacoes || "Produto sem nome",
        marcaFabricante:
          modifiedEnrichedData.marcaFabricante || "Não especificada",
        categoria: modifiedEnrichedData.categoria || "Não categorizada",
        subcategoria: modifiedEnrichedData.subcategoria || "",
        especificacoesTecnicas:
          modifiedEnrichedData.especificacoesTecnicas?.especificacoesTecnicas ||
          {},
        aplicacao:
          modifiedEnrichedData.aplicacao || "Aplicação não especificada",
        unidadeMedida: "unidade",
        breveDescricao: modifiedEnrichedData.informacoes || "Sem descrição",
        normas: modifiedEnrichedData.normas || [],
        imagens: (modifiedEnrichedData.imagens || []).map((img) => ({
          image_url: img.image_url,
          origin_url: img.origin_url || "",
          height: img.height || 0,
          width: img.width || 0,
        })),
      };

      console.log("Enviando dados estruturados para N8N:", productInfo);
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
        console.log("PDMFlow - EQUIVALENCE_SEARCH - n8nResult:", !!n8nResult);
        console.log("PDMFlow - EQUIVALENCE_SEARCH - status:", state.status);
        console.log(
          "PDMFlow - EQUIVALENCE_SEARCH - isLoading:",
          state.status === ProcessingStatus.PROCESSING
        );
        return (
          <N8NEquivalenceResults
            searchResult={
              n8nResult || {
                equivalencias: [],
                metadata: {
                  tempoProcessamento: 0,
                  modeloIAUsado: "",
                  criteriosBuscaAplicados: [],
                  observacoesGerais: "",
                  totalEquivalencias: 0,
                  fonteDados: "",
                  timestamp: new Date().toISOString(),
                  debug: {
                    totalCitations: 0,
                    totalSearchResults: 0,
                    totalImages: 0,
                  },
                },
                rawData: { citations: [], searchResults: [], images: [] },
              }
            }
            onBack={() => goToStep(PDMStep.FIELD_SELECTION)}
            isLoading={state.status === ProcessingStatus.PROCESSING}
            originalProduct={{
              nome:
                enrichmentResult?.original.informacoes || "Produto Original",
              especificacoesTecnicas:
                enrichmentResult?.enriched.especificacoesTecnicas || {},
              precoEstimado: undefined, // O produto original pode não ter preço definido
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      className={className}
      sx={{
        // Removido height e overflow para permitir scroll único
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Header - Rola junto com o conteúdo */}
      <Box
        sx={{
          textAlign: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.7rem",
            color: "text.secondary",
            mb: 1,
          }}
        >
          Siga as etapas para padronizar e encontrar equivalências.
        </Typography>

        {/* Stepper - Rola junto */}
        <Stepper
          activeStep={STEPS.findIndex((s) => s.key === state.currentStep)}
          alternativeLabel
          sx={{
            mb: 2,
            "& .MuiStepLabel-label": {
              fontSize: "0.65rem",
              mt: 0.5,
            },
            "& .MuiStepIcon-root": {
              fontSize: "1.2rem",
            },
          }}
        >
          {STEPS.map((step) => (
            <Step key={step.key}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Conteúdo Principal - Sem limitação de altura */}
      {renderStepContent()}
    </Box>
  );
}
