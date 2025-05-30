import { useRef, useState } from "react";
import styles from "./CustomChat.module.scss";
import ChatLoading from "../ChatLoading/ChatLoading";
import ReactMarkdown from "react-markdown";

export default function CustomChat() {
  const [messages, setMessages] = useState<
    { text: string; from: "user" | "bot" }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([{ text: input, from: "user" }]);
    setLoading(true);
    setInput("");

    const url = process.env.NEXT_PUBLIC_API_URL + "/chatpdm";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      setMessages([
        { text: input, from: "user" },
        {
          text:
            data.candidates[0].content.parts[0].text ||
            "Erro ao obter resposta da IA.",
          from: "bot",
        },
      ]);
    } catch {
      setMessages([
        { text: input, from: "user" },
        { text: "Erro ao conectar com a IA.", from: "bot" },
      ]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

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
