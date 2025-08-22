/**
 * Advanced equivalence interface types following Interface Segregation Principle
 */

import { EquivalenceMatch } from "./fieldSelection.types";

// Filtros avançados para refinamento
export interface EquivalenceFilters {
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

// Item selecionado para comparação
export interface ComparisonItem {
  readonly match: EquivalenceMatch;
  readonly selected: boolean;
  readonly notes?: string;
}

// Dados para exportação
export interface ExportData {
  readonly selectedMatches: readonly EquivalenceMatch[];
  readonly searchCriteria: any; // Para referência
  readonly exportFormat: "excel" | "csv" | "pdf";
  readonly includeSpecs: boolean;
  readonly includePDM: boolean;
}
