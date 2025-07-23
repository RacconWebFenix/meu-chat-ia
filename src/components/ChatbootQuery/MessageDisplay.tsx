// src/components/ChatbootQuery/MessageDisplay.tsx

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Box, Button, CircularProgress, Alert } from "@mui/material";

import ChartDisplay from "@/app/(app)/components/Chart/ChartDisplay";
import { Message } from "@/features/chat/types";

// --- INTERFACES ALINHADAS COM A API E O GRÁFICO ---

// Formato da resposta que vem do n8n (via /api/generate-chart)
interface ApiChartResponse {
  type: "bar" | "line" | "pie";
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
    }[];
  };
}

// Formato que o nosso componente ChartDisplay espera
// A assinatura de índice [key: string] é a chave para permitir múltiplas linhas
interface DisplayChartData {
  group: string;
  [key: string]: string | number;
}

// --- NOVA FUNÇÃO DE TRANSFORMAÇÃO (A SOLUÇÃO) ---

/**
 * Transforma a resposta da API (formato labels/datasets) para o formato
 * que o componente ChartDisplay espera (formato de objeto pivotado).
 * Esta função garante que TODAS as linhas sejam processadas.
 */
function transformApiDataToChartData(
  apiData: ApiChartResponse
): DisplayChartData[] {
  const { labels, datasets } = apiData.data;

  // CENÁRIO 1: Gráfico de Barra ou Pizza (apenas 1 dataset)
  // Se houver apenas um conjunto de dados, formatamos como { group, value }
  if (datasets.length === 1) {
    const singleDataset = datasets[0];
    return labels.map((label, index) => ({
      group: label,
      value: singleDataset.data[index] ?? 0, // A chave 'value' que o Bar/Pie esperam
    }));
  }

  // CENÁRIO 2: Gráfico com Múltiplas Linhas (vários datasets)
  // Usa a sua lógica original de "pivotar" os dados, que está correta.
  const dataMap: Record<string, DisplayChartData> = {};
  labels.forEach((label, index) => {
    const dataPoint: DisplayChartData = { group: label };
    datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[index] ?? 0;
    });
    dataMap[label] = dataPoint;
  });

  return Object.values(dataMap);
}

interface MessageDisplayProps {
  message: Message;
}

export default function MessageDisplay({ message }: MessageDisplayProps) {
  const [chartData, setChartData] = useState<DisplayChartData[] | null>(null);
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("line");
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);
  const [isChartGenerated, setIsChartGenerated] = useState(false);

  const handleGenerateChart = async () => {
    if (!message.chartPayload || message.chartPayload.length === 0) {
      setChartError("O payload de dados para o gráfico está ausente.");
      return;
    }

    setIsChartLoading(true);
    setChartError(null);
    setChartData(null);

    try {
      // 1. CHAMA A API
      const response = await fetch("/api/generate-chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload: message.chartPayload,
          question: message.text,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "O servidor retornou um erro ao gerar o gráfico."
        );
      }

      // 2. PEGA O JSON JÁ TRATADO PELA API
      // A API agora retorna o objeto diretamente, não mais o array [{ output: ... }]
      const parsedApiData: ApiChartResponse = await response.json();

      // 3. USA A FUNÇÃO INTELIGENTE para transformar os dados para o formato do Recharts
      const finalChartData = transformApiDataToChartData(parsedApiData);

      // 4. ATUALIZA O ESTADO para renderizar o gráfico
      setChartData(finalChartData);
      setChartType(parsedApiData.type);
      setIsChartGenerated(true);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro desconhecido ao processar o gráfico.";
      console.error("Erro detalhado em handleGenerateChart:", errorMessage);
      setChartError(errorMessage);
    } finally {
      setIsChartLoading(false);
    }
  };

  const isUser = message.role === "user";
  const showGenerateChartButton =
    message.canGenerateChart &&
    !isChartGenerated &&
    Array.isArray(message.chartPayload) &&
    message.chartPayload.length > 0;

  // Garante que message.text seja sempre string
  let displayText: string = "";
  if (typeof message.text === "string") {
    displayText = message.text;
  } else if (
    message.text &&
    typeof message.text === "object" &&
    "text" in message.text
  ) {
    displayText = String(message.text.text ?? "");
  }

  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        borderRadius: 2,
        bgcolor: isUser ? "primary.light" : "background.paper",
        color: isUser ? "primary.contrastText" : "text.primary",
        alignSelf: isUser ? "flex-end" : "flex-start",
        maxWidth: "100%",
        minWidth: "100%",
        wordBreak: "break-word",
        boxShadow: 1,
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayText}</ReactMarkdown>

      {showGenerateChartButton && (
        <Box mt={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleGenerateChart}
            disabled={isChartLoading}
          >
            {isChartLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Gerar Gráfico"
            )}
          </Button>
        </Box>
      )}

      {chartError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {chartError}
        </Alert>
      )}

      {chartData && chartData.length > 0 && (
        <ChartDisplay
          data={chartData}
          chartType={chartType}
          loading={isChartLoading}
        />
      )}
    </Box>
  );
}
