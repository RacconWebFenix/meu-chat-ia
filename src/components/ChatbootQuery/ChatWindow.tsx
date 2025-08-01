// src/components/ChatbootQuery/ChatWindow.tsx
"use client";
import React, { useCallback, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import MessageDisplay from "./MessageDisplay";
import MessageInput from "./MessageInput";
import { useChatbotQuery } from "@/features/chat/hooks/useChatbootQuery";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";

interface ChatWindowProps {
  onClose?: () => void;
}

export default function ChatWindow({ onClose }: ChatWindowProps) {
  // CORREÇÃO 1: Pegamos a função 'generateChart' que estava faltando do hook.
  const {
    messages,
    input,
    setInput,
    loading,
    inputRef,
    sendMessage,
    addMessage,
    handleTranscription,
    generateChart,
  } = useChatbotQuery();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleTranscriptionComplete = useCallback(
    (transcription: string | null) => {
      if (transcription) {
        handleTranscription(transcription);
      } else {
        addMessage({
          role: "bot",
          text: "Desculpe, não consegui entender o áudio. Por favor, tente novamente.",
        });
      }
    },
    [handleTranscription, addMessage] // useCallback dependencies
  );

  const { isRecording, isSending, startRecording, stopRecording } =
    useAudioRecorder(handleTranscriptionComplete);

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
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
        <Typography variant="h6">CIB2B - Agente de Relatórios</Typography>
        {onClose && (
          <Typography
            onClick={onClose}
            sx={{ cursor: "pointer", fontSize: "1.5rem" }}
          >
            &times;
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
          // CORREÇÃO 2: Passamos a função para o MessageDisplay através da prop 'onGenerateChart'.
          <MessageDisplay
            key={msg.messageId || index}
            message={msg}
            onGenerateChart={generateChart} // <<<<<<<<<<<<<<<<<<<< ADICIONADO AQUI
          />
        ))}
        {(loading || isSending) && (
          <Box sx={{ alignSelf: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {isSending ? "Processando áudio..." : "Digitando..."}
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <MessageInput
        input={input}
        setInput={setInput}
        onSendMessage={sendMessage}
        loading={loading || isSending}
        inputRef={inputRef}
        isRecording={isRecording}
        onMicClick={handleMicClick}
      />
    </Box>
  );
}
