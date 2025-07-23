// src/components/NewChatbot/ChatWindow.tsx
"use client";
import React, { useCallback, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import MessageDisplay from "./MessageDisplay";
import MessageInput from "./MessageInput";
import { useChatbotQuery } from "@/features/chat/hooks/useChatbootQuery";
import { useAudioRecorder } from "@/hooks/useAudioRecorder"; // 1. Importe o hook de áudio
import { N8nFinalResponse } from "@/types";

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
  } = useChatbotQuery();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleTranscriptionComplete = useCallback(
    (transcriptionResult: N8nFinalResponse[] | null) => {
      if (!transcriptionResult || transcriptionResult.length === 0) {
        console.error(
          "A transcrição falhou ou a resposta da API estava vazia."
        );
        return;
      }

      transcriptionResult.forEach((res) => {
        let resultText = "";
        const textField = res.text;
        if (
          textField &&
          typeof textField === "object" &&
          "json" in textField &&
          textField.json &&
          typeof textField.json.text === "string"
        ) {
          resultText = textField.json.text;
        } else if (typeof textField === "string") {
          resultText = textField;
        }

        if (resultText) {
          // Adiciona como mensagem do assistente no chat
          if (typeof addMessage === "function") {
            addMessage({
              role: "bot",
              text: resultText,
              chartPayload: res.chartPayload,
              canGenerateChart: res.canGenerateChart === "true",
            });
          }
        } else {
          console.error(
            "O texto da transcrição não pôde ser extraído da resposta da API."
          );
        }
      });
    },
    [addMessage]
  );

  // 3. Instancie o hook de gravação de áudio, passando o callback
  const { isRecording, isSending, startRecording, stopRecording } =
    useAudioRecorder(handleTranscriptionComplete);

  // 4. Crie a função que será chamada ao clicar no microfone
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
