// components/FeedbackForm.tsx
import React, { useState } from "react";
import styles from "./styles";

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
      <div style={styles.container}>
        <p>Enviando feedback...</p>
      </div>
    );
  }

  // Se o feedback foi enviado, mostra uma mensagem de agradecimento
  if (sent) {
    return (
      <div style={styles.container}>
        <p>Obrigado pelo seu feedback!</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h4>Sua opinião é importante! Avalie a resposta:</h4>
      <div style={styles.buttonGroup}>
        {/* Botão Positivo */}
        <button
          onClick={() => setIsPositive(true)}
          style={styles.positive(isPositive === true)}
          disabled={loading}
        >
          👍 Positivo
        </button>
        {/* Botão Negativo */}
        <button
          onClick={() => setIsPositive(false)}
          style={styles.negative(isPositive === false)}
          disabled={loading}
        >
          👎 Negativo
        </button>
      </div>

      <div style={styles.stars}>
        Nota:
        {/* Renderiza 5 estrelas para seleção de nota */}
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => !loading && setRating(star)}
            style={styles.star(star <= (rating || 0))}
          >
            ★
          </span>
        ))}
      </div>

      {/* Área de texto para o comentário */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Deixe um comentário (opcional)..."
        rows={3}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          boxSizing: "border-box" as const,
          marginBottom: "12px",
        }}
        disabled={loading}
      />
      {/* Botão para enviar o feedback */}
      <button
        onClick={handleSubmit}
        // O botão é desabilitado se nenhum feedback (positivo/negativo, nota ou comentário) foi fornecido
        disabled={
          loading || (isPositive === null && rating === null && !comment.trim())
        }
        style={styles.submit(
          loading || (isPositive === null && rating === null && !comment.trim())
        )}
      >
        Enviar Feedback
      </button>
    </div>
  );
}
