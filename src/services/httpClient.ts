// src/services/httpClient.ts
import { getSession } from "next-auth/react";
import { AuthClient } from "@/lib/authClient";

interface HttpClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
}

interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
}

export class HttpClient {
  private config: HttpClientConfig;
  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;

  constructor(config: HttpClientConfig) {
    this.config = config;
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      const session = await getSession();
      // NextAuth armazena o token JWT no token.sub ou podemos usar getToken
      return session?.user?.id || null;
    } catch (error) {
      console.error("Erro ao obter token de autenticação:", error);
      return null;
    }
  }

  private async refreshAuthToken(): Promise<string | null> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = AuthClient.refreshToken();

    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private createRequestConfig(
    url: string,
    config: RequestConfig = {}
  ): RequestInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...config.headers,
    };

    const requestConfig: RequestInit = {
      method: config.method || "GET",
      headers,
      signal: config.timeout
        ? AbortSignal.timeout(config.timeout)
        : AbortSignal.timeout(this.config.timeout),
    };

    if (
      config.body &&
      (config.method === "POST" ||
        config.method === "PUT" ||
        config.method === "PATCH")
    ) {
      requestConfig.body = JSON.stringify(config.body);
    }

    return requestConfig;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type");

    let data: T;
    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = (await response.text()) as T;
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  }

  private createApiError(response: Response, message?: string): ApiError {
    return {
      message: message || `HTTP ${response.status}: ${response.statusText}`,
      status: response.status,
      code: response.statusText,
    };
  }

  async request<T = unknown>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`;
    let requestConfig = this.createRequestConfig(url, config);

    // Adicionar token de autenticação se disponível
    const token = await this.getAuthToken();
    if (token) {
      requestConfig.headers = {
        ...requestConfig.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    let response = await fetch(url, requestConfig);

    // Se receber 401, tentar refresh do token
    if (response.status === 401 && token) {
      console.log("🔄 Token expirado, tentando refresh...");

      const newToken = await this.refreshAuthToken();
      if (newToken) {
        console.log("✅ Token renovado com sucesso");

        // Refazer a requisição com o novo token
        requestConfig.headers = {
          ...requestConfig.headers,
          Authorization: `Bearer ${newToken}`,
        };

        response = await fetch(url, requestConfig);
      } else {
        console.log("❌ Falha no refresh do token, redirecionando para login");
        // Redirecionar para login se refresh falhar
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw this.createApiError(response, "Sessão expirada");
      }
    }

    if (!response.ok) {
      const error = this.createApiError(response);
      throw error;
    }

    return this.handleResponse<T>(response);
  }

  // Métodos convenientes
  async get<T = unknown>(
    endpoint: string,
    config?: Omit<RequestConfig, "method">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: Omit<RequestConfig, "method">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "POST", body: data });
  }

  async put<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: Omit<RequestConfig, "method">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "PUT", body: data });
  }

  async delete<T = unknown>(
    endpoint: string,
    config?: Omit<RequestConfig, "method">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }
}

// Instância padrão do cliente HTTP
export const httpClient = new HttpClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  timeout: 30000, // 30 segundos
  retries: 3,
});
