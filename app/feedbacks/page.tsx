"use client";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/app/config/api";
import Link from "next/link";
import styles from "./Feedbacks.module.scss";

interface Feedback {
  id: number;
  prompt: string;
  response: string;
  userFeedback?: string;
  rating?: number;
  comment?: string;
}

export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE_URL}/feedbacks`);
    const data = await res.json();
    setFeedbacks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja apagar este feedback?")) return;
    await fetch(`${API_BASE_URL}/feedbacks/${id}`, { method: "DELETE" });
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
  };

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + "..." : text;

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>
        ← Voltar para o chat
      </Link>
      <h1 className={styles.title}>Feedbacks</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : feedbacks.length === 0 ? (
        <p>Nenhum feedback encontrado.</p>
      ) : (
        <table className={styles.feedbackTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Pergunta</th>
              <th>Resposta</th>
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
                <td>{f.prompt}</td>
                <td>{f.response ? truncate(f.response, 80) : ""}</td>
                <td>
                  {f.userFeedback} {f.rating ? `(${f.rating})` : ""}
                  {f.comment ? <div>{f.comment}</div> : null}
                </td>
                <td>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(f.id)}
                  >
                    Apagar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
