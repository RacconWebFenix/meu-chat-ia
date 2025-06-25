import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ImageGrid from "../../ImageGrid/ImageGrid";

import styles from "./MessageItem.module.scss";
import { Message } from "../Hooks/useChatBoot";
import { extractExplanationAndTable } from "../../../Utils/extractExplanationAndTable";
import { parseMarkdownTable } from "../../../Utils/parseMarkdownTable";
import DataGridTable from "../../shared/DataGrid/DataGridTable";
import Citations from "../../shared/Citations/Citations";

interface Image {
  image_url: string;
  origin_url: string;
  height?: number;
  width?: number;
}

interface Citation {
  url: string;
  siteName: string;
}

interface Props {
  message: Message;
  citations?: Citation[];
  images?: Image[];
  userInputHeaders?: string[];
  userInputRow?: (string | undefined)[];
  type?: string;
}

export default function ChatMessage({ message, citations }: Props) {
  const hasImages = message.images && message.images.length > 0;
  const hasCitations = citations && citations.length > 0;

  const markdownSource = typeof message.text === "string" ? message.text : "";

  const { explanation, table } = extractExplanationAndTable(markdownSource);

  // Parse a tabela markdown para arrays
  const parsedTable = table ? parseMarkdownTable(table) : null;

  console.log(parsedTable);

  return (
    <div className={styles.messageItem}>
      {hasImages && (
        <div className={styles.imagesWrapper}>
          <ImageGrid images={message.images || []} />
        </div>
      )}

      {hasCitations && <Citations citations={citations} />}

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

      {/* Renderize o DataGridTable apenas se conseguir extrair a tabela */}
      {parsedTable && (
        <DataGridTable columns={parsedTable.columns} data={parsedTable.data} />
      )}
    </div>
  );
}
