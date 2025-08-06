// src/components/ChatbootQuery/MessageDisplay.tsx
import { useState } from "react";
import { AppMessage, SqlResultRow } from "@/types/api.types";
import { TableComponent } from "./TableComponent";
import ChartDisplay from "@/app/(app)/components/Chart/ChartDisplay";
import { Button, Box, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ProgressIndicator } from "./ProgressIndicator"; // Importe o novo componente

interface MessageDisplayProps {
  message: AppMessage;
}

export default function MessageDisplay({ message }: MessageDisplayProps) {
  const [isChartVisible, setIsChartVisible] = useState(false);

  if (message.role === "user") {
    return (
      <Box sx={{ display: "flex", justifyContent: "flex-end", my: 1 }}>
        <Typography
          sx={{
            p: 2,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            borderRadius: "10px 10px 0 10px",
          }}
        >
          {message.text}
        </Typography>
      </Box>
    );
  }

  const { chart, isChartLoading, text, progressStep } = message;

  const isChartPossible =
    chart?.chartType !== "table" &&
    chart?.chartData &&
    chart.chartData.length > 0;
  const isTable =
    chart?.rawData && chart.rawData.length > 0 && !isChartPossible;

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-start", my: 1 }}>
      <Box
        sx={{
          p: 2,
          bgcolor: "grey.200",
          borderRadius: "10px 10px 10px 0",
          width: "100%",
        }}
      >
        {/* --- LÓGICA DE RENDERIZAÇÃO ATUALIZADA --- */}
        {isChartLoading && typeof progressStep === "number" ? (
          <ProgressIndicator currentStep={progressStep} />
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        )}

        {isTable && chart && (
          <TableComponent data={chart.rawData as SqlResultRow[]} />
        )}

        {isChartPossible && !isChartVisible && (
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => setIsChartVisible(true)}
          >
            Gerar Gráfico
          </Button>
        )}

        {isChartPossible &&
          isChartVisible &&
          chart &&
          chart.chartType !== "table" &&
          chart.chartData && (
            <ChartDisplay data={chart.chartData} chartType={chart.chartType} />
          )}
      </Box>
    </Box>
  );
}
