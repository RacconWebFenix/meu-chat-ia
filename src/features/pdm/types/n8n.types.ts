/**
 * Tipos para integração com N8N - Equivalências avançadas
 */

import { BaseProductInfo } from "./base.types";

// Tipos auxiliares para dados do N8N
export interface Citation {
  readonly title: string;
  readonly url: string;
  readonly date?: string;
  readonly last_updated?: string;
}

export interface SearchResult {
  readonly title: string;
  readonly url: string;
  readonly date?: string;
  readonly last_updated?: string;
}

export interface ImageData {
  readonly image_url: string;
  readonly origin_url: string;
  readonly height: number;
  readonly width: number;
}

// Equivalência individual do N8N
export interface N8NEquivalence {
  readonly id: string;
  readonly nome: string;
  readonly marcaFabricante: string;
  readonly especificacoesTecnicas: Record<string, unknown>;
  readonly categoria: string;
  readonly subcategoria: string;
  readonly aplicacao: string;
  readonly precoEstimado: {
    readonly valor: number;
    readonly moeda: string;
    readonly observacao: string;
  };
  readonly disponibilidade: string;
  readonly fornecedoresSugeridos: readonly string[];
  readonly justificativa: string;
  readonly grauSimilaridade: number;
  readonly camposEspecificos: Record<string, unknown>;
  readonly citations: readonly Citation[];
  readonly searchResults: readonly SearchResult[];
  readonly images: readonly ImageData[];
  readonly disponibilidadeTexto: string;
  readonly precoFormatado: string;
}

// Metadados da resposta do N8N
export interface N8NMetadata {
  readonly tempoProcessamento: number;
  readonly modeloIAUsado: string;
  readonly criteriosBuscaAplicados: readonly string[];
  readonly observacoesGerais: string;
  readonly totalEquivalencias: number;
  readonly fonteDados: string;
  readonly timestamp: string;
  readonly debug: {
    readonly totalCitations: number;
    readonly totalSearchResults: number;
    readonly totalImages: number;
  };
}

// Dados brutos do N8N
export interface N8NRawData {
  readonly citations: readonly string[];
  readonly searchResults: readonly SearchResult[];
  readonly images: readonly ImageData[];
}

// Response completa do N8N
export interface N8NEquivalenceResponse {
  readonly equivalencias: readonly N8NEquivalence[];
  readonly metadata: N8NMetadata;
  readonly rawData: N8NRawData;
}

// Serviço para integração com N8N
export interface N8NEquivalenceService {
  searchEquivalents(
    productInfo: BaseProductInfo
  ): Promise<N8NEquivalenceResponse>;
  isServiceAvailable(): boolean;
}

// Estado do componente de resultados
export interface N8NEquivalenceState {
  readonly selectedIds: readonly string[];
  readonly comparisonMode: boolean;
  readonly viewMode: "cards" | "table";
  readonly sortBy: "similarity" | "price" | "name";
  readonly sortOrder: "asc" | "desc";
}
