// src/components/NewChatbot/ChatWindow.tsx
"use client";
import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import MessageDisplay from "./MessageDisplay";
import MessageInput from "./MessageInput";
import { useChatbotQuery } from "@/features/chat/hooks/useChatbootQuery";
// Novo hook

interface ChatWindowProps {
  onClose?: () => void; // Para permitir fechar a janela
}

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const { messages, input, setInput, loading, inputRef, sendMessage } =
    useChatbotQuery();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%", // Ocupa a altura total do Drawer/Modal
        maxHeight: "100%",

      }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Seu Novo Chatbot</Typography>
        {onClose && (
          <Typography
            onClick={onClose}
            sx={{ cursor: "pointer", fontSize: "1.5rem" }}
          >
            &times; {/* Botão de fechar simples */}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {messages.map((msg, index) => (
          <MessageDisplay key={index} message={msg} />
        ))}
        {loading && (
          <Box sx={{ alignSelf: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Digitando...
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <MessageInput
        input={input}
        setInput={setInput}
        onSendMessage={sendMessage}
        loading={loading}
        inputRef={inputRef}
      />
    </Box>
  );
}
