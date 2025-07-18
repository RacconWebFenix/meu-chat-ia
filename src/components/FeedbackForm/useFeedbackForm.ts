import { useState } from "react";

export function useFeedbackForm(
  onSendFeedback: (
    userRating: number | null,
    userComment: string,
    isPositive: boolean | null
  ) => Promise<void> | void
) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");
  const [isPositive, setIsPositive] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (isPositive === null && rating === null && !comment.trim()) {
      alert(
        "Por favor, forneça algum feedback (positivo/negativo, nota ou comentário)."
      );
      return;
    }
    setLoading(true);
    try {
      await onSendFeedback(rating, comment, isPositive);
      setSent(true);
      setRating(null);
      setComment("");
      setIsPositive(null);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSent(false);
    setRating(null);
    setComment("");
    setIsPositive(null);
  };

  return {
    rating,
    setRating,
    comment,
    setComment,
    isPositive,
    setIsPositive,
    loading,
    sent,
    handleSubmit,
    reset,
  };
}
