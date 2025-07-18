// src/components/NewChatbot/MessageInput.tsx
import React from "react";
import { Box, TextField, IconButton, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  onSendMessage: () => void;
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>; // Permite passar uma referência para o input
}

export default function MessageInput({
  input,
  setInput,
  onSendMessage,
  loading,
  inputRef,
}: MessageInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading && input.trim()) {
      onSendMessage();
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
        placeholder="Digite sua mensagem..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        size="small"
      />
      <IconButton
        color="primary"
        onClick={onSendMessage}
        disabled={loading || !input.trim()}
      >
        {loading ? <CircularProgress size={24} /> : <SendIcon />}
      </IconButton>
    </Box>
  );
}
