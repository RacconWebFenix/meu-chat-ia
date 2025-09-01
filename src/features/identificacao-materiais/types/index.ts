/**
 * Types for Material Identification feature
 * Following Single Responsibility Principle
 */

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
      especificacoesTecnicas: {
        resumoPDM: string;
        especificacoesTecnicas: {
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
