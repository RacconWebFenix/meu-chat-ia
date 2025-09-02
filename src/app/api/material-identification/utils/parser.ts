/**
 * Parser utilities for Material Identification API
 * Following Single Responsibility Principle
 */

import {
  EnrichmentRequest,
  N8NPayload,
  EnrichmentResponse,
  N8NResponse,
  N8NResponseArray,
} from "../types";

export const mapToN8NPayload = (req: EnrichmentRequest): N8NPayload => {
  return {
    body: req,
  };
};

export const parseN8NResponse = (
  raw: N8NResponse | N8NResponseArray
): EnrichmentResponse | null => {
  try {
    let data: unknown;

    // Handle array response from N8N
    if (Array.isArray(raw)) {
      data = raw[0]; // Get first item from array
    } else {
      data = raw;
    }

    // The response is already in the correct format, just validate and return
    if (data && typeof data === "object" && "response" in data) {
      const responseData = data as unknown as EnrichmentResponse;
      // Validate required fields
      if (responseData.response && responseData.response.enriched) {
        return responseData;
      }
    }
    throw new Error("Invalid response format from N8N");
  } catch (error) {
    console.error("Error parsing N8N response:", error);
    return null;
  }
};
