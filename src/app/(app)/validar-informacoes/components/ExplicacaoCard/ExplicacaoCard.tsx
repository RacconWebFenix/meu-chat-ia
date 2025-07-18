import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Typography, Box } from "@mui/material";

interface ExplicacaoCardProps {
  explanation: string;
  title: string; // Optional title for the card
}

const ExplicacaoCard: React.FC<ExplicacaoCardProps> = ({
  explanation,
  title,
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <div
        style={{
          color: "#1976d2",
          fontWeight: 600,
          fontSize: "1.25rem",
          marginBottom: "8px",
        }}
      >
        {title}
      </div>

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
        }}
      >
        {explanation}
      </ReactMarkdown>
    </Box>
  );
};

export default ExplicacaoCard;
