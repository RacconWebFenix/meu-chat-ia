// src/hooks/useAuthSession.ts
"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthClient } from "@/lib/authClient";

interface UseAuthSessionOptions {
  redirectToLogin?: boolean;
  validateOnFocus?: boolean;
  refreshInterval?: number; // em minutos
}

export function useAuthSession(options: UseAuthSessionOptions = {}) {
  const {
    redirectToLogin = true,
    validateOnFocus = true,
    refreshInterval = 15, // 15 minutos
  } = options;

  const { isAuthenticated, validateSession, refreshToken } = useAuth();
  const router = useRouter();

  // Validação periódica da sessão
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      console.log("🔍 Validação periódica da sessão...");

      const isValid = await validateSession();
      if (!isValid && redirectToLogin) {
        console.log("🚫 Sessão inválida - redirecionando para login");
        router.push("/login");
      }
    }, refreshInterval * 60 * 1000); // converter para milissegundos

    return () => clearInterval(interval);
  }, [
    isAuthenticated,
    validateSession,
    refreshInterval,
    redirectToLogin,
    router,
  ]);

  // Validação quando a janela ganha foco
  useEffect(() => {
    if (!validateOnFocus || !isAuthenticated) return;

    const handleFocus = async () => {
      console.log("🔍 Validação por foco na janela...");

      const isValid = await validateSession();
      if (!isValid && redirectToLogin) {
        console.log("🚫 Sessão inválida após foco - redirecionando para login");
        router.push("/login");
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [
    isAuthenticated,
    validateSession,
    validateOnFocus,
    redirectToLogin,
    router,
  ]);

  // Função para renovar token manualmente
  const renewSession = useCallback(async (): Promise<boolean> => {
    try {
      console.log("🔄 Renovando sessão manualmente...");

      const newToken = await refreshToken();
      if (newToken) {
        console.log("✅ Sessão renovada com sucesso");
        return true;
      }

      console.log("❌ Falha na renovação da sessão");
      if (redirectToLogin) {
        router.push("/login");
      }
      return false;
    } catch (error) {
      console.error("❌ Erro na renovação da sessão:", error);
      if (redirectToLogin) {
        router.push("/login");
      }
      return false;
    }
  }, [refreshToken, redirectToLogin, router]);

  // Função para logout forçado
  const forceLogout = useCallback(
    async (reason?: string) => {
      await AuthClient.forceLogout(reason);
      if (redirectToLogin) {
        router.push("/login");
      }
    },
    [redirectToLogin, router]
  );

  return {
    isAuthenticated,
    renewSession,
    forceLogout,
  };
}
