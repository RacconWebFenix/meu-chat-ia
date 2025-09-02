/**
 * Equivalence Identification Service
 * Following Single Responsibility Principle
 */

import { EquivalenceSearchRequest, EquivalenceSearchResponse } from "./types";

export class EquivalenceIdentificationService {
  private readonly n8nWebhookUrl: string;

  constructor() {
    this.n8nWebhookUrl =
      process.env.NEXT_PUBLIC_N8N_EQUIVALENCE_WEBHOOK_URL || "";
    if (!this.n8nWebhookUrl) {
      throw new Error(
        "N8N_EQUIVALENCE_WEBHOOK_URL environment variable is not set"
      );
    }
  }

  async searchEquivalences(
    searchData: EquivalenceSearchRequest
  ): Promise<EquivalenceSearchResponse> {
    try {
      console.log("Making request to N8N webhook:", this.n8nWebhookUrl);
      console.log("Request payload:", JSON.stringify(searchData, null, 2));

      const response = await fetch(this.n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchData),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("N8N webhook error response:", errorText);
        throw new Error(`N8N webhook error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("N8N Response received:", JSON.stringify(data, null, 2));
      console.log("N8N Response type:", typeof data);
      console.log("N8N Response isArray:", Array.isArray(data));

      // Transform the N8N response to our expected format
      return this.transformN8nResponse(data);
    } catch (error) {
      console.error("Erro na busca de equivalências:", error);
      throw new Error(
        `Falha na busca de equivalências: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  private transformN8nResponse(
    n8nResponse: unknown
  ): EquivalenceSearchResponse {
    console.log(
      "Transforming N8N response:",
      JSON.stringify(n8nResponse, null, 2)
    );

    // Handle different possible N8N response formats
    if (!n8nResponse) {
      console.error("N8N response is null or undefined");
      throw new Error("Empty N8N response");
    }

    // Check if it's already the expected format (object with equivalencias property)
    if (
      typeof n8nResponse === "object" &&
      n8nResponse !== null &&
      "equivalencias" in n8nResponse
    ) {
      console.log("Response is already in expected format");
      return n8nResponse as EquivalenceSearchResponse;
    }

    // Check if it's an array with the expected structure
    if (Array.isArray(n8nResponse)) {
      console.log("Response is an array, extracting first item");
      const equivalencesData = n8nResponse[0];

      if (!equivalencesData || !equivalencesData.equivalencias) {
        console.error(
          "No equivalences found in array response:",
          equivalencesData
        );
        throw new Error("No equivalences found in N8N response");
      }

      return equivalencesData;
    }

    // If it's an object but doesn't have equivalencias directly, try to find it
    if (typeof n8nResponse === "object" && n8nResponse !== null) {
      const responseObj = n8nResponse as Record<string, unknown>;

      // Look for equivalencias in nested structure
      if (
        responseObj.equivalencias &&
        Array.isArray(responseObj.equivalencias)
      ) {
        console.log("Found equivalencias in object response");
        return responseObj as unknown as EquivalenceSearchResponse;
      }

      // Check if there's a data property that contains equivalencias
      if (
        responseObj.data &&
        typeof responseObj.data === "object" &&
        "equivalencias" in responseObj.data
      ) {
        console.log("Found equivalencias in data property");
        return responseObj.data as unknown as EquivalenceSearchResponse;
      }
    }

    console.error("Unexpected N8N response format:", n8nResponse);
    throw new Error("Invalid N8N response format - unexpected structure");
  }
}

// Factory function following Dependency Inversion
export const createEquivalenceIdentificationService =
  (): EquivalenceIdentificationService => {
    return new EquivalenceIdentificationService();
  };
