import React, { useState } from "react";
import { Box, Button, ButtonGroup, Paper, Typography } from "@mui/material";
import {
  AutoAwesome as AIIcon,
  Engineering as PDMIcon,
} from "@mui/icons-material";
import ChatPDMView from "./ChatPDMView/ChatPDMView";
import { useChatPDM } from "@/features/chat/hooks";
import { PDMFlow } from "@/features/pdm/components";

type PDMMode = "chat" | "flow";

export default function ChatPDM() {
  const [mode, setMode] = useState<PDMMode>("flow");
  const chat = useChatPDM();

  return (
    // CORREÇÃO: Adicionado um container principal com largura máxima e centralização.
    // Todos os filhos deste Box ficarão alinhados dentro deste limite.
    <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
      {/* Mode Selector */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Modo de Pesquisa PDM
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Escolha como deseja realizar sua pesquisa de materiais
        </Typography>

        <ButtonGroup variant="outlined" fullWidth>
          <Button
            variant={mode === "flow" ? "contained" : "outlined"}
            onClick={() => setMode("flow")}
            startIcon={<PDMIcon />}
            sx={{ flex: 1 }}
          >
            PDM Flow (Recomendado)
          </Button>
          <Button
            variant={mode === "chat" ? "contained" : "outlined"}
            onClick={() => setMode("chat")}
            startIcon={<AIIcon />}
            sx={{ flex: 1 }}
          >
            Chat IA
          </Button>
        </ButtonGroup>

        <Box sx={{ mt: 2 }}>
          {mode === "flow" ? (
            <Typography variant="body2" color="text.primary">
              🚀 <strong>PDM Flow:</strong> Interface guiada passo-a-passo com
              enriquecimento de dados, busca de equivalências, filtros avançados
              e exportação profissional.
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              💬 <strong>Chat IA:</strong> Conversação livre com inteligência
              artificial sobre materiais e PDM.
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Content based on mode */}
      {mode === "flow" ? <PDMFlow /> : <ChatPDMView {...chat} />}
    </Box>
  );
}
