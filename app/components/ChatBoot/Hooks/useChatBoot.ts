import { useState } from "react";
import { getSiteName } from "@/app/Utils/utils";
import iaResponseMock from "@/app/mocks/iaResponse.mock";

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

const USE_MOCK = false; // Altere para false para usar a API real

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

  // Envia mensagem para a API ou usa mock
  const sendMessage = async () => {
    if (!prompt.replace(/(Nome:|Nome da Peça ou Componente:)/, "").trim())
      return;
    setLoading(true);
    setMessages([]);
    setCurrentFeedbackId(null);
    setFeedbackSent(false);

    try {
      if (USE_MOCK) {
        // --- MOCK IA RESPONSE ---
        await new Promise((resolve) => setTimeout(resolve, 500));
        const data = iaResponseMock;
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
        setCurrentFeedbackId("mock-feedback-id");
        // --- FIM MOCK ---
      } else {
        // --- CHAMADA REAL API ---
        const response = await fetch("/api/perplexity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
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

  // Envia feedback para a API ou usa mock
  const sendFeedback = async (
    userRating: number | null,
    userComment: string,
    isPositive: boolean | null
  ) => {
    console.log("Enviando feedback:", {
      userRating,
      userComment,
      isPositive,
      currentFeedbackId,
    });

    if (!currentFeedbackId || feedbackSent) return;

    try {
      if (USE_MOCK) {
        // --- MOCK FEEDBACK ---
        await new Promise((resolve) => setTimeout(resolve, 300));
        alert("Feedback (mock) enviado com sucesso!");
        setFeedbackSent(true);
        // --- FIM MOCK ---
      } else {
        // --- CHAMADA REAL FEEDBACK ---
        const res = await fetch(`/api/feedback`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: currentFeedbackId, // <-- use o id salvo
            rating: userRating,
            comment: userComment,
            status: "finalizado",
          }),
        });
        if (res.ok) {
          alert("Feedback enviado com sucesso!");
          setFeedbackSent(true);
        } else {
          alert("Falha ao enviar feedback.");
        }
        // --- FIM CHAMADA REAL ---
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
