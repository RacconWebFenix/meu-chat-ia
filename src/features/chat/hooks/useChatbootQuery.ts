// src/features/chat/hooks/useChatbootQuery.ts
import { useState, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { AppMessage, PollingResponse } from "@/types/api.types";
import { useGroup } from "@/contexts/GroupContext";

const POLLING_INTERVAL = 3000;
const POLLING_TIMEOUT = 300000; // 5 minutos
const PROGRESS_STEP_INTERVAL = 10000; // 10 segundos por etapa

export function useChatbotQuery() {
  const { selectedGroupId } = useGroup();
  const [messages, setMessages] = useState<AppMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const addMessage = (message: Omit<AppMessage, "messageId">): AppMessage => {
    const messageWithId: AppMessage = { ...message, messageId: uuidv4() };
    setMessages((prev) => [...prev, messageWithId]);
    return messageWithId;
  };

  const updateMessage = (messageId: string, updates: Partial<AppMessage>) => {
    setMessages((prev) =>
      prev.map((m) => (m.messageId === messageId ? { ...m, ...updates } : m))
    );
  };

  const stopAllIntervals = () => {
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  const pollForResult = useCallback(
    async (jobId: string, botMessageId: string) => {
      try {
        const response = await fetch(`/api/get-result?jobId=${jobId}`);
        if (!response.ok) throw new Error("Falha ao buscar resultado.");

        const result: PollingResponse = await response.json();

        if (result.status === "completed" && result.data) {
          stopAllIntervals();
          let finalPayload;

          // Caso 1: O campo 'data' já é o objeto final (nosso caminho da conversa).
          if (typeof result.data.summary === "string") {
            finalPayload = result.data;
          }
          // Caso 2: O campo 'data' é um objeto que contém a resposta como um texto em 'output' (caminho do SQL).
          else if (
            result.data.output &&
            typeof result.data.output === "string"
          ) {
            finalPayload = JSON.parse(result.data.output);
          }
          // Caso 3 (segurança): O próprio campo 'data' é um texto JSON.
          else if (typeof result.data === "string") {
            finalPayload = JSON.parse(result.data);
          }
          // Se nenhum formato for reconhecido, lança um erro.
          else {
            throw new Error("Formato de dados da resposta final inesperado.");
          }

          updateMessage(botMessageId, {
            text: finalPayload.summary,
            chart: finalPayload,
            isChartLoading: false,
            progressStep: undefined,
          });
          setLoading(false);
          inputRef.current?.focus();
        } else if (result.status === "failed") {
          stopAllIntervals();
          const errorData = JSON.parse(result.data?.output || "{}");
          updateMessage(botMessageId, {
            text: `Desculpe, ocorreu um erro: ${
              errorData.error || "Erro desconhecido."
            }`,
            isChartLoading: false,
            progressStep: undefined,
          });
          setLoading(false);
        }
      } catch (error) {
        stopAllIntervals();
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Ocorreu um erro no polling.";
        updateMessage(botMessageId, {
          text: `Desculpe, ocorreu um erro: ${errorMessage}`,
          isChartLoading: false,
          progressStep: undefined,
        });
        setLoading(false);
      }
    },
    []
  );

  const sendMessage = async (messageText?: string) => {
    const textToSend = typeof messageText === "string" ? messageText : input;
    if (!textToSend.trim()) return;

    if (typeof messageText !== "string") {
      addMessage({ role: "user", text: textToSend });
    }

    const botMessage = addMessage({
      role: "bot",
      text: "",
      isChartLoading: true,
      progressStep: 1,
    });
    setLoading(true);
    setInput("");

    let currentStep = 1;
    progressIntervalRef.current = setInterval(() => {
      currentStep++;
      if (currentStep <= 4) {
        updateMessage(botMessage.messageId, { progressStep: currentStep });
      }
    }, PROGRESS_STEP_INTERVAL);

    try {
      const initialResponse = await fetch("/api/chatbotquery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: {
            message: textToSend,
            groupId: selectedGroupId,
          },
        }),
      });

      if (!initialResponse.ok) throw new Error("Erro ao iniciar a consulta.");

      const { jobId } = await initialResponse.json();
      pollingIntervalRef.current = setInterval(
        () => pollForResult(jobId, botMessage.messageId),
        POLLING_INTERVAL
      );

      setTimeout(() => {
        if (pollingIntervalRef.current) {
          stopAllIntervals();
          setMessages((prev) => {
            const msg = prev.find((m) => m.messageId === botMessage.messageId);
            if (msg?.isChartLoading) {
              updateMessage(botMessage.messageId, {
                text: "A solicitação demorou muito. Tente novamente.",
                isChartLoading: false,
                progressStep: undefined,
              });
              setLoading(false);
            }
            return prev;
          });
        }
      }, POLLING_TIMEOUT);
    } catch (error) {
      stopAllIntervals();
      const errMsg =
        error instanceof Error ? error.message : "Erro desconhecido.";
      updateMessage(botMessage.messageId, {
        text: `Desculpe, ocorreu um erro: ${errMsg}`,
        isChartLoading: false,
        progressStep: undefined,
      });
      setLoading(false);
    }
  };

  const handleTranscription = (transcription: string) => {
    if (!transcription) return;
    addMessage({ role: "user", text: `Você disse: "${transcription}"` });
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
  };
}
