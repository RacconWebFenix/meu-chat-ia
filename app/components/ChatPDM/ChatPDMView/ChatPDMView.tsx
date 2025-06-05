import React from "react";
import ReactMarkdown from "react-markdown";
import ChatLoading from "../../ChatLoading/ChatLoading";
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
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          Enviar
        </button>
      </div>
    </div>
  );
}
