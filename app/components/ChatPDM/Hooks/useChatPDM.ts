import { API_BASE_URL } from "@/app/config/api";
import { useRef, useState } from "react";


export function useChatPDM() {
  const [messages, setMessages] = useState<{ text: string; from: "user" | "bot" }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([{ text: input, from: "user" }]);
    setLoading(true);
    setInput("");

    try {
      const res = await fetch(`${API_BASE_URL}/chatpdm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      setMessages([
        { text: input, from: "user" },
        {
          text: data.candidates[0].content.parts[0].text || "Erro ao obter resposta da IA.",
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