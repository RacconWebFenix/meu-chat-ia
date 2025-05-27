// components/ChatBoot.tsx
import { useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./MessageSkeleton/MessageSkeleton";
import FeedbackForm from "./FeedbackForm/FeedbackForm";
// import iaResponseMock from "../mocks/iaResponse.mock"; // Remova ou comente esta linha para usar a API real

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
  // Novo estado para o ID do feedback da resposta atual
  const [currentFeedbackId, setCurrentFeedbackId] = useState<string | null>(
    null
  );
  // Novo estado para controlar se o feedback já foi enviado para a resposta atual
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);

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
    setMessages([]); // Limpa as mensagens anteriores
    setCurrentFeedbackId(null); // Reseta o ID do feedback
    setFeedbackSent(false); // Reseta o estado do feedback enviado

    const userPrompt = `Referência: ${referencia}\nDescrição: ${descricao}\nFabricante: ${fabricante}`;

 // Log para depuração
    try {
      const response = await fetch("/api/chat", {
        // Sua rota de API /api/chat
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userPrompt }),
      });

      const data = await response.json();

      if (response.ok) {
        const citations = (data.reply.citations || []).map((url: string) => ({
          url,
          siteName: getSiteName(url),
        }));

        setMessages([
          {
            role: "bot",
            text: data.reply?.text.content,
            images: data.reply?.images || [], // Se houver imagens na resposta
            citations: citations,
          },
        ]);
        setCurrentFeedbackId(data.feedbackId); // Salva o feedbackId recebido da API
      } else {
        setMessages([
          {
            role: "bot",
            text: `Erro ao se comunicar com a IA: ${
              data.error || "Erro desconhecido"
            }`,
          },
        ]);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setMessages([
        {
          role: "bot",
          text: "Erro ao se comunicar com a IA. Tente novamente.",
        },
      ]);
    } finally {
      setDescricao("");
      setReferencia("");
      setFabricante("");
      setLoading(false);
    }
  };

  // Função para lidar com o envio do feedback
  const handleSendFeedback = async (
    userRating: number | null,
    userComment: string,
    isPositive: boolean | null // Este booleano indica se o feedback geral foi positivo (true) ou negativo (false), pode ser null se não selecionado
  ) => {
    if (!currentFeedbackId || feedbackSent) return;

    try {
      const res = await fetch("/api/feedback", {
        // Sua rota de API /api/feedback
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedbackId: currentFeedbackId,
          rating: userRating,
          comment: userComment,
          userFeedback: isPositive ? "positivo" : "negativo", // 'positivo' ou 'negativo'
        }),
      });

      if (res.ok) {
        alert("Feedback enviado com sucesso!");
        setFeedbackSent(true); // Marca que o feedback foi enviado para esta interação
      } else {
        alert("Falha ao enviar feedback.");
      }
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      alert("Erro ao enviar feedback.");
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "2rem auto", padding: "0 1rem" }}>
      <MessageList messages={messages} />
      {loading && <MessageSkeleton />}

      {/* Condicional para exibir o formulário de feedback */}
      {currentFeedbackId && !feedbackSent && messages.length > 0 && (
        <FeedbackForm onSendFeedback={handleSendFeedback} />
      )}

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
