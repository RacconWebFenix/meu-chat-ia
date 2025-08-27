/**
 * Tipos da interface de equivalência avançada.
 */

import { EquivalenceMatch } from "./fieldSelection.types";

// Filtros avançados para refinamento
export interface EquivalenceFilters {
  // CORREÇÃO: Adicionada a propriedade para a busca por texto.
  readonly searchTerm?: string;
  readonly scoreRange: {
    readonly min: number;
    readonly max: number;
  };
  readonly manufacturers: readonly string[];
  readonly categories: readonly string[];
  readonly hasSpecifications: boolean;
  readonly hasPDM: boolean;
}

// Critérios de ordenação
export enum SortCriteria {
  SCORE_DESC = "score_desc",
  SCORE_ASC = "score_asc",
  NAME_ASC = "name_asc",
  NAME_DESC = "name_desc",
  MANUFACTURER_ASC = "manufacturer_asc",
  MANUFACTURER_DESC = "manufacturer_desc",
  CATEGORY_ASC = "category_asc",
}

// Estado da interface avançada
export interface AdvancedEquivalenceState {
  readonly filters: EquivalenceFilters;
  readonly sortBy: SortCriteria;
  readonly selectedItems: readonly string[]; // IDs dos itens selecionados
  readonly comparisonMode: boolean;
  readonly viewMode: "grid" | "list" | "table";
}
