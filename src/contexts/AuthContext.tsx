// src/contexts/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  AuthContextType,
  AuthState,
  User,
  LoginCredentials,
  ApiError,
} from "@/types/auth.types";
import { AuthClient } from "@/lib/authClient";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.ok) {
        // Recarregar sessão após login bem-sucedido
        await validateInitialSession();
        return true;
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Credenciais inválidas",
        }));
        return false;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro no login";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    await handleLogout("Logout solicitado pelo usuário");
  };

  const handleLogout = useCallback(
    async (reason: string): Promise<void> => {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));

        // Logout forçado com limpeza
        await AuthClient.forceLogout(reason);

        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });

        router.push("/login");
      } catch (error) {
        console.error("Erro no logout:", error);
        // Mesmo com erro, limpar estado local
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        router.push("/login");
      }
    },
    [router]
  );

  const validateInitialSession = useCallback(async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const session = await getSession();

      if (session?.user) {
        // Validar token no backend
        const isValidToken = await AuthClient.validateToken();

        if (isValidToken) {
          const user: User = {
            id: session.user.id || "",
            name: session.user.name || "",
            username: (session.user as { username?: string }).username || "",
            email: session.user.email || undefined,
          };

          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          // Token inválido - fazer logout
          await handleLogout("Token inválido ou expirado");
        }
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error("Erro na validação inicial:", error);
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro na validação da sessão",
      });
    }
  }, [handleLogout]);

  // Validação inicial da sessão
  useEffect(() => {
    validateInitialSession();
  }, [validateInitialSession]);

  const refreshToken = async (): Promise<boolean> => {
    try {
      const newToken = await AuthClient.refreshToken();

      if (newToken) {
        // Revalidar sessão após refresh
        await validateInitialSession();
        return true;
      }

      return false;
    } catch (error) {
      console.error("Erro no refresh token:", error);
      return false;
    }
  };

  const validateSession = async (): Promise<boolean> => {
    try {
      const isValid = await AuthClient.validateToken();

      if (!isValid) {
        await handleLogout("Sessão inválida");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro na validação da sessão:", error);
      await handleLogout("Erro na validação da sessão");
      return false;
    }
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    refreshToken,
    validateSession,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}
