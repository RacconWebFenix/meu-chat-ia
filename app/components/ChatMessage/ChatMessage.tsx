import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ImageGrid from "../ImageGrid/ImageGrid";
import { Message } from "../ChatBoot/ChatBoot";
import DataGridTable from "../DataGridTable/DataGridTable";
import SearchPriceInfo from "../SearchPriceInfo/SearchPriceInfo";
import styles from "./MessageItem.module.scss";
import { searchPriceMock } from "../../mocks/searchPriceMock";

interface Image {
  image_url: string;
  origin_url: string;
  height?: number;
  width?: number;
}

interface Props {
  message: Message;
  citations?: { url: string; siteName: string }[];
  images?: Image[];
  userInputHeaders?: string[];
  userInputRow?: (string | undefined)[];
  type?: string;
}

export default function ChatMessage({
  message,
  citations,
  userInputHeaders,
  userInputRow,
  type,
}: Props) {
  const hasImages = message.images && message.images.length > 0;
  const hasCitations = citations && citations.length > 0;

  // Regex para encontrar a primeira tabela markdown
  const tableRegex = /\n(\|.*\|.*\n(\|[-:]+.*\n)((?:.*\|.*\n?)+))/;
  // Se for pricesearch, use o mock, senão use o texto da mensagem
  const markdownSource =
    type === "pricesearch"
      ? searchPriceMock.text.content
      : typeof message.text === "string"
      ? message.text
      : "";

  const match = markdownSource.match(tableRegex);

  let explanation = markdownSource;
  let table = "";

  if (match) {
    explanation = markdownSource.slice(0, match.index);
    table = match[0];
  }

  return (
    <div className={styles.messageItem}>
      {hasImages && (
        <div className={styles.imagesWrapper}>
          <ImageGrid images={message.images || []} />
        </div>
      )}

      {hasCitations && (
        <div className={styles.citationsWrapper}>
          {citations.map((citation) => (
            <a
              key={citation.url}
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.citationLink}
            >
              {citation.siteName}
            </a>
          ))}
        </div>
      )}

      {/* Renderiza explicação (antes da tabela) */}
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

      {/* Renderiza tabela separadamente, se existir */}
      {type === "pricesearch" && table && <SearchPriceInfo markdown={table} />}

      {table && type !== "pricesearch" && (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            table: ({ ...props }) => (
              <DataGridTable
                {...props}
                userInputHeaders={userInputHeaders}
                userInputRow={userInputRow}
              >
                {props.children}
              </DataGridTable>
            ),
            th: ({ ...props }) => (
              <th className={styles.tableTh} {...props}>
                {props.children}
              </th>
            ),
            td: ({ ...props }) => (
              <td className={styles.tableTd} {...props}>
                {props.children}
              </td>
            ),
          }}
        >
          {table}
        </ReactMarkdown>
      )}
    </div>
  );
}
