import { useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

import MessageSkeleton from "./MessageSkeleton/MessageSkeleton";
// import iaResponseMock from "../mocks/iaResponse.mock";

export interface Citation {
  url: string;
  siteName: string;
}

export interface Image {
  image_url: string;
}

export interface Message {
  role: "user" | "bot";
  text: string;
  images?: Image[];
  citations?: Citation[];
}

export default function ChatBoot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [descricao, setDescricao] = useState("");
  const [referencia, setReferencia] = useState("");
  const [fabricante, setFabricante] = useState("");
  const [loading, setLoading] = useState(false);

  function getSiteName(url: string) {
    try {
      const { hostname } = new URL(url);
      return hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  }

  const sendMessage = async () => {
    if (!descricao.trim() && !referencia.trim() && !fabricante.trim()) return;
    setLoading(true);
    setMessages([]);

    // Simula delay de requisição (opcional, pode remover se quiser)
    // await new Promise((resolve) => setTimeout(resolve, 800));

    // Faz a requisição real para a API
    try {
      const texto = `Referência: ${referencia}\nDescrição: ${descricao}\nFabricante: ${fabricante}`;
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: texto }),
      });

      const data = await response.json();

      const citations = (data.reply.citations || []).map((url: string) => ({
        url,
        siteName: getSiteName(url),
      }));

      setMessages([
        {
          role: "bot",
          text: data.reply.text.content,
          images: data.reply.images || [],
          citations,
        },
      ]);
    } catch {
      setMessages([
        {
          role: "bot",
          text: "Erro ao se comunicar com a IA.",
        },
      ]);
    } finally {
      setDescricao("");
      setReferencia("");
      setFabricante("");
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "2rem auto", padding: "0 1rem" }}>
      <MessageList messages={messages} />
      {loading && <MessageSkeleton />}
      <MessageInput
        descricao={descricao}
        setDescricao={setDescricao}
        referencia={referencia}
        setReferencia={setReferencia}
        fabricante={fabricante}
        setFabricante={setFabricante}
        onSend={sendMessage}
        disabled={loading}
      />
    </div>
  );
}
