import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";

interface CitationProps {
  citations: { url: string; siteName: string }[];
  title?: string;
}

export default function Citations({
  citations,
  title = "Fontes",
}: CitationProps) {
  if (!citations || citations.length === 0) return null;
  console.log(citations);
  return (
    <Box sx={{ my: 2 }}>
      {title && (
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ mb: 1, fontWeight: 600 }}
        >
          {title}:
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        {citations.map((citation, index) => (
          <Chip
            key={`${citation.url}-${index}`}
            label={citation.siteName}
            icon={<LinkIcon />}
            component="a"
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            clickable
            variant="outlined"
            sx={{
              backgroundColor: "primary.light",
              color: "primary.contrastText",
              borderColor: "primary.main",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "primary.main",
                color: "primary.contrastText",
              },
              "& .MuiChip-icon": {
                color: "inherit",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
