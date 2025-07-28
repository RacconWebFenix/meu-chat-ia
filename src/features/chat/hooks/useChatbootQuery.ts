import { useState, useRef } from "react";
import { Message } from "@/features/chat/types";

export function useChatbotQuery() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null); // Estado para a transcrição
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTranscription = (transcription: string) => {
    console.log(
      "[Hook useChatbotQuery] Função handleTranscription chamada com:",
      transcription
    );
    if (!transcription) return;

    // Etapa 1: Adiciona a mensagem de transcrição para o usuário ver
    const transcriptionMessage: Message = {
      text: `Você disse: "${transcription}"`,
      role: "user",
      isTranscription: true,
    };
    addMessage(transcriptionMessage);

    // Etapa 2: Envia a transcrição para o backend para obter a resposta final do bot
    console.log(
      "[Hook useChatbotQuery] Chamando sendMessage com a transcrição..."
    );
    sendMessage(transcription);
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    // Apenas adiciona a mensagem do usuário se for um input direto (não do fluxo de transcrição)
    // O fluxo de transcrição já adiciona a mensagem "Você disse:..."
    if (!messageText) {
      const userMessage: Message = { text: textToSend, role: "user" };
      setMessages((prev) => [...prev, userMessage]);
    }

    setLoading(true);
    setInput("");
    setTranscription(null); // Limpa a transcrição anterior

    try {
      const response = await fetch("/api/chatbotquery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: {
            contents: [{ role: "user", parts: [{ text: textToSend }] }],
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erro ao obter resposta do chatbot."
        );
      }

      const data = await response.json();

      // A resposta do n8n agora pode ter um campo 'transcription'
      if (data.transcription) {
        setTranscription(data.transcription);
      }

      const botReply = data;

      if (!botReply || typeof botReply.text !== "string") {
        throw new Error("Formato de resposta inesperado da API.");
      }

      const botMessage: Message = {
        messageId: new Date().toISOString() + Math.random(),
        role: "bot",
        text: botReply.text,
        canGenerateChart:
          botReply.canGenerateChart === true ||
          botReply.canGenerateChart === "true",
        chartPayload: botReply.chartPayload,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMsg: Message = {
        text: "Ocorreu um erro ao comunicar com o chatbot. Tente novamente.",
        role: "bot",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const addMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  };

  return {
    messages,
    input,
    setInput,
    loading,
    inputRef,
    sendMessage,
    addMessage,
    transcription, // Retorna o estado da transcrição
    handleTranscription, // Retorna a nova função
  };
}
