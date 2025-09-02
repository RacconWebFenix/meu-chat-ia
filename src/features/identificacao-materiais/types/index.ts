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

export interface MaterialIdentificationUI {
  onSearch(searchData: MaterialSearchData): void;
  onReset(): void;
}
