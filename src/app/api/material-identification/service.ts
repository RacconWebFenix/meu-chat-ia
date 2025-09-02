/**
 * Material Identification Service
 * Following Dependency Inversion Principle
 */

import axios from "axios";
import { EnrichmentRequest, EnrichmentResponse, N8NPayload } from "./types";
import { mapToN8NPayload, parseN8NResponse } from "./utils";

export interface IMaterialIdentificationService {
  enrichData(req: EnrichmentRequest): Promise<EnrichmentResponse>;
}

export class MaterialIdentificationService
  implements IMaterialIdentificationService
{
  private readonly n8nUrl: string;

  constructor(n8nUrl?: string) {
    this.n8nUrl = n8nUrl || "https://n8n.cib2b.com.br/webhook/enrichmentdata";
  }

  async enrichData(req: EnrichmentRequest): Promise<EnrichmentResponse> {
    try {
      const payload: N8NPayload = mapToN8NPayload(req);

      const response = await axios.post(this.n8nUrl, payload, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 80000, // Match N8N timeout
      });

      const parsed = parseN8NResponse(response.data);
      if (!parsed) {
        throw new Error("Failed to parse N8N response");
      }

      return parsed;
    } catch (error) {
      console.error("Error calling N8N:", error);
      // Fallback to mock or throw error
      throw new Error("Failed to enrich data from N8N");
    }
  }
}
