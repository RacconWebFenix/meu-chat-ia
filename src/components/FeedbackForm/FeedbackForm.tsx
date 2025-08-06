// components/FeedbackForm/FeedbackForm.tsx
import React from "react";
import styles from "./FeedbackForm.module.scss";
import { useFeedbackForm } from "./useFeedbackForm";
import { ChatLoading, CustomButton } from "../shared";

interface FeedbackFormProps {
  onSendFeedback: (
    userRating: number | null,
    userComment: string,
    isPositive: boolean | null
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

  if (loading) {
    return (
      <div className={styles.container}>
        <ChatLoading />
        <p>Enviando feedback...</p>
      </div>
    );
  }

  if (sent) {
    return (
      <div className={styles.container}>
        <p>Obrigado pelo seu feedback!</p>
      </div>
    );
  }

  const handleStarKeyDown = (e: React.KeyboardEvent, starValue: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setRating(starValue);
    }
  };

  return (
    <div className={styles.container}>
      <h4>Sua opinião é importante! Avalie a resposta:</h4>
      <div className={styles.buttonGroup}>
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
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            role="button"
            tabIndex={0}
            className={
              star <= (rating || 0)
                ? `${styles.star} ${styles.starFilled}`
                : styles.star
            }
            onClick={() => !loading && setRating(star)}
            onKeyDown={(e) => !loading && handleStarKeyDown(e, star)}
            aria-label={`Avaliação ${star} de 5 estrelas`}
          >
            ★
          </span>
        ))}
      </div>

      <textarea
        className={styles.textarea}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Deixe um comentário (opcional)..."
        rows={3}
        disabled={loading}
      />
      <CustomButton
        type="button"
        colorType="primary"
        fullWidth
        variant="contained"
        sx={{
          mt: 2,
          py: 1.5,
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
