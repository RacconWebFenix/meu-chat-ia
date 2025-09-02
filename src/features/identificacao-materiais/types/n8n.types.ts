/**
 * N8N API Types
 * Types for N8N API integration
 */

// HTTP Client abstraction
export interface HttpClient {
  post<TRequest, TResponse>(
    endpoint: string,
    data: TRequest
  ): Promise<TResponse>;
}

// Material Identification API
export interface N8NMaterialIdentificationRequest {
  nome: string;
  caracteristicas: string;
  fabricanteMarca: string;
  referencia: string;
}

export interface N8NMaterialIdentificationResponse {
  success: boolean;
  data: {
    response: {
      original: {
        informacoes: string;
      };
      enriched: {
        categoria: string;
        subcategoria: string;
        marcaFabricante: string;
        especificacoesTecnicas: {
          resumoPDM: string;
          especificacoesTecnicas: {
            nomeProduto: string;
            fabricante: string;
            referenciaEncontrada: string;
            ncm: string;
            unidadeMedida: string;
            diametroInternoMm: number;
            diametroExternoMm: number;
            larguraMm: number;
            materialGaiola: string;
            tipoVedacao: string;
            capacidadeCargaDinamicaKn: number;
            velocidadeMaximaRpm: number;
          };
        };
        imagens: Array<{
          image_url: string;
          origin_url: string;
          height: number;
          width: number;
        }>;
      };
      metrics: {
        confidence: number;
        source: string;
      };
      suggestions: string[];
      warnings: string[];
    };
  };
  message: string;
}

export interface N8NMaterialIdentificationApi {
  identifyMaterial(
    request: N8NMaterialIdentificationRequest
  ): Promise<N8NMaterialIdentificationResponse>;
}

// Equivalence Search API
export interface N8NEquivalenceSearchRequest {
  produto: string;
  especificacoes: Record<string, string | number>;
  criteriosBusca: {
    fabricante: string;
    categoria: string;
    subcategoria: string;
  };
}

export interface N8NEquivalenceSearchResponse {
  success: boolean;
  data: {
    equivalencias: Array<{
      nome: string;
      fabricante: string;
      referencia: string;
      ncm: string;
      unidade: string;
      caracteristicas: Record<string, string | number>;
      imagens: Array<{
        image_url: string;
        origin_url: string;
        width: number;
        height: number;
      }>;
      citacoes: Array<{
        title: string;
        url: string;
      }>;
    }>;
    metadata: {
      totalEncontrados: number;
      fonteDados: string;
      dataConsulta: string;
    };
  };
  message: string;
}

export interface N8NEquivalenceSearchApi {
  searchEquivalences(
    request: N8NEquivalenceSearchRequest
  ): Promise<N8NEquivalenceSearchResponse>;
}

// Error types
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public response?: unknown
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export interface N8NApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
