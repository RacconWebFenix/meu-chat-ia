/**
 * Types for Equivalence Identification API
 * Following Single Responsibility Principle
 */

export interface EquivalenceSearchRequest {
  nome: string;
  marcaFabricante: string;
  categoria: string;
  subcategoria: string;
  especificacoesTecnicas: Record<string, string | number | null>;
  aplicacao: string;
  unidadeMedida: string;
  breveDescricao: string;
  normas: string[];
  imagens: Array<{
    image_url: string;
    origin_url: string;
    height: number;
    width: number;
  }>;
}

export interface EquivalenceSearchResponse {
  equivalencias: Array<{
    nome: string;
    fabricante: string;
    NCM: string;
    referencia: string;
    tipo_de_unidade: string;
    caracteristicas: Array<Record<string, string>>;
    imagens: Array<{
      image_url: string;
      origin_url: string;
      height: number;
      width: number;
    }>;
    citacoes: Array<{
      title: string;
      url: string;
      date: string | null;
      last_updated: string | null;
      snippet: string;
    }>;
  }>;
}

export interface EquivalenceApiResponse {
  equivalencias: EquivalenceSearchResponse[];
}
