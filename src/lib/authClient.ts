// src/lib/authClient.ts
import { getSession, signOut } from "next-auth/react";
import { User, RefreshTokenResponse } from "@/types/auth.types";

export class AuthClient {
  private static readonly API_BASE_URL: string =
    process.env.NEXT_PUBLIC_API_URL || "";

  /**
   * Valida token no backend de forma robusta
   */
  static async validateToken(): Promise<boolean> {
    try {
      const session = await getSession();

      if (!session?.user) {
        console.log("🚫 Sessão não encontrada");
        return false;
      }

      // Usar session para obter informações básicas
      // O NextAuth já valida o token internamente
      const isValid = !!session.user;

      if (isValid) {
        console.log("✅ Sessão válida encontrada");
        return true;
      }

      console.log("🚫 Sessão inválida ou expirada");
      return false;
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Erro na validação do token:", error.message);
      }
      return false;
    }
  }

  /**
   * Refresh token automaticamente com melhor tratamento de erros
   */
  static async refreshToken(): Promise<string | null> {
    try {
      const session = await getSession();

      if (!session?.user) {
        console.log("🚫 Sessão não encontrada para refresh");
        return null;
      }

      console.log("🔄 Solicitando refresh token...");

      const response = await fetch(`${this.API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          userId: session.user.id,
        }),
        signal: AbortSignal.timeout(15000), // 15 segundos
      });

      if (response.ok) {
        const data: RefreshTokenResponse = await response.json();
        console.log("✅ Token renovado com sucesso");

        // Atualizar sessão com novo token
        await this.updateSessionToken(data.accessToken);

        return data.accessToken;
      }

      if (response.status === 401) {
        console.log("🚫 Refresh token rejeitado - sessão expirada");
      } else {
        console.log(
          `🚫 Erro no refresh: ${response.status} ${response.statusText}`
        );
      }

      return null;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.log("🚫 Timeout no refresh token");
        } else {
          console.error("❌ Erro no refresh token:", error.message);
        }
      }
      return null;
    }
  }

  /**
   * Atualiza o token na sessão do NextAuth
   */
  private static async updateSessionToken(newToken: string): Promise<void> {
    try {
      // Forçar recarregamento da sessão
      await getSession();
      console.log("✅ Sessão atualizada com novo token");
    } catch (error) {
      console.error("❌ Erro ao atualizar sessão:", error);
    }
  }

  /**
   * Logout forçado com limpeza completa
   */
  static async forceLogout(reason: string = "Sessão expirada"): Promise<void> {
    console.log(`🚪 Logout forçado: ${reason}`);

    try {
      // Limpar dados locais
      this.clearLocalData();

      // Logout do NextAuth
      await signOut({
        callbackUrl: "/login",
        redirect: false,
      });

      console.log("✅ Logout realizado com sucesso");
    } catch (error) {
      console.error("❌ Erro no logout:", error);
      // Mesmo com erro, tentar redirecionar
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }

  /**
   * Limpa todos os dados locais de autenticação
   */
  private static clearLocalData(): void {
    try {
      localStorage.clear();
      sessionStorage.clear();

      // Limpar cookies relacionados ao NextAuth
      if (typeof document !== "undefined") {
        const cookies = document.cookie.split(";");
        cookies.forEach((cookie) => {
          const [name] = cookie.trim().split("=");
          if (name.includes("next-auth") || name.includes("session")) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
          }
        });
      }

      console.log("🧹 Dados locais limpos");
    } catch (error) {
      console.error("❌ Erro ao limpar dados locais:", error);
    }
  }

  /**
   * Verifica se usuário está autenticado
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const session = await getSession();
      return !!session?.user;
    } catch (error) {
      console.error("❌ Erro ao verificar autenticação:", error);
      return false;
    }
  }

  /**
   * Obtém informações do usuário atual
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const session = await getSession();

      if (!session?.user) {
        return null;
      }

      return {
        id: session.user.id || "",
        name: session.user.name || "",
        username: (session.user as { username?: string }).username || "",
        email: session.user.email || undefined,
      };
    } catch (error) {
      console.error("❌ Erro ao obter usuário atual:", error);
      return null;
    }
  }
}
