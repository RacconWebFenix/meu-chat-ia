/**
 * Request types for Material Identification API
 * Following Interface Segregation Principle
 */

export interface EnrichmentRequest {
  nome?: string;
  caracteristicas?: string;
  fabricanteMarca?: string;
  referencia?: string;
}

export interface N8NPayload {
  body: EnrichmentRequest;
}
