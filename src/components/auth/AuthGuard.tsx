// src/components/auth/AuthGuard.tsx
"use client";

import React, { ReactNode } from "react";
import { Box, Typography, Alert } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { TokenValidationLoading } from "./AuthLoading";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({
  children,
  fallback,
  requireAuth = true,
}: AuthGuardProps): React.JSX.Element {
  const { isAuthenticated, isLoading, error, user } = useAuth();

  // Estado de carregamento com componente dedicado
  if (isLoading) {
    return <TokenValidationLoading />;
  }

  // Estado de erro
  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        p={2}
      >
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          <Typography variant="body1" gutterBottom>
            Erro de Autenticação
          </Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      </Box>
    );
  }

  // Verificação de autenticação
  if (requireAuth && !isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // Fallback padrão - redirecionamento será feito pelo contexto
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="body1" color="text.secondary">
          Redirecionando para login...
        </Typography>
      </Box>
    );
  }

  // Usuário autenticado - renderizar conteúdo
  return <>{children}</>;
}

// Hook personalizado para verificações de permissão
export function useAuthGuard(): {
  isAuthenticated: boolean;
  user: ReturnType<typeof useAuth>["user"];
  hasPermission: (permission: string) => boolean;
} {
  const { isAuthenticated, user } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    // Implementar lógica de permissões baseada no usuário
    // Por exemplo, verificar roles ou permissions no user object
    return true; // Placeholder - implementar conforme necessidade
  };

  return {
    isAuthenticated,
    user,
    hasPermission,
  };
}
