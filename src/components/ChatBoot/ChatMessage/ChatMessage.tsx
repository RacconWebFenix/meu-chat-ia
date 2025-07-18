import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ImageGrid from "../../ImageGrid/ImageGrid";
import { Message } from "@/features/chat/types";
import { extractExplanationAndTable } from "../../../Utils/extractExplanationAndTable";
import { parseMarkdownTable } from "../../../Utils/parseMarkdownTable";
import DataGridTable from "../../shared/DataGrid/DataGridTable";
import { Citations } from "../../shared";
import { Typography, Box } from "@mui/material";

interface Image {
  image_url: string;
  origin_url?: string;
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

  return (
    <Box sx={{ mb: 2 }}>
      {hasImages && (
        <Box>
          <ImageGrid images={message.images || []} />
        </Box>
      )}

      {hasCitations && <Citations citations={citations} />}

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ ...props }) => (
            <Typography
              component="p"
              variant="body1"
              color="text.secondary"
              sx={{ fontWeight: 500, mb: 1 }}
              {...props}
            />
          ),
          li: ({ ...props }) => (
            <Typography
              component="li"
              variant="body1"
              color="text.secondary"
              sx={{ fontWeight: 500, mb: 1 }}
              {...props}
            />
          ),
          h1: ({ ...props }) => (
            <Typography
              component="h1"
              variant="body1"
              color="text.secondary"
              sx={{ fontWeight: 500, mb: 1 }}
              {...props}
            />
          ),
          h2: ({ ...props }) => (
            <Typography
              component="h2"
              variant="body1"
              color="text.secondary"
              sx={{ fontWeight: 500, mb: 1 }}
              {...props}
            />
          ),
        }}
      >
        {explanation}
      </ReactMarkdown>

      {/* Renderize o DataGridTable apenas se conseguir extrair a tabela */}
      {parsedTable && (
        <DataGridTable columns={parsedTable.columns} data={parsedTable.data} />
      )}
    </Box>
  );
}
