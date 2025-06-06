// components/FeedbackForm.tsx
import React from "react";
import styles from "./FeedbackForm.module.scss";
import { useFeedbackForm } from "./useFeedbackForm";
import ChatLoading from "../shared/ChatLoading/ChatLoading";

// Define a interface para as props que o componente vai receber
interface FeedbackFormProps {
  // onSendFeedback é uma função que o componente pai (ChatBoot ou Home) vai passar
  // Ela será chamada quando o usuário enviar o feedback
  onSendFeedback: (
    userRating: number | null,
    userComment: string,
    // Este booleano indica se o feedback geral foi positivo (true) ou negativo (false)
    isPositive: boolean | null // Alterado para null também, para permitir que o usuário não selecione
  ) => Promise<void> | void;
}

export default function FeedbackForm({ onSendFeedback }: FeedbackFormProps) {
  const {
    rating,
    setRating,
    comment,
    setComment,
    isPositive,
    setIsPositive,
    loading,
    sent,
    handleSubmit,
  } = useFeedbackForm(onSendFeedback);

  // Se estiver enviando, mostra uma mensagem de carregamento
  if (loading) {
    return (
      <div className={styles.container}>
        <ChatLoading />
        <p>Enviando feedback...</p>
      </div>
    );
  }

  // Se o feedback foi enviado, mostra uma mensagem de agradecimento
  if (sent) {
    return (
      <div className={styles.container}>
        <p>Obrigado pelo seu feedback!</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h4>Sua opinião é importante! Avalie a resposta:</h4>
      <div className={styles.buttonGroup}>
        {/* Botão Positivo */}
        <button
          type="button"
          className={
            isPositive === true
              ? `${styles.positive} ${styles.positiveActive}`
              : styles.positive
          }
          onClick={() => setIsPositive(true)}
          disabled={loading}
        >
          👍 Positivo
        </button>
        {/* Botão Negativo */}
        <button
          type="button"
          className={
            isPositive === false
              ? `${styles.negative} ${styles.negativeActive}`
              : styles.negative
          }
          onClick={() => setIsPositive(false)}
          disabled={loading}
        >
          👎 Negativo
        </button>
      </div>

      <div className={styles.stars}>
        Nota:
        {/* Renderiza 5 estrelas para seleção de nota */}
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={
              star <= (rating || 0)
                ? `${styles.star} ${styles.starFilled}`
                : styles.star
            }
            onClick={() => !loading && setRating(star)}
          >
            ★
          </span>
        ))}
      </div>

      {/* Área de texto para o comentário */}
      <textarea
        className={styles.textarea}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Deixe um comentário (opcional)..."
        rows={3}
        disabled={loading}
      />
      {/* Botão para enviar o feedback */}
      <button
        type="button"
        className={
          loading || (isPositive === null && rating === null && !comment.trim())
            ? `${styles.submit} ${styles.submitDisabled}`
            : styles.submit
        }
        onClick={handleSubmit}
        disabled={
          loading || (isPositive === null && rating === null && !comment.trim())
        }
      >
        Enviar Feedback
      </button>
    </div>
  );
}
