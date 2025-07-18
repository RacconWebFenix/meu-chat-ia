import { useState } from "react";
import { getSiteName } from "@/Utils/utils";
import iaResponseMock from "@/mocks/iaResponse.mock";
import { Message } from "@/types/api.types";

const USE_MOCK = false; // Altere para false para usar a API real

export function useChatBoot() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentFeedbackId, setCurrentFeedbackId] = useState<string | null>(
    null
  );
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);
  const [userInputHeaders, setUserInputHeaders] = useState<string[]>([]);
  const [userInputRow, setUserInputRow] = useState<string[]>([]);

  // Envia mensagem para a API ou usa mock
  const sendMessage = async (promptToSend?: string) => {
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
        const response = await fetch("/api/sonar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(promptToSend),
        });

        const data = await response.json();

        if (response.ok) {
          // Processa os dados do Sonar
          let messageContent = "";
          let citations = [];
          let images = [];

          try {
            // A resposta vem como array com objetos da API Sonar
            if (Array.isArray(data.reply) && data.reply.length > 0) {
              const sonarResponse = data.reply[0];

              // Extrai o conteúdo da mensagem
              messageContent =
                sonarResponse?.choices?.[0]?.message?.content || "";

              // Extrai as citações
              citations = sonarResponse?.citations || [];

              // Extrai as imagens
              images = sonarResponse?.images || [];
            }
            // Fallbacks para outros formatos
            else if (data.reply) {
              // Se reply é uma string, usa diretamente
              if (typeof data.reply === "string") {
                messageContent = data.reply;
              }
              // Se reply é um objeto, extrai o conteúdo
              else if (data.reply.content) {
                messageContent = data.reply.content;
              }
              // Se reply tem estrutura de choices (formato OpenAI)
              else if (data.reply.choices && data.reply.choices[0]) {
                messageContent = data.reply.choices[0].message?.content || "";
                citations = data.reply.citations || [];
                images = data.reply.images || [];
              }
              // Fallback: converte para string
              else {
                messageContent = JSON.stringify(data.reply);
              }
            } else {
              messageContent = "Resposta vazia recebida";
            }
          } catch (error) {
            console.error("Erro ao processar dados do Sonar:", error);
            messageContent = "Erro ao processar resposta";
          }

          const processedCitations = citations.map((url: string) => ({
            url,
            siteName: getSiteName(url),
          }));

          setMessages([
            {
              role: "bot",
              text: messageContent || "Resposta vazia",
              images: images || [],
              citations: processedCitations,
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
    userComment: string
  ) => {
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
          alert("Feedback atualizado com sucesso!");
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
  const handleSend = (prompt: string, headers: string[], row: string[]) => {
    setPrompt(prompt);
    setUserInputHeaders(headers);
    setUserInputRow(row);
    sendMessage(prompt);
  };

  return {
    messages,
    setMessages,
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
