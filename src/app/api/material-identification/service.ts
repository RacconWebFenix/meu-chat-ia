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
  private readonly equivalenceCrossUrl: string;

  constructor(n8nUrl?: string) {
    this.n8nUrl =
      n8nUrl ||
      process.env.NEXT_PUBLIC_N8N_MATERIAL_IDENTIFICATION_WEBHOOK_URL ||
      "";
    this.equivalenceCrossUrl = this.n8nUrl; // Use the same URL for both
  }

  async enrichData(req: EnrichmentRequest): Promise<EnrichmentResponse> {
    try {
      // Choose webhook URL based on whether referencia has a value
      const webhookUrl =
        req.referencia && req.referencia.trim() !== ""
          ? this.equivalenceCrossUrl
          : this.n8nUrl;

      // Send in the format expected by N8N webhook
      const n8nPayload = {
        headers: {
          "content-type": "application/json",
          "user-agent": "axios/1.11.0",
        },
        params: {},
        query: {},
        body: req,
        webhookUrl,
        executionMode: "production",
      };

      const response = await axios.post(webhookUrl, n8nPayload, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 80000, // Match N8N timeout
      });

      console.log("N8N raw response:", JSON.stringify(response.data, null, 2));
      const parsed = parseN8NResponse(response.data);
      if (!parsed) {
        throw new Error("Failed to parse N8N response");
      }

      return parsed;
    } catch (error) {
      console.error("Error calling N8N:", error);
      // No fallback, throw error
      throw new Error("Failed to enrich data from N8N");
    }
  }
}
