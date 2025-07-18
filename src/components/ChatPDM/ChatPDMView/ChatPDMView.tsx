import React from "react";
import ReactMarkdown from "react-markdown";
import { ChatLoading } from "../../shared";
import { CustomButton } from "../../shared";
import styles from "./ChatPDMView.module.scss";

interface ChatPDMViewProps {
  messages: { text: string; from: "user" | "bot" }[];
  input: string;
  setInput: (v: string) => void;
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  sendMessage: () => void;
}

export default function ChatPDMView({
  messages,
  input,
  setInput,
  loading,
  inputRef,
  sendMessage,
}: ChatPDMViewProps) {
  return (
    <div className={styles.chatContainer}>
      {(messages.some((msg) => msg.from === "bot") || loading) && (
        <div className={styles.iaResponseContainer}>
          {messages
            .filter((msg) => msg.from === "bot")
            .map((msg, idx) => (
              <div key={idx} className={styles.botMsg}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ))}
          {loading && <ChatLoading />}
        </div>
      )}
      <div className={styles.inputBox}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          placeholder="Digite o material a ser pesquisado..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />
        <CustomButton
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          colorType="primary"
          variant="contained"
          sx={{
            py: 1.5,
            px: 3,
            fontSize: 16,
            fontWeight: 700,
            background: (theme) => theme.palette.primary.main,
            color: (theme) => theme.palette.primary.contrastText,
            "&:hover": {
              background: (theme) => theme.palette.primary.dark,
            },
          }}
        >
          Enviar
        </CustomButton>
      </div>
    </div>
  );
}
