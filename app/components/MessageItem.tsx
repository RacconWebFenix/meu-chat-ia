import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ImageGrid from "./ImageGrid/ImageGrid";
import { Message } from "./ChatBoot";
import DataGridTable from "./DataGridTable";

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
}

export default function MessageItem({ message, citations }: Props) {
  const hasImages = message.images && message.images.length > 0;
  const hasCitations = citations && citations.length > 0;

  // Regex para encontrar a primeira tabela markdown
  const tableRegex = /\n(\|.*\|.*\n(\|[-:]+.*\n)((?:.*\|.*\n?)+))/;
  const match = message.text.match(tableRegex);

  let explanation = message.text;
  let table = "";

  if (match) {
    // Tudo antes da tabela
    explanation = message.text.slice(0, match.index);
    // A tabela completa (incluindo \n inicial)
    table = match[0];
  }

  return (
    <div style={{ marginBottom: 16 }}>
      {hasImages && (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 40px" }}>
          <ImageGrid images={message.images || []} />
        </div>
      )}

      {hasCitations && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            margin: "16px 0",
          }}
        >
          {citations.map((citation) => (
            <a
              key={citation.url}
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "10px 18px",
                background: "#eaf6ff",
                borderRadius: 8,
                color: "#0074cc",
                fontWeight: 500,
                textDecoration: "none",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                transition: "background 0.2s",
                marginBottom: 4,
              }}
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
            <p style={{ color: "#111" }} {...props}>
              {props.children}
            </p>
          ),
        }}
      >
        {explanation}
      </ReactMarkdown>

      {/* Renderiza tabela separadamente, se existir */}
      {table && (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            table: ({ ...props }) => (
              <DataGridTable {...props}>{props.children}</DataGridTable>
            ),
            th: ({ ...props }) => (
              <th
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  background: "#f3f3f3",
                  fontWeight: "bold",
                }}
                {...props}
              >
                {props.children}
              </th>
            ),
            td: ({ ...props }) => (
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  color: "#111",
                }}
                {...props}
              >
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
