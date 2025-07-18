// components/FeedbackForm.tsx
import React from "react";
import styles from "./FeedbackForm.module.scss";
import { useFeedbackForm } from "./useFeedbackForm";
import { ChatLoading, CustomButton } from "../shared";

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
        <CustomButton
          type="button"
          colorType="secondary"
          sx={{ mr: 1 }}
          variant={isPositive === true ? "contained" : "outlined"}
          onClick={() => setIsPositive(true)}
          disabled={loading}
        >
          👍 Positivo
        </CustomButton>
        {/* Botão Negativo */}
        <CustomButton
          type="button"
          colorType="delete"
          variant={isPositive === false ? "contained" : "outlined"}
          onClick={() => setIsPositive(false)}
          disabled={loading}
        >
          👎 Negativo
        </CustomButton>
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
      <CustomButton
        type="button"
        colorType="primary"
        fullWidth
        variant="contained"
        sx={{
          mt: 2,
          py: 1.5,
          fontSize: 16,
          fontWeight: 700,
          background: (theme) => theme.palette.primary.main,
          color: (theme) => theme.palette.primary.contrastText,
          "&:hover": {
            background: (theme) => theme.palette.primary.dark,
          },
        }}
        onClick={handleSubmit}
        disabled={
          loading || (isPositive === null && rating === null && !comment.trim())
        }
      >
        Enviar Feedback
      </CustomButton>
    </div>
  );
}
