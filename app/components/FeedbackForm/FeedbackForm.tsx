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
  ) => void;
}

export default function FeedbackForm({ onSendFeedback }: FeedbackFormProps) {
  // Estado local para a nota (estrelas)
  const [rating, setRating] = useState<number | null>(null);
  // Estado local para o comentário textual
  const [comment, setComment] = useState<string>("");
  // Estado local para o feedback geral (positivo/negativo), pode ser null inicialmente
  const [isPositive, setIsPositive] = useState<boolean | null>(null);

  // Função chamada quando o botão "Enviar Feedback" é clicado
  const handleSubmit = () => {
    // Validação básica: garante que pelo menos uma opção de feedback foi fornecida
    if (isPositive === null && rating === null && !comment.trim()) {
      alert(
        "Por favor, forneça algum feedback (positivo/negativo, nota ou comentário)."
      );
      return;
    }
    // Chama a função passada via props para enviar o feedback para o componente pai
    onSendFeedback(rating, comment, isPositive);
    // Opcional: Você pode resetar os estados aqui se quiser que o formulário fique limpo após o envio
    setRating(null);
    setComment('');
    setIsPositive(null);
  };

  return (
    <div style={styles.container}>
      <h4>Sua opinião é importante! Avalie a resposta:</h4>
      <div style={styles.buttonGroup}>
        {/* Botão Positivo */}
        <button
          onClick={() => setIsPositive(true)}
          style={styles.positive(isPositive === true)}
        >
          👍 Positivo
        </button>
        {/* Botão Negativo */}
        <button
          onClick={() => setIsPositive(false)}
          style={styles.negative(isPositive === false)}
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
            onClick={() => setRating(star)}
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
      />
      {/* Botão para enviar o feedback */}
      <button
        onClick={handleSubmit}
        // O botão é desabilitado se nenhum feedback (positivo/negativo, nota ou comentário) foi fornecido
        disabled={isPositive === null && rating === null && !comment.trim()}
        style={styles.submit(
          isPositive === null && rating === null && !comment.trim()
        )}
      >
        Enviar Feedback
      </button>
    </div>
  );
}
