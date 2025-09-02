/**
 * N8N HTTP Client
 * Generic HTTP client for N8N API calls
 */

import { HttpClient, HttpError } from "../types/n8n.types";

export class N8NHttpClient implements HttpClient {
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(baseUrl: string, timeout: number = 30000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  async post<TRequest, TResponse>(
    endpoint: string,
    data: TRequest
  ): Promise<TResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new HttpError(
          response.status,
          `HTTP ${response.status}: ${response.statusText}`,
          await response.text().catch(() => undefined)
        );
      }

      const result = await response.json();
      return result as TResponse;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof HttpError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new HttpError(408, "Request timeout");
        }
        throw new HttpError(0, `Network error: ${error.message}`);
      }

      throw new HttpError(0, "Unknown error occurred");
    }
  }
}
