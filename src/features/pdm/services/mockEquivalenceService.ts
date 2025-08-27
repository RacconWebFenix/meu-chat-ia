/**
 * Mock Equivalence Service following SOLID principles
 * Single Responsibility: Handle equivalence search simulation
 */

import {
  EquivalenceSearchCriteria,
  EquivalenceSearchResponse,
  EquivalenceMatch,
  SelectedFields,
} from "../types/fieldSelection.types";
import { EnrichmentResponse } from "../types/enrichment.types";

// Interface following Dependency Inversion
export interface EquivalenceService {
  searchEquivalents(
    criteria: EquivalenceSearchCriteria
  ): Promise<EquivalenceSearchResponse>;
  isServiceAvailable(): boolean;
}

// Mock database for equivalence search
interface MockEquivalenceDatabase {
  readonly [category: string]: {
    readonly products: readonly MockProduct[];
  };
}

interface MockProduct {
  readonly id: string;
  readonly nome: string;
  readonly referencia: string;
  readonly marcaFabricante: string;
  readonly categoria: string;
  readonly subcategoria?: string;
  readonly aplicacao?: string;
  readonly normas?: readonly string[];
  readonly especificacoesTecnicas: Record<string, string>;
  readonly pdmPadronizado: string;
}

// Comprehensive mock database
const MOCK_EQUIVALENCE_DATABASE: MockEquivalenceDatabase = {
  "Rolamento Rígido de Esferas": {
    products: [
      {
        id: "rol-001",
        nome: "Rolamento de Esferas",
        referencia: "6205-2rs",
        marcaFabricante: "SKF",
        categoria: "Rolamento Rígido de Esferas",
        subcategoria: "Rolamento com Vedação",
        aplicacao: "Máquinas industriais, motores elétricos",
        normas: ["ISO 15:2011", "DIN 625"],
        especificacoesTecnicas: {
          "Diâmetro Interno": "25 mm",
          "Diâmetro Externo": "52 mm",
          Largura: "15 mm",
          Tipo: "Rígido de Esferas",
          Material: "Aço Cromo",
          Vedação: "Dupla (2RS)",
          Precisão: "Normal (P0)",
        },
        pdmPadronizado:
          "ROLAMENTO, RÍGIDO DE ESFERAS, 1 FILEIRA, 25 mm x 52 mm x 15 mm, AÇO CROMO, NORMAL (P0), DUPLA (2RS), SKF, INDUSTRIAL",
      },
      {
        id: "rol-002",
        nome: "Rolamento de Esferas",
        referencia: "6205-zz",
        marcaFabricante: "FAG",
        categoria: "Rolamento Rígido de Esferas",
        subcategoria: "Rolamento com Proteção",
        aplicacao: "Máquinas industriais, eixos",
        normas: ["ISO 15:2011", "DIN 625"],
        especificacoesTecnicas: {
          "Diâmetro Interno": "25 mm",
          "Diâmetro Externo": "52 mm",
          Largura: "15 mm",
          Tipo: "Rígido de Esferas",
          Material: "Aço Cromo",
          Vedação: "Dupla Proteção (ZZ)",
          Precisão: "Normal (P0)",
        },
        pdmPadronizado:
          "ROLAMENTO, RÍGIDO DE ESFERAS, 1 FILEIRA, 25 mm x 52 mm x 15 mm, AÇO CROMO, NORMAL (P0), DUPLA PROTEÇÃO (ZZ), FAG, INDUSTRIAL",
      },
      {
        id: "rol-003",
        nome: "Rolamento de Esferas",
        referencia: "6204-2rs",
        marcaFabricante: "NSK",
        categoria: "Rolamento Rígido de Esferas",
        subcategoria: "Rolamento com Vedação",
        aplicacao: "Motores elétricos, bombas",
        normas: ["ISO 15:2011"],
        especificacoesTecnicas: {
          "Diâmetro Interno": "20 mm",
          "Diâmetro Externo": "47 mm",
          Largura: "14 mm",
          Tipo: "Rígido de Esferas",
          Material: "Aço Cromo",
          Vedação: "Dupla (2RS)",
          Precisão: "Normal (P0)",
        },
        pdmPadronizado:
          "ROLAMENTO, RÍGIDO DE ESFERAS, 1 FILEIRA, 20 mm x 47 mm x 14 mm, AÇO CROMO, NORMAL (P0), DUPLA (2RS), NSK, INDUSTRIAL",
      },
    ],
  },
  "Filtro de Óleo": {
    products: [
      {
        id: "fil-001",
        nome: "Filtro de Óleo",
        referencia: "OF-1234",
        marcaFabricante: "BOSCH",
        categoria: "Filtro de Óleo",
        subcategoria: "Filtro Spin-On",
        aplicacao: "Motores a combustão, sistemas hidráulicos",
        normas: ["ISO 4548-12"],
        especificacoesTecnicas: {
          Tipo: "Spin-On",
          Rosca: '3/4"-16 UNF',
          Altura: "108 mm",
          Diâmetro: "76 mm",
          "Material Filtrante": "Papel",
          Eficiência: "99%",
        },
        pdmPadronizado:
          'FILTRO DE ÓLEO, SPIN-ON, 3/4"-16 UNF, 108 mm x 76 mm, PAPEL, BOSCH',
      },
      {
        id: "fil-002",
        nome: "Filtro de Óleo",
        referencia: "HU-925/4X",
        marcaFabricante: "MANN",
        categoria: "Filtro de Óleo",
        subcategoria: "Filtro Cartucho",
        aplicacao: "Motores a combustão modernos",
        normas: ["ISO 4548-12"],
        especificacoesTecnicas: {
          Tipo: "Cartucho",
          Altura: "83 mm",
          Diâmetro: "65 mm",
          "Material Filtrante": "Sintético",
          Eficiência: "99.5%",
        },
        pdmPadronizado:
          "FILTRO DE ÓLEO, CARTUCHO, 83 mm x 65 mm, SINTÉTICO, MANN",
      },
    ],
  },
  "Parafuso Sextavado": {
    products: [
      {
        id: "par-001",
        nome: "Parafuso Sextavado",
        referencia: "M8x20",
        marcaFabricante: "TRAMONTINA",
        categoria: "Parafuso Sextavado",
        subcategoria: "Rosca Métrica",
        aplicacao: "Fixação geral, estruturas",
        especificacoesTecnicas: {
          Diâmetro: "8 mm",
          Comprimento: "20 mm",
          "Passo da Rosca": "1.25 mm",
          "Tipo de Rosca": "Métrica",
          Material: "Aço",
          "Classe de Resistência": "8.8",
          Acabamento: "Zincado",
        },
        pdmPadronizado:
          "PARAFUSO, SEXTAVADO, MÉTRICA, 8 mm x 20 mm, AÇO, ZINCADO, TRAMONTINA",
      },
      {
        id: "par-002",
        nome: "Parafuso Sextavado",
        referencia: "M8x25",
        marcaFabricante: "PAPAIZ",
        categoria: "Parafuso Sextavado",
        subcategoria: "Rosca Métrica",
        aplicacao: "Fixação estrutural, máquinas",
        especificacoesTecnicas: {
          Diâmetro: "8 mm",
          Comprimento: "25 mm",
          "Passo da Rosca": "1.25 mm",
          "Tipo de Rosca": "Métrica",
          Material: "Aço",
          "Classe de Resistência": "8.8",
          Acabamento: "Zincado",
        },
        pdmPadronizado:
          "PARAFUSO, SEXTAVADO, MÉTRICA, 8 mm x 25 mm, AÇO, ZINCADO, PAPAIZ",
      },
    ],
  },
};

export class MockEquivalenceService implements EquivalenceService {
  /**
   * Main equivalence search method
   */
  async searchEquivalents(
    criteria: EquivalenceSearchCriteria
  ): Promise<EquivalenceSearchResponse> {
    const startTime = Date.now();

    // Simulate processing delay
    await this.simulateProcessingDelay();

    // Find matches based on criteria
    const matches = this.findMatches(criteria);

    // Sort by score
    const sortedMatches = matches.sort((a, b) => b.matchScore - a.matchScore);

    // Limit results
    const limitedMatches = sortedMatches.slice(0, criteria.maxResults);

    const searchDuration = Date.now() - startTime;

    return {
      searchCriteria: criteria,
      matches: limitedMatches,
      totalFound: matches.length,
      searchDuration,
      suggestions: this.generateSuggestions(criteria, limitedMatches),
    };
  }

  /**
   * Check service availability
   */
  isServiceAvailable(): boolean {
    return true;
  }

  /**
   * Create search criteria from enrichment result and selected fields
   */
  static createSearchCriteria(
    enrichmentResult: EnrichmentResponse,
    selectedFields: SelectedFields,
    searchMode: "exact" | "fuzzy" | "partial" = "fuzzy",
    maxResults: number = 10
  ): EquivalenceSearchCriteria {
    const { enriched } = enrichmentResult;

    return {
      selectedFields,
      originalData: {
        categoria: selectedFields.categoria ? enriched.categoria : undefined,
        subcategoria: selectedFields.subcategoria
          ? enriched.subcategoria
          : undefined,
        aplicacao: selectedFields.aplicacao ? enriched.aplicacao : undefined,
        normas: selectedFields.normas ? enriched.normas : undefined,
        especificacoesTecnicas:
          selectedFields.especificacoesTecnicas.length > 0
            ? this.filterSpecifications(
                enriched.especificacoesTecnicas,
                selectedFields.especificacoesTecnicas
              )
            : undefined,
      },
      searchMode,
      maxResults,
    };
  }

  /**
   * Private methods
   */
  private async simulateProcessingDelay(): Promise<void> {
    const delay = 1000 + Math.random() * 2000; // 1-3 seconds
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  private findMatches(criteria: EquivalenceSearchCriteria): EquivalenceMatch[] {
    const { originalData, selectedFields, searchMode } = criteria;
    const matches: EquivalenceMatch[] = [];

    // Search in all categories
    for (const [category, categoryData] of Object.entries(
      MOCK_EQUIVALENCE_DATABASE
    )) {
      for (const product of categoryData.products) {
        const score = this.calculateMatchScore(
          product,
          originalData,
          selectedFields,
          searchMode
        );

        if (score > 0.3) {
          // Minimum threshold
          matches.push({
            id: product.id,
            nome: product.nome,
            referencia: product.referencia,
            marcaFabricante: product.marcaFabricante,
            categoria: product.categoria,
            subcategoria: product.subcategoria,
            especificacoesTecnicas: product.especificacoesTecnicas,
            matchScore: score,
            matchedFields: this.getMatchedFields(
              product,
              originalData,
              selectedFields
            ),
            pdmPadronizado: product.pdmPadronizado,
          });
        }
      }
    }

    return matches;
  }

  private calculateMatchScore(
    product: MockProduct,
    originalData: EquivalenceSearchCriteria["originalData"],
    selectedFields: SelectedFields,
    searchMode: "exact" | "fuzzy" | "partial"
  ): number {
    let totalScore = 0;
    let totalWeight = 0;

    // Category match (high weight)
    if (selectedFields.categoria && originalData.categoria) {
      const weight = 0.4;
      totalWeight += weight;
      if (searchMode === "exact") {
        totalScore += product.categoria === originalData.categoria ? weight : 0;
      } else {
        totalScore +=
          this.fuzzyMatch(product.categoria, originalData.categoria) * weight;
      }
    }

    // Subcategory match
    if (
      selectedFields.subcategoria &&
      originalData.subcategoria &&
      product.subcategoria
    ) {
      const weight = 0.2;
      totalWeight += weight;
      if (searchMode === "exact") {
        totalScore +=
          product.subcategoria === originalData.subcategoria ? weight : 0;
      } else {
        totalScore +=
          this.fuzzyMatch(product.subcategoria, originalData.subcategoria) *
          weight;
      }
    }

    // Technical specifications match
    if (
      selectedFields.especificacoesTecnicas.length > 0 &&
      originalData.especificacoesTecnicas
    ) {
      const weight = 0.3;
      totalWeight += weight;
      const specScore = this.calculateSpecScore(
        product.especificacoesTecnicas,
        originalData.especificacoesTecnicas,
        selectedFields.especificacoesTecnicas,
        searchMode
      );
      totalScore += specScore * weight;
    }

    // Application match
    if (
      selectedFields.aplicacao &&
      originalData.aplicacao &&
      product.aplicacao
    ) {
      const weight = 0.1;
      totalWeight += weight;
      totalScore +=
        this.fuzzyMatch(product.aplicacao, originalData.aplicacao) * weight;
    }

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  private calculateSpecScore(
    productSpecs: Record<string, string>,
    originalSpecs: Record<string, string>,
    selectedSpecKeys: readonly string[],
    searchMode: "exact" | "fuzzy" | "partial"
  ): number {
    if (selectedSpecKeys.length === 0) return 0;

    let matches = 0;
    for (const key of selectedSpecKeys) {
      const originalValue = originalSpecs[key];
      const productValue = productSpecs[key];

      if (originalValue && productValue) {
        if (searchMode === "exact") {
          if (originalValue === productValue) matches++;
        } else {
          matches += this.fuzzyMatch(originalValue, productValue);
        }
      }
    }

    return matches / selectedSpecKeys.length;
  }

  private fuzzyMatch(str1: string, str2: string): number {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();

    if (s1 === s2) return 1;
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;

    // Simple similarity based on common words
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);
    const commonWords = words1.filter((word) => words2.includes(word));

    if (commonWords.length > 0) {
      return commonWords.length / Math.max(words1.length, words2.length);
    }

    return 0;
  }

  private getMatchedFields(
    product: MockProduct,
    originalData: EquivalenceSearchCriteria["originalData"],
    selectedFields: SelectedFields
  ): string[] {
    const matched: string[] = [];

    if (
      selectedFields.categoria &&
      originalData.categoria &&
      this.fuzzyMatch(product.categoria, originalData.categoria) > 0.7
    ) {
      matched.push("categoria");
    }

    if (
      selectedFields.subcategoria &&
      originalData.subcategoria &&
      product.subcategoria &&
      this.fuzzyMatch(product.subcategoria, originalData.subcategoria) > 0.7
    ) {
      matched.push("subcategoria");
    }

    if (
      selectedFields.aplicacao &&
      originalData.aplicacao &&
      product.aplicacao &&
      this.fuzzyMatch(product.aplicacao, originalData.aplicacao) > 0.7
    ) {
      matched.push("aplicacao");
    }

    return matched;
  }

  private generateSuggestions(
    criteria: EquivalenceSearchCriteria,
    matches: EquivalenceMatch[]
  ): string[] {
    const suggestions: string[] = [];

    if (matches.length === 0) {
      suggestions.push("Tente relaxar os critérios de busca");
      suggestions.push("Considere usar busca parcial ao invés de exata");
    } else if (matches.length < 3) {
      suggestions.push(
        "Poucos resultados encontrados - considere ampliar a busca"
      );
    }

    return suggestions;
  }

  private static filterSpecifications(
    specs: Record<string, unknown> | undefined,
    selectedKeys: readonly string[]
  ): Record<string, string> | undefined {
    if (!specs) return undefined;

    const filtered: Record<string, string> = {};
    for (const key of selectedKeys) {
      const value = specs[key];
      if (value && typeof value === "string") {
        filtered[key] = value;
      }
    }

    return Object.keys(filtered).length > 0 ? filtered : undefined;
  }
}
