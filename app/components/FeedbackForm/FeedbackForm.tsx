// components/FeedbackForm.tsx
import React, { useState } from "react";
import styles from "./FeedbackForm.module.scss";

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
  // Estado local para a nota (estrelas)
  const [rating, setRating] = useState<number | null>(null);
  // Estado local para o comentário textual
  const [comment, setComment] = useState<string>("");
  // Estado local para o feedback geral (positivo/negativo), pode ser null inicialmente
  const [isPositive, setIsPositive] = useState<boolean | null>(null);
  // Estado local para controlar o carregamento do envio do feedback
  const [loading, setLoading] = useState(false);
  // Estado local para controlar se o feedback foi enviado
  const [sent, setSent] = useState(false);

  // Função chamada quando o botão "Enviar Feedback" é clicado
  const handleSubmit = async () => {
    // Validação básica: garante que pelo menos uma opção de feedback foi fornecida
    if (isPositive === null && rating === null && !comment.trim()) {
      alert(
        "Por favor, forneça algum feedback (positivo/negativo, nota ou comentário)."
      );
      return;
    }
    setLoading(true);
    try {
      // Chama a função passada via props para enviar o feedback para o componente pai
      await onSendFeedback(rating, comment, isPositive);
      setSent(true); // Marca como enviado
      // Opcional: Você pode resetar os estados aqui se quiser que o formulário fique limpo após o envio
      setRating(null);
      setComment("");
      setIsPositive(null);
    } finally {
      setLoading(false);
    }
  };

  // Se estiver enviando, mostra uma mensagem de carregamento
  if (loading) {
    return (
      <div className={styles.container}>
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
