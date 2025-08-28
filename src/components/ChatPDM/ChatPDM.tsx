// src/components/ChatPDM/ChatPDM.tsx
// Ultra-compact PDM selector - Last updated: 2025-08-28
import React, { useState } from "react";
import { Box, Button } from "@mui/material";
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
  
  console.log("ChatPDM component rendered - Ultra Compact Mode:", mode);

  return (
    <Box
      sx={{
        maxWidth: "1200px",
        mx: "auto",
        height: "calc(100vh - 100px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Seletor Super Compacto */}
      <Box 
        sx={{ 
          display: "flex", 
          gap: 0.5, 
          mb: 0.3, 
          flexShrink: 0,
        }}
      >
        <Button
          variant={mode === "flow" ? "contained" : "text"}
          onClick={() => setMode("flow")}
          size="small"
          sx={{
            flex: 1,
            fontSize: "0.6rem",
            py: 0.3,
            px: 0.8,
            minHeight: "24px",
            borderRadius: 1,
          }}
        >
          <PDMIcon sx={{ fontSize: "14px", mr: 0.3 }} />
          PDM
        </Button>
        <Button
          variant={mode === "chat" ? "contained" : "text"}
          onClick={() => setMode("chat")}
          size="small"
          sx={{
            flex: 1,
            fontSize: "0.6rem",
            py: 0.3,
            px: 0.8,
            minHeight: "24px",
            borderRadius: 1,
          }}
        >
          <AIIcon sx={{ fontSize: "14px", mr: 0.3 }} />
          Chat
        </Button>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
        {mode === "flow" ? <PDMFlow /> : <ChatPDMView {...chat} />}
      </Box>
    </Box>
  );
}
