import { useRef, useState } from "react";

export function useChatPDM() {
  const [messages, setMessages] = useState<
    { text: string; from: "user" | "bot" }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([{ text: input, from: "user" }]);
    setLoading(true);
    setInput("");
    try {
      const body = {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: "Qual é o PDM (Padrão de Descriçao de Materiais) para o material apesquisado? ",
              },
            ],
          },
          { role: "user", parts: [{ text: input }] },
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 1,
          topP: 1,
          maxOutputTokens: 700,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE",
          },
        ],
      };

      const res = await fetch(`api/chatpdm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setMessages([
        { text: input, from: "user" },
        {
          text: data.reply?.text || "Erro ao obter resposta da IA.",
          from: "bot",
        },
      ]);
    } catch {
      setMessages([
        { text: input, from: "user" },
        { text: "Erro ao conectar com a IA.", from: "bot" },
      ]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  return {
    messages,
    input,
    setInput,
    loading,
    inputRef,
    sendMessage,
  };
}
