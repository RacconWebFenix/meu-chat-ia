import React from "react";
import { Box, TextField, IconButton, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import StopCircleIcon from "@mui/icons-material/StopCircle";

// A interface agora reflete exatamente o que o componente precisa para funcionar.
// Todas as lógicas complexas foram movidas para o componente pai.
interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  onSendMessage: () => void;
  loading: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  isRecording: boolean;
  onMicClick: () => void;
}

export default function MessageInput({
  input,
  setInput,
  onSendMessage,
  loading,
  inputRef,
  isRecording,
  onMicClick,
}: MessageInputProps) {
  // Lógica de UI para desabilitar o botão de envio de forma segura.
  // Garante que não haverá erro se 'input' for nulo ou indefinido.
  const isInputEmpty = !(input || "").trim();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Permite o envio com "Enter" e impede a quebra de linha.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading && !isInputEmpty) {
        onSendMessage();
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        p: 2,
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <TextField
        inputRef={inputRef}
        fullWidth
        variant="outlined"
        placeholder="Digite sua mensagem ou use o microfone..."
        value={input || ""} // Garante que o valor nunca seja nulo.
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading || isRecording}
        size="small"
        multiline
        maxRows={5}
      />
      <IconButton
        color="primary"
        onClick={onSendMessage}
        disabled={loading || isRecording || isInputEmpty}
      >
        {/* Mostra um ícone de loading diferente para o envio de texto vs. áudio */}
        {loading && !isRecording ? (
          <CircularProgress size={24} />
        ) : (
          <SendIcon />
        )}
      </IconButton>
      <IconButton
        color="primary"
        onClick={onMicClick}
        disabled={loading && !isRecording} // Não permite gravar áudio se uma mensagem de texto já estiver sendo enviada
      >
        {isRecording ? <StopCircleIcon color="error" /> : <MicIcon />}
      </IconButton>
    </Box>
  );
}
