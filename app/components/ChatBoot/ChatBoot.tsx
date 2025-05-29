// components/ChatBoot.tsx
import { useState } from "react";
import MessageList from "../MessageList/MessageList";
import MessageSkeleton from "../MessageSkeleton/MessageSkeleton";
import FeedbackForm from "../FeedbackForm/FeedbackForm";
import SelectLine from "../FormSelectLine/FormSelectLine";
import styles from "./ChatBoot.module.scss";

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
  const [linha, setLinha] = useState<"automotiva" | "industrial">("automotiva");
  const [prompt, setPrompt] = useState("");

  const [loading, setLoading] = useState(false);
  const [currentFeedbackId, setCurrentFeedbackId] = useState<string | null>(
    null
  );
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);
  const [userInputHeaders, setUserInputHeaders] = useState<string[]>([]);
  const [userInputRow, setUserInputRow] = useState<(string | undefined)[]>([]);

  function getSiteName(url: string) {
    try {
      const { hostname } = new URL(url);
      return hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  }

  const sendMessage = async () => {
    if (!prompt.replace(/(Nome:|Nome da Peça ou Componente:)/, "").trim())
      return;
    setLoading(true);
    setMessages([]);
    setCurrentFeedbackId(null);
    setFeedbackSent(false);

    try {
      const response = await fetch("/api/chat", {
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
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
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

  const handleSendFeedback = async (
    userRating: number | null,
    userComment: string,
    isPositive: boolean | null
  ) => {
    if (!currentFeedbackId || feedbackSent) return;

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
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
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      alert("Erro ao enviar feedback.");
    }
  };

  const handleSend = (
    prompt: string,
    headers: string[],
    row: (string | undefined)[]
  ) => {
    setPrompt(prompt);
    setUserInputHeaders(headers);
    setUserInputRow(row);
    sendMessage(); // envia para a API logo após salvar os dados
  };

  return (
    <div className={styles.chatBootContainer}>
      <MessageList
        messages={messages}
        userInputHeaders={userInputHeaders}
        userInputRow={userInputRow}
      />
      {loading && <MessageSkeleton />}

      {currentFeedbackId && !feedbackSent && messages.length > 0 && (
        <FeedbackForm onSendFeedback={handleSendFeedback} />
      )}

      <SelectLine
        linha={linha}
        setLinha={setLinha}
        setPrompt={setPrompt}
        onSend={handleSend}
        disabled={loading}
      />
    </div>
  );
}
