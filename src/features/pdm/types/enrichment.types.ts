/**
 * Tipos de enriquecimento, seguindo o Princípio da Segregação de Interfaces.
 */

import { BaseProductInfo, ConfidenceMetrics } from "./base.types";

// Interface para uma única especificação técnica.
// Adicionamos um ID para permitir a manipulação segura em listas React.
export interface Specification {
  readonly id: string; // Ex: um UUID gerado no momento da criação
  readonly key: string; // Ex: "Conectividade"
  readonly value: string; // Ex: "Sem Fio"
}

// Responsabilidade Única: Lidar com a requisição de enriquecimento
export interface EnrichmentRequest {
  readonly productInfo: BaseProductInfo;
  readonly options?: EnrichmentOptions;
}

// Responsabilidade Única: Lidar com a configuração do enriquecimento
export interface EnrichmentOptions {
  readonly prioritizeManufacturer?: boolean;
  readonly includeAlternatives?: boolean;
}

// Responsabilidade Única: Lidar com os dados do produto enriquecido
export interface EnrichedProductData {
  readonly categoria: string;
  readonly subcategoria?: string;
  // CORREÇÃO: Estrutura alterada para suportar tanto array quanto objeto (compatibilidade API real)
  readonly especificacoesTecnicas: Specification[] | Record<string, string>;
  readonly aplicacao?: string;
  readonly normas?: string[];
  readonly pdmPadronizado: string;
}

// Responsabilidade Única: Lidar com a resposta do enriquecimento
export interface EnrichmentResponse {
  readonly original: BaseProductInfo;
  readonly enriched: EnrichedProductData;
  readonly metrics: ConfidenceMetrics;
  readonly suggestions?: EnrichmentSuggestion[];
  readonly warnings?: string[];
}

// Responsabilidade Única: Lidar com as sugestões da IA
export interface EnrichmentSuggestion {
  readonly field: string;
  readonly suggestedValue: string;
  readonly confidence: number;
  readonly reason: string;
}

// Responsabilidade Única: Lidar com o contrato do serviço de enriquecimento
export interface EnrichmentService {
  enrichProduct(request: EnrichmentRequest): Promise<EnrichmentResponse>;
  isManufacturerSupported(manufacturer: string): boolean;
  getSupportedCategories(): string[];
}
