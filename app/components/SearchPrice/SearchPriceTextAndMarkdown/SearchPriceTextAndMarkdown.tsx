import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./SearchPriceTextAndMarkdown.module.scss";

interface Props {
  data?: {
    text: {
      content: string;
    };
  };
}

export default function SearchPriceTextAndMarkdown({ data }: Props) {
  if (!data?.text?.content) return null;

  // Regex para encontrar a primeira tabela markdown ou bloco markdown
  const markdownRegex = /(\n\|.*\|.*\n(\|[-:]+.*\n)((?:.*\|.*\n?)+))/;
  const match = data.text.content.match(markdownRegex);

  let explanation = data.text.content;
  let markdown = "";

  if (match) {
    explanation = data.text.content.slice(0, match.index);
    markdown = match[0];
  }

  return (
    <div>
      {/* Renderiza o texto puro (explicação) */}
      {explanation && (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{explanation}</ReactMarkdown>
      )}

      {/* Renderiza o markdown (tabela, etc) com estilização customizada */}
      {markdown && (
        <div className={styles.markdownTableContainer}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ ...props }) => (
                <table className={styles.markdownTable} {...props} />
              ),
              th: ({ ...props }) => (
                <th className={styles.tableTh} {...props} />
              ),
              td: ({ ...props }) => (
                <td className={styles.tableTd} {...props} />
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
