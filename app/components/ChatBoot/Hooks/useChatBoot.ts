import { useState } from "react";
import { API_BASE_URL } from "@/app/config/api";
import { getSiteName } from "@/app/Utils/utils";

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

export function useChatBoot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [linha, setLinha] = useState<"automotiva" | "industrial">("automotiva");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentFeedbackId, setCurrentFeedbackId] = useState<string | null>(
    null
  );
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);
  const [userInputHeaders, setUserInputHeaders] = useState<string[]>([]);
  const [userInputRow, setUserInputRow] = useState<(string | undefined)[]>([]);

  // Envia mensagem para a API
  const sendMessage = async () => {
    if (!prompt.replace(/(Nome:|Nome da Peça ou Componente:)/, "").trim())
      return;
    setLoading(true);
    setMessages([]);
    setCurrentFeedbackId(null);
    setFeedbackSent(false);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
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
            images: data.reply?.images || [],
            citations: citations,
          },
        ]);
        setCurrentFeedbackId(data.feedbackId);
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
    } catch {
      setMessages([
        {
          role: "bot",
          text: "Erro ao se comunicar com a IA. Tente novamente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Envia feedback para a API
  const sendFeedback = async (
    userRating: number | null,
    userComment: string,
    isPositive: boolean | null
  ) => {
    if (!currentFeedbackId || feedbackSent) return;

    try {
      const res = await fetch(`${API_BASE_URL}/feedbacks`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedbackId: currentFeedbackId,
          rating: userRating,
          comment: userComment,
          userFeedback: isPositive ? "positivo" : "negativo",
        }),
      });

      if (res.ok) {
        alert("Feedback enviado com sucesso!");
        setFeedbackSent(true);
      } else {
        alert("Falha ao enviar feedback.");
      }
    } catch {
      alert("Erro ao enviar feedback.");
    }
  };

  // Manipula envio do formulário
  const handleSend = (
    prompt: string,
    headers: string[],
    row: (string | undefined)[]
  ) => {
    setPrompt(prompt);
    setUserInputHeaders(headers);
    setUserInputRow(row);
    sendMessage();
  };

  return {
    messages,
    setMessages,
    linha,
    setLinha,
    prompt,
    setPrompt,
    loading,
    currentFeedbackId,
    feedbackSent,
    userInputHeaders,
    setUserInputHeaders,
    userInputRow,
    setUserInputRow,
    sendMessage,
    sendFeedback,
    handleSend,
  };
}
