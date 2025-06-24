import React from "react";
import styles from "./ExplicacaoCard.module.scss";

interface ExplicacaoCardProps {
  explanation: string;
  title?: string; // Optional title for the card
}

const ExplicacaoCard: React.FC<ExplicacaoCardProps> = ({
  explanation,
  title,
}) => {
  return (
    <div className={styles.card}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <strong className={styles.strong}>Explicação:</strong>
      <div>{explanation}</div>
    </div>
  );
};

export default ExplicacaoCard;
