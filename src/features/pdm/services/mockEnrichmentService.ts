/**
 * Mock enrichment service following SOLID principles
 *
 * DEPRECATED: Este mock não está mais sendo usado no fluxo principal
 * Mantido apenas para referência histórica
 *
 * Single Responsibility: Simulate AI enrichment
 * Open/Closed: Extensible via data configuration
 * Dependency Inversion: Implements abstraction interface
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  EnrichmentService,
  EnrichmentRequest,
  EnrichmentResponse,
  EnrichedProductData,
  EnrichmentSuggestion,
} from "../types/enrichment.types";
import { DataSource, BaseProductInfo } from "../types/base.types";

// Mock database following Open/Closed Principle
interface MockProductData {
  categoria: string;
  subcategoria?: string;
  especificacoesTecnicas: Record<string, string>;
  aplicacao?: string;
  normas?: string[];
  confidence: number;
}

interface MockCategoryData {
  keywords: string[];
  references: Record<string, MockProductData>;
}

type MockDatabase = Record<string, MockCategoryData>;

const MOCK_ENRICHMENT_DATABASE: MockDatabase = {
  // Rolamentos
  rolamento: {
    keywords: ["rolamento", "bearing", "rolamento rígido", "esferas"],
    references: {
      "6205": {
        categoria: "Rolamento Rígido de Esferas",
        subcategoria: "Série 6200",
        especificacoesTecnicas: {
          "Diâmetro Interno": "25 mm",
          "Diâmetro Externo": "52 mm",
          Largura: "15 mm",
          Tipo: "Rígido de Esferas",
          "Número de Fileiras": "1",
          Material: "Aço Cromo",
          Vedação: "Aberto",
          Precisão: "Normal (P0)",
          "Carga Dinâmica": "14.0 kN",
          "Carga Estática": "6.95 kN",
          "Velocidade Máxima": "18.000 rpm",
        },
        aplicacao:
          "Motores elétricos, bombas centrífugas, ventiladores, equipamentos industriais em geral",
        normas: ["ISO 15:2011", "DIN 625-1", "ABNT NBR 8094"],
        confidence: 0.95,
      },
      "6206": {
        categoria: "Rolamento Rígido de Esferas",
        subcategoria: "Série 6200",
        especificacoesTecnicas: {
          "Diâmetro Interno": "30 mm",
          "Diâmetro Externo": "62 mm",
          Largura: "16 mm",
          Tipo: "Rígido de Esferas",
          "Número de Fileiras": "1",
          Material: "Aço Cromo",
          Vedação: "Aberto",
          Precisão: "Normal (P0)",
          "Carga Dinâmica": "19.5 kN",
          "Carga Estática": "11.2 kN",
          "Velocidade Máxima": "15.000 rpm",
        },
        aplicacao: "Motores elétricos, bombas, ventiladores, redutores",
        normas: ["ISO 15:2011", "DIN 625-1"],
        confidence: 0.95,
      },
    },
  },

  // Filtros
  filtro: {
    keywords: ["filtro", "filter", "filtro de óleo", "óleo"],
    references: {
      wl1013: {
        categoria: "Filtro de Óleo Automotivo",
        subcategoria: "Cartucho",
        especificacoesTecnicas: {
          Tipo: "Cartucho",
          Rosca: '3/4"-16 UNF',
          Altura: "89 mm",
          Diâmetro: "76 mm",
          "Material Filtrante": "Papel plissado",
          Eficiência: "99%",
          Capacidade: "150 ml",
        },
        aplicacao: "Fiat Cronos 1.3 6V/8V (2018-2023), Fiat Argo 1.3",
        normas: ["ISO 4548-12", "SAE J1858"],
        confidence: 0.9,
      },
    },
  },

  // Parafusos
  parafuso: {
    keywords: ["parafuso", "screw", "bolt", "rosca"],
    references: {
      m8x20: {
        categoria: "Parafuso Sextavado",
        subcategoria: "Rosca Métrica",
        especificacoesTecnicas: {
          Diâmetro: "8 mm",
          Comprimento: "20 mm",
          "Passo da Rosca": "1.25 mm",
          "Tipo de Rosca": "Métrica",
          Material: "Aço",
          "Classe de Resistência": "8.8",
          Acabamento: "Zincado",
          "Tipo de Cabeça": "Sextavada",
        },
        aplicacao:
          "Fixação geral, estruturas metálicas, equipamentos industriais",
        normas: ["DIN 933", "ISO 4017", "ABNT NBR 8855"],
        confidence: 0.85,
      },
    },
  },
};

const SUPPORTED_MANUFACTURERS = [
  "SKF",
  "FAG",
  "NSK",
  "NTN",
  "TIMKEN",
  "INA", // Rolamentos
  "BOSCH",
  "MANN",
  "MAHLE",
  "WEGA",
  "TECFIL", // Filtros
  "TRAMONTINA",
  "PAPAIZ",
  "ESCO",
  "CISER", // Parafusos
];

export class MockEnrichmentService implements EnrichmentService {
  /**
   * Main enrichment method following Single Responsibility
   */
  async enrichProduct(request: EnrichmentRequest): Promise<EnrichmentResponse> {
    // Simulate AI processing delay
    await this.simulateProcessingDelay();

    const { productInfo } = request;

    // Identify product category
    const category = this.identifyCategory(productInfo.informacoes || "");

    // Find specific product data
    const productData = this.findProductData(category, productInfo);

    // Generate enriched data
    const enriched = this.generateEnrichedData(
      productInfo,
      productData,
      category
    );

    // Generate suggestions
    const suggestions = this.generateSuggestions(productInfo, productData);

    // Calculate confidence
    const confidence = this.calculateConfidence(productInfo, productData);

    return {
      original: productInfo,
      enriched,
      metrics: {
        confidence,
        source: productData
          ? DataSource.MANUFACTURER_CATALOG
          : DataSource.AI_ENRICHMENT,
      },
      suggestions,
      warnings: this.generateWarnings(productInfo, productData),
    };
  }

  /**
   * Check if manufacturer is supported
   */
  isManufacturerSupported(manufacturer: string): boolean {
    return SUPPORTED_MANUFACTURERS.some(
      (m) => m.toLowerCase() === manufacturer.toLowerCase()
    );
  }

  /**
   * Get supported categories
   */
  getSupportedCategories(): string[] {
    return Object.keys(MOCK_ENRICHMENT_DATABASE);
  }

  /**
   * Private methods following Single Responsibility
   */
  private async simulateProcessingDelay(): Promise<void> {
    const delay = 1500 + Math.random() * 2000; // 1.5-3.5 seconds
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  private identifyCategory(nome: string): string {
    const nomeLower = nome.toLowerCase();

    for (const [category, data] of Object.entries(MOCK_ENRICHMENT_DATABASE)) {
      if (
        data.keywords.some((keyword) =>
          nomeLower.includes(keyword.toLowerCase())
        )
      ) {
        return category;
      }
    }

    return "generic";
  }

  private findProductData(
    category: string,
    productInfo: BaseProductInfo
  ): MockProductData | null {
    if (category === "generic" || !MOCK_ENRICHMENT_DATABASE[category]) {
      return null;
    }

    const categoryData = MOCK_ENRICHMENT_DATABASE[category];
    const informacoes = productInfo.informacoes?.toLowerCase();

    // Buscar por referência nas informações
    if (informacoes && categoryData.references) {
      for (const [ref, data] of Object.entries(categoryData.references)) {
        if (informacoes.includes(ref.toLowerCase())) {
          return data;
        }
      }
    }

    // Return first reference as fallback
    const firstRef = Object.keys(categoryData.references)[0];
    return firstRef ? categoryData.references[firstRef] : null;
  }

  private generateEnrichedData(
    original: BaseProductInfo,
    productData: MockProductData | null,
    category: string
  ): EnrichedProductData {
    if (productData) {
      // Use specific product data
      return {
        categoria: productData.categoria,
        subcategoria: productData.subcategoria,
        especificacoesTecnicas: {
          resumoPDM: "",
          especificacoesTecnicas: productData.especificacoesTecnicas || {},
        },
        aplicacao: productData.aplicacao,
        normas: productData.normas,
        pdmPadronizado: this.generatePDM(original, productData),
        observacoes: [
          `Dados baseados em ${
            productData.confidence > 0.9 ? "catálogo oficial" : "base técnica"
          }`,
        ],
      };
    } else {
      // Generate generic data
      return {
        categoria: this.generateGenericCategory(
          original.informacoes || "Produto"
        ),
        especificacoesTecnicas: {
          resumoPDM: "",
          especificacoesTecnicas: this.generateGenericSpecs(original),
        },
        aplicacao: "Aplicação industrial geral",
        pdmPadronizado: this.generateGenericPDM(original),
        observacoes: ["Dados estimados baseados em análise genérica"],
      };
    }
  }

  private generatePDM(
    original: BaseProductInfo,
    productData: MockProductData | null
  ): string {
    if (!productData) {
      return this.generateGenericPDM(original);
    }

    const specs = productData.especificacoesTecnicas;
    const marca = original.marcaFabricante || "GENÉRICO";

    if (productData.categoria.includes("Rolamento")) {
      return `ROLAMENTO, ${specs["Tipo"]?.toUpperCase()}, ${
        specs["Número de Fileiras"]
      } FILEIRA, ${specs["Diâmetro Interno"]} x ${
        specs["Diâmetro Externo"]
      } x ${specs["Largura"]}, ${specs["Material"]?.toUpperCase()}, ${specs[
        "Precisão"
      ]?.toUpperCase()}, ${specs["Vedação"]?.toUpperCase()}, ${marca}, ${
        specs["Norma"] || "INDUSTRIAL"
      }`;
    } else if (productData.categoria.includes("Filtro")) {
      return `FILTRO DE ÓLEO, ${specs["Tipo"]?.toUpperCase()}, ${
        specs["Rosca"]
      }, ${specs["Altura"]} x ${specs["Diâmetro"]}, ${specs[
        "Material Filtrante"
      ]?.toUpperCase()}, ${marca}`;
    } else if (productData.categoria.includes("Parafuso")) {
      return `PARAFUSO, ${specs["Tipo de Cabeça"]?.toUpperCase()}, ${specs[
        "Tipo de Rosca"
      ]?.toUpperCase()}, ${specs["Diâmetro"]} x ${
        specs["Comprimento"]
      }, ${specs["Material"]?.toUpperCase()}, ${specs[
        "Acabamento"
      ]?.toUpperCase()}, ${marca}`;
    }

    return `${productData.categoria.toUpperCase()}, ${marca}, ESPECIFICAÇÃO TÉCNICA DETALHADA`;
  }

  private generateGenericCategory(nome: string): string {
    const nomeLower = nome.toLowerCase();
    if (nomeLower.includes("rolamento")) return "Rolamento Industrial";
    if (nomeLower.includes("filtro")) return "Filtro Industrial";
    if (nomeLower.includes("parafuso")) return "Elemento de Fixação";
    return "Componente Industrial";
  }

  private generateGenericSpecs(
    original: BaseProductInfo
  ): Record<string, string> {
    return {
      Tipo: original.nome || "Produto",
      Referência: original.referencia || "N/A",
      Fabricante: original.marcaFabricante || "Não especificado",
      Características: original.caracteristicas || "Não informado",
      Status: "Análise genérica",
    };
  }

  private generateGenericPDM(original: BaseProductInfo): string {
    const categoria = this.generateGenericCategory(original.nome || "Produto");
    const marca = original.marcaFabricante || "GENÉRICO";
    return `${categoria.toUpperCase()}, ${marca}, ${
      original.referencia || "SEM REFERÊNCIA"
    }`;
  }

  private generateSuggestions(
    original: BaseProductInfo,
    productData: MockProductData | null
  ): EnrichmentSuggestion[] {
    const suggestions: EnrichmentSuggestion[] = [];

    if (!original.marcaFabricante && productData) {
      suggestions.push({
        type: "manufacturer",
        field: "marcaFabricante",
        suggestedValue: "SKF",
        confidence: 0.8,
        reason: "Baseado no padrão da referência",
      });
    }

    return suggestions;
  }

  private calculateConfidence(
    original: BaseProductInfo,
    productData: MockProductData | null
  ): number {
    if (!productData) return 0.6;

    let confidence = productData.confidence || 0.8;

    // Increase confidence if manufacturer matches
    if (
      original.marcaFabricante &&
      this.isManufacturerSupported(original.marcaFabricante)
    ) {
      confidence += 0.1;
    }

    // Increase confidence if reference matches exactly
    if (original.referencia) {
      confidence += 0.05;
    }

    return Math.min(confidence, 0.98);
  }

  private generateWarnings(
    original: BaseProductInfo,
    productData: MockProductData | null
  ): string[] {
    const warnings: string[] = [];

    if (!productData) {
      warnings.push(
        "Produto não encontrado em catálogos oficiais - dados estimados"
      );
    }

    if (!original.marcaFabricante) {
      warnings.push("Fabricante não informado - precisão pode ser afetada");
    }

    return warnings;
  }
}
