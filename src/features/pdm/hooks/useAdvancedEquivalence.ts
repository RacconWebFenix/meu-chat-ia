/**
 * Advanced Equivalence hook following Single Responsibility Principle
 * Responsibility: Manage advanced equivalence interface state
 */

import { useState, useCallback, useMemo } from "react";
import {
  AdvancedEquivalenceState,
  EquivalenceFilters,
  SortCriteria,
} from "../types";
import { EquivalenceMatch } from "../types";

interface UseAdvancedEquivalenceReturn {
  readonly state: AdvancedEquivalenceState;
  readonly filteredMatches: readonly EquivalenceMatch[];
  readonly comparisonItems: readonly EquivalenceMatch[];
  readonly updateFilters: (filters: Partial<EquivalenceFilters>) => void;
  readonly setSortBy: (sort: SortCriteria) => void;
  readonly toggleItemSelection: (id: string) => void;
  readonly selectAll: () => void;
  readonly clearSelection: () => void;
  readonly toggleComparisonMode: () => void;
  readonly setViewMode: (mode: "grid" | "list" | "table") => void;
  readonly getSelectedMatches: () => readonly EquivalenceMatch[];
}

const DEFAULT_FILTERS: EquivalenceFilters = {
  scoreRange: { min: 0, max: 100 },
  manufacturers: [],
  categories: [],
  hasSpecifications: false,
  hasPDM: false,
};

const INITIAL_STATE: AdvancedEquivalenceState = {
  filters: DEFAULT_FILTERS,
  sortBy: SortCriteria.SCORE_DESC,
  selectedItems: [],
  comparisonMode: false,
  viewMode: "list",
};

export function useAdvancedEquivalence(
  matches: readonly EquivalenceMatch[]
): UseAdvancedEquivalenceReturn {
  const [state, setState] = useState<AdvancedEquivalenceState>(INITIAL_STATE);

  // Update filters
  const updateFilters = useCallback(
    (newFilters: Partial<EquivalenceFilters>) => {
      setState((prev) => ({
        ...prev,
        filters: {
          ...prev.filters,
          ...newFilters,
        },
      }));
    },
    []
  );

  // Set sort criteria
  const setSortBy = useCallback((sort: SortCriteria) => {
    setState((prev) => ({
      ...prev,
      sortBy: sort,
    }));
  }, []);

  // Toggle item selection
  const toggleItemSelection = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      selectedItems: prev.selectedItems.includes(id)
        ? prev.selectedItems.filter((item) => item !== id)
        : [...prev.selectedItems, id],
    }));
  }, []);

  // Select all items
  const selectAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedItems: matches.map((match) => match.id),
    }));
  }, [matches]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedItems: [],
    }));
  }, []);

  // Toggle comparison mode
  const toggleComparisonMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      comparisonMode: !prev.comparisonMode,
    }));
  }, []);

  // Set view mode
  const setViewMode = useCallback((mode: "grid" | "list" | "table") => {
    setState((prev) => ({
      ...prev,
      viewMode: mode,
    }));
  }, []);

  // Filter matches based on current filters
  const filteredMatches = useMemo(() => {
    let filtered = [...matches];

    // Score range filter
    filtered = filtered.filter((match) => {
      const score = match.matchScore * 100;
      return (
        score >= state.filters.scoreRange.min &&
        score <= state.filters.scoreRange.max
      );
    });

    // Manufacturer filter
    if (state.filters.manufacturers.length > 0) {
      filtered = filtered.filter(
        (match) =>
          match.marcaFabricante &&
          state.filters.manufacturers.includes(match.marcaFabricante)
      );
    }

    // Category filter
    if (state.filters.categories.length > 0) {
      filtered = filtered.filter((match) =>
        state.filters.categories.includes(match.categoria)
      );
    }

    // Has specifications filter
    if (state.filters.hasSpecifications) {
      filtered = filtered.filter(
        (match) =>
          match.especificacoesTecnicas &&
          Object.keys(match.especificacoesTecnicas).length > 0
      );
    }

    // Has PDM filter
    if (state.filters.hasPDM) {
      filtered = filtered.filter(
        (match) => match.pdmPadronizado && match.pdmPadronizado.length > 0
      );
    }

    // Sort filtered results
    return sortMatches(filtered, state.sortBy);
  }, [matches, state.filters, state.sortBy]);

  // ===================== CORREÇÃO 1: Bug de Recursão Infinita =====================
  const getSelectedMatches = useCallback((): readonly EquivalenceMatch[] => {
    // A função deve filtrar a lista de `matches`, não chamar a si mesma.
    return matches.filter((match) => state.selectedItems.includes(match.id));
  }, [matches, state.selectedItems]);
  // ==============================================================================

  // ===================== CORREÇÃO 2: Estrutura de Dados Incorreta =====================
  const comparisonItems = useMemo((): readonly EquivalenceMatch[] => {
    // A propriedade `comparisonItems` deve retornar um array de EquivalenceMatch.
    // Usamos a função `getSelectedMatches` (agora corrigida) que já faz isso.
    return getSelectedMatches();
  }, [getSelectedMatches]);

  return {
    state,
    filteredMatches,
    comparisonItems,
    updateFilters,
    setSortBy,
    toggleItemSelection,
    selectAll,
    clearSelection,
    toggleComparisonMode,
    setViewMode,
    getSelectedMatches,
  };
}

// Helper function to sort matches
function sortMatches(
  matches: readonly EquivalenceMatch[],
  sortBy: SortCriteria
): EquivalenceMatch[] {
  const sorted = [...matches];

  switch (sortBy) {
    case SortCriteria.SCORE_DESC:
      return sorted.sort((a, b) => b.matchScore - a.matchScore);

    case SortCriteria.SCORE_ASC:
      return sorted.sort((a, b) => a.matchScore - b.matchScore);

    case SortCriteria.NAME_ASC:
      return sorted.sort((a, b) => a.nome.localeCompare(b.nome));

    case SortCriteria.NAME_DESC:
      return sorted.sort((a, b) => b.nome.localeCompare(a.nome));

    case SortCriteria.MANUFACTURER_ASC:
      return sorted.sort((a, b) => {
        const aManufacturer = a.marcaFabricante || "";
        const bManufacturer = b.marcaFabricante || "";
        return aManufacturer.localeCompare(bManufacturer);
      });

    case SortCriteria.MANUFACTURER_DESC:
      return sorted.sort((a, b) => {
        const aManufacturer = a.marcaFabricante || "";
        const bManufacturer = b.marcaFabricante || "";
        return bManufacturer.localeCompare(aManufacturer);
      });

    case SortCriteria.CATEGORY_ASC:
      return sorted.sort((a, b) => a.categoria.localeCompare(b.categoria));

    default:
      return sorted;
  }
}
