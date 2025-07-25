"use client";
import { useEffect, useState } from "react";

import Link from "next/link";
import styles from "./Feedbacks.module.scss";
import { ChatLoading, CustomButton } from "@/components/shared";

interface Feedback {
  id: string;
  prompt: string;
  response: string;
  userFeedback?: string;
  rating?: number;
  comment?: string;
  timestamp?: string; // Adicione este campo se existir na sua API
  noteType?: string; // Exemplo: "positivo" ou "negativo"
}

export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    setLoading(true);
    // Mostra o loading enquanto busca
    try {
      const res = await fetch(`/api/feedback`);
      const data = await res.json();
      setFeedbacks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleDelete = async (id: string) => {
    setLoading(true); // Mostra o loading durante o delete
    try {
      if (!confirm("Tem certeza que deseja apagar este feedback?")) {
        setLoading(false);
        return;
      }
      await fetch(`/api/feedback`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    } finally {
      setLoading(false);
    }
  };

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + "..." : text;

  // Função para mostrar estrelas
  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <span>
        {"★".repeat(rating)}
        {"☆".repeat(5 - rating)}
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>
        ← Voltar para o chat
      </Link>
      <h1 className={styles.title}>Feedbacks</h1>
      {loading ? (
        <ChatLoading />
      ) : feedbacks.length === 0 ? (
        <p>Nenhum feedback encontrado.</p>
      ) : (
        <table className={styles.feedbackTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Pergunta</th>
              <th>Resposta</th>
              <th>Nota</th>
              <th>Tipo de Nota</th>
              <th>Feedback</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((f, i) => (
              <tr
                key={f.id}
                className={i % 2 === 0 ? styles.evenRow : styles.oddRow}
              >
                <td>{f.id}</td>
                <td>
                  {f.timestamp
                    ? new Date(f.timestamp).toLocaleString("pt-BR")
                    : "--"}
                </td>
                <td>{f.prompt}</td>
                <td>{f.response ? truncate(f.response, 80) : ""}</td>
                <td>{f.rating ? renderStars(f.rating) : "--"}</td>
                <td>
                  {f.noteType
                    ? f.noteType.charAt(0).toUpperCase() + f.noteType.slice(1)
                    : f.rating
                    ? f.rating >= 4
                      ? "Positivo"
                      : "Negativo"
                    : "--"}
                </td>
                <td>{f.comment ? <div>{f.comment}</div> : null}</td>
                <td>
                  <CustomButton
                    colorType="delete"
                    variant="contained"
                    sx={{
                      py: 1,
                      px: 2,
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                    onClick={() => handleDelete(f.id)}
                  >
                    Apagar
                  </CustomButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
