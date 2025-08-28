/**
 * Field Selection types following Interface Segregation Principle
 */

// Campos selecionados para busca de equivalência
export interface SelectedFields {
  readonly categoria: boolean;
  readonly subcategoria: boolean;
  readonly especificacoesTecnicas: readonly string[];
  readonly aplicacao: boolean;
  readonly normas: boolean;
}

// Critérios de busca para equivalência
export interface EquivalenceSearchCriteria {
  readonly selectedFields: SelectedFields;
  readonly originalData: {
    readonly categoria?: string;
    readonly subcategoria?: string;
    readonly aplicacao?: string;
    readonly normas?: readonly string[];
    readonly especificacoesTecnicas?: Record<string, string>;
  };
  readonly searchMode: "exact" | "fuzzy" | "partial";
  readonly maxResults: number;
}

// Resultado individual de equivalência
export interface EquivalenceMatch {
  readonly id: string;
  readonly nome: string;
  readonly referencia?: string;
  readonly marcaFabricante?: string;
  readonly categoria: string;
  readonly subcategoria?: string;
  readonly especificacoesTecnicas?: Record<string, string>;
  readonly matchScore: number; // 0-1 score de similaridade
  readonly matchedFields: readonly string[]; // Campos que fizeram match
  readonly pdmPadronizado?: string;
}

// Response da busca de equivalência
export interface EquivalenceSearchResponse {
  readonly searchCriteria: EquivalenceSearchCriteria;
  readonly matches: readonly EquivalenceMatch[];
  readonly totalFound: number;
  readonly searchDuration: number; // em milissegundos
  readonly suggestions?: readonly string[]; // Sugestões se poucos resultados
}
