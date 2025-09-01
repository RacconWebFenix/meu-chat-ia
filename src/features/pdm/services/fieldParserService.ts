/**
 * Dynamic Field Parser Service
 * Following Single Responsibility Principle and Dependency Inversion
 * Responsibility: Parse and map dynamic technical fields to user-friendly labels
 */

import { EnrichedProductData } from "../types";

// Interface para configuração de mapeamento de campos
export interface FieldMappingConfig {
  readonly pattern: string | RegExp;
  readonly replacement: string;
  readonly category?: string;
  readonly priority: number;
}

// Interface para resultado do parsing
export interface ParsedField {
  readonly originalKey: string;
  readonly friendlyLabel: string;
  readonly category: string;
  readonly confidence: number;
  readonly source: "known" | "pattern" | "fallback";
}

// Interface para estatísticas do parser
export interface ParserStats {
  readonly totalFields: number;
  readonly knownMappings: number;
  readonly patternMatches: number;
  readonly fallbackUsed: number;
  readonly categories: Record<string, number>;
}

// Classe principal do parser dinâmico
export class DynamicFieldParser {
  private knownMappings: Map<string, FieldMappingConfig> = new Map();
  private categoryMappings: Map<string, Map<string, string>> = new Map();
  private patternMappings: FieldMappingConfig[] = [];
  private learningData: Map<string, { count: number; lastSeen: Date }> =
    new Map();

  constructor() {
    this.initializeDefaultMappings();
  }

  /**
   * Inicializa mapeamentos padrão conhecidos
   */
  private initializeDefaultMappings(): void {
    // Mapeamentos específicos conhecidos
    const defaultMappings: Record<string, FieldMappingConfig> = {
      // Rolamentos
      nomeProduto: {
        pattern: "nomeProduto",
        replacement: "Nome do Produto",
        category: "rolamentos",
        priority: 10,
      },
      fabricante: {
        pattern: "fabricante",
        replacement: "Fabricante",
        category: "geral",
        priority: 10,
      },
      referenciaEncontrada: {
        pattern: "referenciaEncontrada",
        replacement: "Referência",
        category: "geral",
        priority: 10,
      },
      ncm: {
        pattern: "ncm",
        replacement: "NCM",
        category: "geral",
        priority: 10,
      },
      unidadeMedida: {
        pattern: "unidadeMedida",
        replacement: "Unidade de Medida",
        category: "geral",
        priority: 9,
      },

      // Dimensões
      diametroInternoMm: {
        pattern: "diametroInternoMm",
        replacement: "Diâmetro Interno (mm)",
        category: "dimensoes",
        priority: 9,
      },
      diametroExternoMm: {
        pattern: "diametroExternoMm",
        replacement: "Diâmetro Externo (mm)",
        category: "dimensoes",
        priority: 9,
      },
      larguraMm: {
        pattern: "larguraMm",
        replacement: "Largura (mm)",
        category: "dimensoes",
        priority: 9,
      },
      alturaMm: {
        pattern: "alturaMm",
        replacement: "Altura (mm)",
        category: "dimensoes",
        priority: 9,
      },

      // Materiais e Vedação
      materialGaiola: {
        pattern: "materialGaiola",
        replacement: "Material da Gaiola",
        category: "materiais",
        priority: 8,
      },
      tipoVedacao: {
        pattern: "tipoVedacao",
        replacement: "Tipo de Vedação",
        category: "vedacao",
        priority: 8,
      },

      // Capacidades
      capacidadeCargaDinamicaKn: {
        pattern: "capacidadeCargaDinamicaKn",
        replacement: "Capacidade de Carga Dinâmica (kN)",
        category: "capacidades",
        priority: 9,
      },
      capacidadeCargaEstaticaKn: {
        pattern: "capacidadeCargaEstaticaKn",
        replacement: "Capacidade de Carga Estática (kN)",
        category: "capacidades",
        priority: 9,
      },

      // Velocidades
      velocidadeMaximaRpm: {
        pattern: "velocidadeMaximaRpm",
        replacement: "Velocidade Máxima (RPM)",
        category: "velocidades",
        priority: 9,
      },
      velocidadeMinimaRpm: {
        pattern: "velocidadeMinimaRpm",
        replacement: "Velocidade Mínima (RPM)",
        category: "velocidades",
        priority: 8,
      },

      // Aplicações
      aplicacao: {
        pattern: "aplicacao",
        replacement: "Aplicação",
        category: "aplicacao",
        priority: 8,
      },
      compatibilidadeVeiculos: {
        pattern: "compatibilidadeVeiculos",
        replacement: "Compatibilidade com Veículos",
        category: "aplicacao",
        priority: 7,
      },
    };

    // Adiciona mapeamentos conhecidos
    Object.entries(defaultMappings).forEach(([key, config]) => {
      this.knownMappings.set(key, config);
    });

    // Padrões dinâmicos para campos não conhecidos
    this.patternMappings = [
      // Padrões de unidades
      {
        pattern: /(.+)Mm$/,
        replacement: "$1 (mm)",
        category: "dimensoes",
        priority: 5,
      },
      {
        pattern: /(.+)Cm$/,
        replacement: "$1 (cm)",
        category: "dimensoes",
        priority: 5,
      },
      {
        pattern: /(.+)Kg$/,
        replacement: "$1 (kg)",
        category: "pesos",
        priority: 5,
      },
      {
        pattern: /(.+)Kn$/,
        replacement: "$1 (kN)",
        category: "capacidades",
        priority: 5,
      },
      {
        pattern: /(.+)Rpm$/,
        replacement: "$1 (RPM)",
        category: "velocidades",
        priority: 5,
      },
      {
        pattern: /(.+)Mpa$/,
        replacement: "$1 (MPa)",
        category: "pressao",
        priority: 5,
      },
      {
        pattern: /(.+)Bar$/,
        replacement: "$1 (bar)",
        category: "pressao",
        priority: 5,
      },

      // Padrões de tipos
      {
        pattern: /^tipo(.+)$/,
        replacement: "Tipo de $1",
        category: "tipos",
        priority: 4,
      },
      {
        pattern: /^material(.+)$/,
        replacement: "Material $1",
        category: "materiais",
        priority: 4,
      },
      {
        pattern: /^capacidade(.+)$/,
        replacement: "Capacidade $1",
        category: "capacidades",
        priority: 4,
      },

      // Padrão genérico para camelCase
      {
        pattern: /([A-Z])/g,
        replacement: " $1",
        category: "geral",
        priority: 1,
      },
    ];
  }

  /**
   * Parse um campo técnico para label amigável
   */
  parseField(key: string, category?: string): ParsedField {
    // 1. Verifica mapeamentos conhecidos
    if (this.knownMappings.has(key)) {
      const mapping = this.knownMappings.get(key)!;
      return {
        originalKey: key,
        friendlyLabel: mapping.replacement,
        category: mapping.category || "geral",
        confidence: 1.0,
        source: "known",
      };
    }

    // 2. Verifica mapeamentos por categoria
    if (category && this.categoryMappings.has(category)) {
      const categoryMap = this.categoryMappings.get(category)!;
      if (categoryMap.has(key)) {
        return {
          originalKey: key,
          friendlyLabel: categoryMap.get(key)!,
          category: category,
          confidence: 0.9,
          source: "known",
        };
      }
    }

    // 3. Aplica padrões dinâmicos
    for (const pattern of this.patternMappings) {
      if (typeof pattern.pattern === "string") {
        if (key.includes(pattern.pattern)) {
          const friendlyLabel = key.replace(
            new RegExp(pattern.pattern, "g"),
            pattern.replacement
          );
          return {
            originalKey: key,
            friendlyLabel: this.formatCamelCase(friendlyLabel),
            category: pattern.category || "geral",
            confidence: 0.7,
            source: "pattern",
          };
        }
      } else if (pattern.pattern instanceof RegExp) {
        const match = key.match(pattern.pattern);
        if (match) {
          let friendlyLabel = key.replace(pattern.pattern, pattern.replacement);
          friendlyLabel = this.formatCamelCase(friendlyLabel);
          return {
            originalKey: key,
            friendlyLabel: friendlyLabel,
            category: pattern.category || "geral",
            confidence: 0.7,
            source: "pattern",
          };
        }
      }
    }

    // 4. Fallback: formatação básica de camelCase
    const fallbackLabel = this.formatCamelCase(key);
    return {
      originalKey: key,
      friendlyLabel: fallbackLabel,
      category: category || "geral",
      confidence: 0.3,
      source: "fallback",
    };
  }

  /**
   * Parse múltiplos campos de uma vez
   */
  parseFields(
    fields: Record<string, any>,
    category?: string
  ): Record<string, ParsedField> {
    const result: Record<string, ParsedField> = {};

    Object.keys(fields).forEach((key) => {
      if (
        fields[key] !== null &&
        fields[key] !== undefined &&
        fields[key] !== ""
      ) {
        result[key] = this.parseField(key, category);
        this.learnFromField(key, category);
      }
    });

    return result;
  }

  /**
   * Parse campos de dados enriquecidos do PDM
   */
  parseEnrichedData(
    enrichedData: EnrichedProductData
  ): Record<string, ParsedField> {
    const result: Record<string, ParsedField> = {};

    // Parse especificações técnicas
    if (enrichedData.especificacoesTecnicas?.especificacoesTecnicas) {
      const techSpecs =
        enrichedData.especificacoesTecnicas.especificacoesTecnicas;
      Object.assign(
        result,
        this.parseFields(techSpecs, enrichedData.categoria)
      );
    }

    // Parse outros campos do produto
    const otherFields = {
      categoria: enrichedData.categoria,
      subcategoria: enrichedData.subcategoria,
      marcaFabricante: enrichedData.marcaFabricante,
      aplicacao: enrichedData.aplicacao,
    };

    Object.assign(
      result,
      this.parseFields(otherFields, enrichedData.categoria)
    );

    return result;
  }

  /**
   * Aprende com novos campos encontrados
   */
  private learnFromField(key: string, category?: string): void {
    const existing = this.learningData.get(key);
    if (existing) {
      existing.count++;
      existing.lastSeen = new Date();
    } else {
      this.learningData.set(key, { count: 1, lastSeen: new Date() });
    }

    // Se o campo aparece frequentemente, pode ser candidato a mapeamento conhecido
    if (existing && existing.count >= 5) {
      console.log(
        `Campo frequente detectado: ${key} (contagem: ${existing.count})`
      );
    }
  }

  /**
   * Adiciona mapeamento personalizado
   */
  addCustomMapping(
    key: string,
    friendlyLabel: string,
    category?: string
  ): void {
    this.knownMappings.set(key, {
      pattern: key,
      replacement: friendlyLabel,
      category: category || "geral",
      priority: 10,
    });
  }

  /**
   * Adiciona mapeamento por categoria
   */
  addCategoryMapping(
    category: string,
    key: string,
    friendlyLabel: string
  ): void {
    if (!this.categoryMappings.has(category)) {
      this.categoryMappings.set(category, new Map());
    }
    this.categoryMappings.get(category)!.set(key, friendlyLabel);
  }

  /**
   * Formata string camelCase para label legível
   */
  private formatCamelCase(str: string): string {
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (char) => char.toUpperCase())
      .trim();
  }

  /**
   * Obtém estatísticas do parser
   */
  getStats(): ParserStats {
    const categories: Record<string, number> = {};
    this.knownMappings.forEach((mapping) => {
      categories[mapping.category || "geral"] =
        (categories[mapping.category || "geral"] || 0) + 1;
    });

    return {
      totalFields: this.learningData.size,
      knownMappings: this.knownMappings.size,
      patternMatches: this.patternMappings.length,
      fallbackUsed: Array.from(this.learningData.values()).filter(
        (data) => data.count === 1
      ).length,
      categories,
    };
  }

  /**
   * Exporta configuração atual para backup/persistência
   */
  exportConfig(): {
    knownMappings: Record<string, FieldMappingConfig>;
    categoryMappings: Record<string, Record<string, string>>;
    learningData: Record<string, { count: number; lastSeen: string }>;
  } {
    const knownMappings: Record<string, FieldMappingConfig> = {};
    this.knownMappings.forEach((value, key) => {
      knownMappings[key] = value;
    });

    const categoryMappings: Record<string, Record<string, string>> = {};
    this.categoryMappings.forEach((value, key) => {
      categoryMappings[key] = Object.fromEntries(value);
    });

    const learningData: Record<string, { count: number; lastSeen: string }> =
      {};
    this.learningData.forEach((value, key) => {
      learningData[key] = {
        count: value.count,
        lastSeen: value.lastSeen.toISOString(),
      };
    });

    return { knownMappings, categoryMappings, learningData };
  }

  /**
   * Importa configuração salva
   */
  importConfig(config: {
    knownMappings: Record<string, FieldMappingConfig>;
    categoryMappings: Record<string, Record<string, string>>;
    learningData: Record<string, { count: number; lastSeen: string }>;
  }): void {
    // Importa mapeamentos conhecidos
    this.knownMappings.clear();
    Object.entries(config.knownMappings).forEach(([key, mapping]) => {
      this.knownMappings.set(key, mapping);
    });

    // Importa mapeamentos por categoria
    this.categoryMappings.clear();
    Object.entries(config.categoryMappings).forEach(([category, mappings]) => {
      this.categoryMappings.set(category, new Map(Object.entries(mappings)));
    });

    // Importa dados de aprendizado
    this.learningData.clear();
    Object.entries(config.learningData).forEach(([key, data]) => {
      this.learningData.set(key, {
        count: data.count,
        lastSeen: new Date(data.lastSeen),
      });
    });
  }
}

// Factory function para criar instância do parser
export const createDynamicFieldParser = (): DynamicFieldParser => {
  return new DynamicFieldParser();
};

// Instância singleton para uso global
export const dynamicFieldParser = createDynamicFieldParser();
