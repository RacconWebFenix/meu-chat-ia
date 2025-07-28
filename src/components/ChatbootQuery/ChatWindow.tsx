// src/components/NewChatbot/ChatWindow.tsx
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
  const {
    messages,
    input,
    setInput,
    loading,
    inputRef,
    sendMessage,
    addMessage,
    handleTranscription,
  } = useChatbotQuery();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Este callback é chamado quando a transcrição (e SOMENTE a transcrição) está pronta
  const handleTranscriptionComplete = useCallback(
    (transcription: string | null) => {
      console.log(
        "[Componente ChatWindow] Transcrição recebida pelo callback:",
        transcription
      );
      if (transcription) {
        // A função do hook de chat cuida de mostrar a transcrição e chamar a API principal
        handleTranscription(transcription);
      } else {
        addMessage({
          role: "bot",
          text: "Desculpe, não consegui entender o áudio. Por favor, tente novamente.",
        });
      }
    },
    [handleTranscription, addMessage]
  );

  // O hook de áudio agora só precisa do callback de transcrição
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
          <MessageDisplay key={index} message={msg} />
        ))}
        {(loading || isSending) && ( // Mostra o status de "Digitando..." ou "Enviando..."
          <Box sx={{ alignSelf: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {isSending ? "Processando áudio..." : "Digitando..."}
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* 5. Passe as novas props para o MessageInput */}
      <MessageInput
        input={input}
        setInput={setInput}
        onSendMessage={sendMessage}
        loading={loading || isSending} // O loading agora considera o envio do áudio
        inputRef={inputRef}
        isRecording={isRecording}
        onMicClick={handleMicClick}
      />
    </Box>
  );
}
