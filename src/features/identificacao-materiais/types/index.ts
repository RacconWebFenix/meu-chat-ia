/**
 * Types for Material Identification feature
 * Following Single Responsibility Principle
 */

// Tipo para especificações técnicas dinâmicas
export type EspecificacoesTecnicasDinamicas = Record<
  string,
  string | number | null
>;

// Existing types...
export interface MaterialSearchData {
  nome: string;
  caracteristicas: string;
  fabricanteMarca: string;
  referencia: string;
}

export interface MaterialIdentificationResult {
  response: {
    original: {
      informacoes: string;
    };
    enriched: {
      categoria: string;
      subcategoria: string;
      marcaFabricante: string;
      nomeProdutoEncontrado: string;
      especificacoesTecnicas: {
        resumoPDM: string;
        especificacoesTecnicas: EspecificacoesTecnicasDinamicas;
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
}

export interface MaterialIdentificationState {
  isLoading: boolean;
  searchData: MaterialSearchData;
  result: MaterialIdentificationResult | null;
  error: string | null;
}

export interface MaterialIdentificationService {
  identifyMaterial(
    searchData: MaterialSearchData
  ): Promise<MaterialIdentificationResult>;
}

export interface EquivalenceSearchData {
  nome: string;
  marcaFabricante: string;
  categoria: string;
  subcategoria: string;
  especificacoesTecnicas: EspecificacoesTecnicasDinamicas;
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

export interface EquivalenceResult {
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
}

export interface EquivalenceSearchResult {
  equivalencias: EquivalenceResult[];
}

export interface EquivalenceSearchState {
  isLoading: boolean;
  results: EquivalenceSearchResult | null;
  error: string | null;
}

export interface EquivalenceSearchService {
  searchEquivalences(
    searchData: EquivalenceSearchData
  ): Promise<EquivalenceSearchResult>;
}
