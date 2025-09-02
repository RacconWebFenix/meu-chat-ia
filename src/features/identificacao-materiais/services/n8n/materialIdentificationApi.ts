/**
 * N8N Material Identification API Implementation
 */

import {
  N8NMaterialIdentificationApi,
  N8NMaterialIdentificationRequest,
  N8NMaterialIdentificationResponse,
  HttpClient,
  HttpError,
} from "../../types/n8n.types";

export class N8NMaterialIdentificationApiImpl
  implements N8NMaterialIdentificationApi
{
  constructor(private readonly httpClient: HttpClient) {}

  async identifyMaterial(
    request: N8NMaterialIdentificationRequest
  ): Promise<N8NMaterialIdentificationResponse> {
    try {
      return await this.httpClient.post<
        N8NMaterialIdentificationRequest,
        N8NMaterialIdentificationResponse
      >("/n8n/material-identification", request);
    } catch (error) {
      if (error instanceof HttpError) {
        throw new Error(`Falha na identificação do material: ${error.message}`);
      }
      throw new Error(
        `Erro desconhecido na identificação do material: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }
}
