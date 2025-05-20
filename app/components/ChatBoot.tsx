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
  const [descricao, setDescricao] = useState("");
  const [referencia, setReferencia] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!descricao.trim() && !referencia.trim()) return;
    setLoading(true);
    setMessages([]);

    // Monta o texto único para enviar
    const texto = `Referência: ${referencia}\nDescrição: ${descricao}`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: texto }),
      });

      const data = await response.json();

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
      setDescricao("");
      setReferencia("");
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "2rem auto", padding: "0 1rem" }}>

      <MessageList messages={messages} />

      {loading && <LoadingIndicator />}
      <MessageInput
        descricao={descricao}
        setDescricao={setDescricao}
        referencia={referencia}
        setReferencia={setReferencia}
        onSend={sendMessage}
        disabled={loading}
      />
    </div>
  );
}
