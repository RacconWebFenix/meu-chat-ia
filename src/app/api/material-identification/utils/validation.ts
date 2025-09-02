/**
 * Validation utilities for Material Identification API
 * Following Single Responsibility Principle
 */

import { EnrichmentRequest } from "../types";

export const validateEnrichmentRequest = (req: EnrichmentRequest): boolean => {
  // At least one field must be provided, similar to mock validation
  return !!(
    req.nome ||
    req.caracteristicas ||
    req.fabricanteMarca ||
    req.referencia
  );
};

export const sanitizeInput = (input: string): string => {
  // Basic sanitization: trim and remove potential script tags
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
};
