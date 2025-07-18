import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Box, Button, CircularProgress, Alert } from "@mui/material";

import ChartDisplay from "@/app/(app)/components/Chart/ChartDisplay";
import { Message } from "@/features/chat/types";
import { ApiChartType, DisplayChartData } from "@/types";

// Função auxiliar para formatar os dados para o componente de gráfico
function formatChartDataForDisplay(chartJson: {
  type: ApiChartType;
  data: { labels: string[]; datasets: { data: number[] }[] };
}): DisplayChartData[] {
  const labels = chartJson.data.labels || [];

  const dataPoints = chartJson.data.datasets?.[0]?.data ?? [];

  return labels.map((label: string, index: number) => ({
    group: label,
    value: dataPoints[index] ?? 0,
  }));
}

interface MessageDisplayProps {
  message: Message;
}

export default function MessageDisplay({
  message: initialMessage,
}: MessageDisplayProps) {
  // Estado local para gerenciar a mensagem, incluindo os dados do gráfico após a chamada
  const [message, setMessage] = useState(initialMessage);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);

  const handleGenerateChart = async () => {
    if (!message.chartPayload) return;

    setIsLoadingChart(true);
    setChartError(null);
    try {
      // Chama o nosso NOVO endpoint, enviando apenas o payload
      const response = await fetch("/api/generate-chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: message.chartPayload }),
      });

      const chartJson = await response.json();

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Falha ao gerar os dados do gráfico."
        );
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Falha ao gerar os dados do gráfico."
        );
      }

      
      // Atualiza o estado da MENSAGEM específica para incluir os dados do gráfico formatados
      setMessage((prev) => ({
        ...prev,
        chartData: formatChartDataForDisplay(JSON.parse(chartJson.output)),
        chartType: JSON.parse(chartJson.output).type,
        canGenerateChart: false, // Oculta o botão após a geração bem-sucedida
      }));
    } catch (error) {
      console.error("Erro ao gerar gráfico:", error);
      setChartError(
        error instanceof Error ? error.message : "Ocorreu um erro."
      );
    } finally {
      setIsLoadingChart(false);
    }
  };

  const isUser = message.role === "user";

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
      {/* 1. Renderiza o texto principal da mensagem */}
      <ReactMarkdown>{message.text}</ReactMarkdown>

      {/* 2. Lógica de renderização do botão e do gráfico */}
      {message.canGenerateChart &&
        Array.isArray(message.chartPayload) &&
        message.chartPayload.length > 0 &&
        !isLoadingChart && (
          <Button
            variant="contained"
            onClick={handleGenerateChart}
            sx={{ mt: 2 }}
          >
            Gerar Gráfico
          </Button>
        )}

      {isLoadingChart && (
        <CircularProgress size={24} sx={{ mt: 2, display: "block" }} />
      )}

      {chartError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {chartError}
        </Alert>
      )}

      {message.chartData && message.chartType && (
        <Box mt={2} sx={{ height: 450, width: "100%" }}>
          <ChartDisplay
            data={message.chartData}
            chartType={message.chartType}
            loading={false}
          />
        </Box>
      )}
    </Box>
  );
}
