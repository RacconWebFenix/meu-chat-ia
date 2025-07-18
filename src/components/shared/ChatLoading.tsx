import React from "react";
import { Box, Typography, keyframes } from "@mui/material";
import Image from "next/image";

interface ChatLoadingProps {
  className?: string;
  message?: string;
}

// Animação de rotação no eixo Y
const spinY = keyframes`
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(360deg);
  }
`;

export default function ChatLoading({
  className,
  message = "Carregando...",
}: ChatLoadingProps) {
  const logoSrc = "/assets/logo-comercio-integrado.png";

  return (
    <Box
      className={className}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
        mt: 1.5,
        color: "primary.main",
        fontWeight: 500,
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          animation: `${spinY} 3s linear infinite`,
        }}
      >
        <Image src={logoSrc} alt="Logo" width={110} height={50} />
      </Box>
      <Typography variant="body2" color="primary.main" fontWeight={500}>
        {message}
      </Typography>
    </Box>
  );
}
