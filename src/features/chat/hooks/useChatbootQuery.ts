import { useState, useRef } from "react";
import { Message } from "@/features/chat/types";

export function useChatbotQuery() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { text: input, role: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      const response = await fetch("/api/chatbotquery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: {
            contents: [{ role: "user", parts: [{ text: userMessage.text }] }],
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
  };
}
