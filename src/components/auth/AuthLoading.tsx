// src/components/auth/AuthLoading.tsx
"use client";

import React from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  padding: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
}));

const LoadingCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  maxWidth: 400,
  width: "100%",
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[8],
}));

const PulsingDot = styled(Box)<{ delay: number }>(({ theme, delay }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  animation: `pulse 1.5s ease-in-out infinite`,
  animationDelay: `${delay}s`,
  "@keyframes pulse": {
    "0%, 100%": {
      opacity: 0.3,
      transform: "scale(1)",
    },
    "50%": {
      opacity: 1,
      transform: "scale(1.2)",
    },
  },
}));

interface AuthLoadingProps {
  message?: string;
  showProgress?: boolean;
  variant?: "spinner" | "dots" | "linear";
}

export function AuthLoading({
  message = "Validando autenticação...",
  showProgress = false,
  variant = "spinner",
}: AuthLoadingProps): React.JSX.Element {
  const renderLoadingIndicator = () => {
    switch (variant) {
      case "dots":
        return (
          <Box display="flex" gap={1} justifyContent="center" mb={2}>
            <PulsingDot delay={0} />
            <PulsingDot delay={0.2} />
            <PulsingDot delay={0.4} />
          </Box>
        );

      case "linear":
        return (
          <Box width="100%" mb={2}>
            <LinearProgress />
          </Box>
        );

      default:
        return <CircularProgress size={48} thickness={4} sx={{ mb: 2 }} />;
    }
  };

  return (
    <LoadingContainer>
      <LoadingCard elevation={8}>
        {renderLoadingIndicator()}

        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          color="text.primary"
          fontWeight={500}
        >
          Autenticação
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: showProgress ? 2 : 0 }}
        >
          {message}
        </Typography>

        {showProgress && (
          <Box width="100%">
            <LinearProgress variant="indeterminate" />
          </Box>
        )}
      </LoadingCard>
    </LoadingContainer>
  );
}

// Componente específico para loading de validação de token
export function TokenValidationLoading(): React.JSX.Element {
  return (
    <AuthLoading
      message="Verificando sessão..."
      variant="dots"
      showProgress={true}
    />
  );
}

// Componente para loading de refresh token
export function RefreshTokenLoading(): React.JSX.Element {
  return <AuthLoading message="Renovando sessão..." variant="linear" />;
}
