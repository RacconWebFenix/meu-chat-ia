/**
 * Parser utilities for Material Identification API
 * Following Single Responsibility Principle
 */

import {
  EnrichmentRequest,
  N8NPayload,
  EnrichmentResponse,
  N8NResponse,
} from "../types";

export const mapToN8NPayload = (req: EnrichmentRequest): N8NPayload => {
  return {
    body: req,
  };
};

export const parseN8NResponse = (
  raw: N8NResponse
): EnrichmentResponse | null => {
  try {
    // Extract JSON from raw response, similar to N8N Code node
    const jsonMatch = raw.output?.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in N8N response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Map to EnrichmentResponse format
    return {
      response: {
        original: parsed.original || {},
        enriched: {
          categoria: parsed.categoria,
          subcategoria: parsed.subcategoria,
          marcaFabricante: parsed.marcaFabricante,
          nomeProdutoEncontrado: parsed.nomeProdutoEncontrado,
          especificacoesTecnicas: {
            resumoPDM: parsed.resumoPDM,
            especificacoesTecnicas: parsed.especificacoesTecnicas || {},
          },
          imagens: parsed.imagens || [],
        },
        metrics: {
          confidence: parsed.confidence || 0.95,
          source: "AI_ENRICHMENT",
        },
        suggestions: parsed.suggestions || [],
        warnings: parsed.warnings || [],
      },
    };
  } catch (error) {
    console.error("Error parsing N8N response:", error);
    return null;
  }
};
