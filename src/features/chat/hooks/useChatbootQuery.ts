// src/features/chat/hooks/useChatbootQuery.ts
import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  AnalysisPayload,
  AiChartPayload,
  AppMessage,
  MessageMetadata,
} from "@/types/api.types";

export function useChatbotQuery() {
  const [messages, setMessages] = useState<AppMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addMessage = (
    message: Omit<AppMessage, "messageId" | "isTranscription">
  ) => {
    const messageWithId: AppMessage = { ...message, messageId: uuidv4() };
    setMessages((prev) => [...prev, messageWithId]);
  };

  // Mensagem pode ser enviada diretamente como string ou vir do estado input
  const sendMessage = async (messageText?: string | React.MouseEvent) => {
    // Se for um evento de clique ou undefined, usamos o estado input
    // Se for uma string (ex: da transcrição), usamos essa string
    const textToSend = typeof messageText === "string" ? messageText : input;

    // Agora temos certeza de que textToSend é uma string, então .trim() é seguro.
    if (!textToSend.trim()) return;

    // Adiciona a mensagem do usuário à tela apenas se a chamada veio do input de texto
    // (e não de uma transcrição, que já é adicionada pela handleTranscription)
    if (typeof messageText !== "string") {
      addMessage({ role: "user", text: textToSend });
    }

    setLoading(true);
    setInput("");

    try {
      const response = await fetch("/api/chatbotquery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Erro na resposta da API.");
      }

      const analysisPayload =
        (await response.json()) as AnalysisPayload<MessageMetadata>;

      const botMessage: AppMessage = {
        messageId: uuidv4(),
        role: "bot",
        text: analysisPayload.summary,
        analysis: analysisPayload,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro desconhecido.";
      addMessage({
        role: "bot",
        text: `Desculpe, ocorreu um erro: ${errorMessage}`,
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const generateChart = async (messageId: string) => {
    const targetMessage = messages.find((m) => m.messageId === messageId);
    if (!targetMessage?.analysis) return;

    setMessages((prev) =>
      prev.map((m) =>
        m.messageId === messageId ? { ...m, isChartLoading: true } : m
      )
    );

    try {
      const { rawData, originalQuestion } = targetMessage.analysis;
      const response = await fetch("/api/generate-chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawData, originalQuestion }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Erro ao gerar gráfico.");
      }

      const chartPayload =
        (await response.json()) as AiChartPayload<MessageMetadata>;

      setMessages((prev) =>
        prev.map((m) =>
          m.messageId === messageId
            ? ({
                ...m,
                chart: chartPayload,
                isChartLoading: false,
              } as AppMessage)
            : m
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro desconhecido.";
      console.error("Failed to generate chart:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.messageId === messageId ? { ...m, isChartLoading: false } : m
        )
      );
      addMessage({
        role: "bot",
        text: `Não foi possível gerar o gráfico: ${errorMessage}`,
      });
    }
  };

  const handleTranscription = (transcription: string) => {
    if (!transcription) return;
    addMessage({
      role: "user",
      text: `Você disse: "${transcription}"`,
    });
    sendMessage(transcription);
  };

  return {
    messages,
    input,
    setInput,
    loading,
    inputRef,
    sendMessage,
    addMessage,
    handleTranscription,
    generateChart,
  };
}
