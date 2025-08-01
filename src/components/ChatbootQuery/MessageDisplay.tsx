// src/components/ChatbootQuery/MessageDisplay.tsx
import { AppMessage, SqlResultRow } from "@/types/api.types"; // Importe SqlResultRow
import { BotResponseRenderer } from "./BotResponseRenderer";
import { TableComponent } from "./TableComponent";
import { Button, CircularProgress, Box, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageDisplayProps {
  message: AppMessage;
  onGenerateChart: (messageId: string) => void;
}

export default function MessageDisplay({
  message,
  onGenerateChart,
}: MessageDisplayProps) {
  if (message.role === "user") {
    // ... (código do usuário permanece o mesmo)
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

  const { analysis, chart, isChartLoading, messageId, text } = message;

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
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>

        {/* A CORREÇÃO ESTÁ AQUI */}
        {analysis?.rawData && analysis.rawData.length > 0 && (
          <TableComponent
            // Fazemos a asserção de tipo aqui para garantir a compatibilidade
            data={analysis.rawData as SqlResultRow[]}
          />
        )}

        {analysis?.isChartable && !chart && !isChartLoading && (
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => onGenerateChart(messageId)}
          >
            Gerar Gráfico
          </Button>
        )}

        {isChartLoading && <CircularProgress size={24} sx={{ mt: 2 }} />}

        {chart && <BotResponseRenderer payload={chart} />}
      </Box>
    </Box>
  );
}
