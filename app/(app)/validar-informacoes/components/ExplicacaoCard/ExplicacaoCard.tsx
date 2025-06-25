import React from "react";
import styles from "./ExplicacaoCard.module.scss";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ExplicacaoCardProps {
  explanation: string;
  title: string; // Optional title for the card
}

const ExplicacaoCard: React.FC<ExplicacaoCardProps> = ({
  explanation,
  title,
}) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ ...props }) => (
            <p className={styles.markdownText} {...props}>
              {props.children}
            </p>
          ),
        }}
      >
        {explanation}
      </ReactMarkdown>
    </div>
  );
};

export default ExplicacaoCard;
