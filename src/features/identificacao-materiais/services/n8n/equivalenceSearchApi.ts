/**
 * N8N Equivalence Search API Implementation
 */

import {
  N8NEquivalenceSearchApi,
  N8NEquivalenceSearchRequest,
  N8NEquivalenceSearchResponse,
  HttpClient,
  HttpError,
} from "../../types/n8n.types";

export class N8NEquivalenceSearchApiImpl implements N8NEquivalenceSearchApi {
  constructor(private readonly httpClient: HttpClient) {}

  async searchEquivalences(
    request: N8NEquivalenceSearchRequest
  ): Promise<N8NEquivalenceSearchResponse> {
    try {
      return await this.httpClient.post<
        N8NEquivalenceSearchRequest,
        N8NEquivalenceSearchResponse
      >("/n8n/equivalence-search", request);
    } catch (error) {
      if (error instanceof HttpError) {
        throw new Error(`Falha na busca de equivalências: ${error.message}`);
      }
      throw new Error(
        `Erro desconhecido na busca de equivalências: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }
}
