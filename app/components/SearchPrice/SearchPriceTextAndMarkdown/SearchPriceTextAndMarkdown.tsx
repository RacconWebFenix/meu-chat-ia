"use client";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./SearchPriceTextAndMarkdown.module.scss";
import { extractJsonObjectsFromContent, getComparativoValores } from "./utils";
import { SearchPriceJsonInterface } from "../types";

interface Props {
  data?: {
    text: {
      content: string;
    };
    userValue?: string | number;
  };
}

export default function SearchPriceTextAndMarkdown({ data }: Props) {
  const [jsonObjects, setJsonObjects] = useState<SearchPriceJsonInterface[]>(
    []
  );

  useEffect(() => {
    if (!data?.text?.content) {
      setJsonObjects([]);
      return;
    }
    setJsonObjects(extractJsonObjectsFromContent(data.text.content));
  }, [data]);

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

  // Usa a função auxiliar para obter todos os dados de comparação
  const { maiorValor, valorUsuario, diffPercent, textoComparativo } =
    getComparativoValores(jsonObjects, data?.userValue);

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

      {/* Renderiza a porcentagem abaixo da tabela */}
      {maiorValor > 0 && !isNaN(valorUsuario) && (
        <div style={{ marginTop: "1rem", fontWeight: 500, color: "#fff" }}>
          <strong>Maior valor listado:</strong> R$ {maiorValor.toFixed(2)}
          <br />
          <strong>Valor informado:</strong> R$ {valorUsuario.toFixed(2)}
          <br />
          <strong>Diferença percentual:</strong> {diffPercent.toFixed(2)}%<br />
          <strong>Comparativo:</strong> {textoComparativo}
        </div>
      )}
    </div>
  );
}
