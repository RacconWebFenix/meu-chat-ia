import { useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import LoadingIndicator from "./LoadingIndicator";


export interface Image {
  image_url: string;
}

export interface Message {
  role: "user" | "bot";
  text: string;
  images?: Image[];
}

export default function ChatBoot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    // Limpa as mensagens antes de enviar a nova
    setMessages([]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      // Adiciona apenas as mensagens vindas da API
      setMessages([
        {
          role: "bot",
          text: data.reply.text.content,
          images: data.reply.images || [],
        },
      ]);
    } catch {
      setMessages([
        { role: "bot", text: "Erro ao se comunicar com a IA." },
      ]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "2rem auto", padding: "0 1rem" }}>
      <MessageList messages={messages} />
      {loading && <LoadingIndicator />}
      <MessageInput
        input={input}
        setInput={setInput}
        onSend={sendMessage}
        disabled={loading}
      />
    </div>
  );
}
