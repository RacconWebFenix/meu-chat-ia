/**
 * DROP ZONE CONFIGURATION - BUSINESS RULES
 *
 * Seguindo SOLID:
 * - Single Responsibility: Cada zona tem regras específicas
 * - Open/Closed: Extensível para novas zonas
 * - Dependency Inversion: Abstração das regras de negócio
 */

import {
  DropZoneConfig,
  FieldValidationResult,
  ZoneValidationRules,
  FieldOption,
} from "./types";
import { isMetricField, isDimensionField } from "./fieldConfig";

// ====================================
// DROP ZONE CONFIGURATIONS
// ====================================

export const DROP_ZONE_CONFIGS: ReadonlyArray<DropZoneConfig> = [
  {
    id: "rows",
    title: "Linhas",
    acceptedTypes: ["string", "date"],
    description: "Campos que aparecerão como linhas",
  },
  {
    id: "columns",
    title: "Colunas",
    acceptedTypes: ["string", "date"],
    description: "Campos que aparecerão como colunas",
  },
  {
    id: "values",
    title: "Valores",
    acceptedTypes: ["number"],
    description: "Métricas que serão agregadas",
  },
  {
    id: "available",
    title: "Campos Disponíveis",
    acceptedTypes: ["string", "number", "date"],
    description: "Todos os campos da tabela dinâmica",
  },
] as const;

// ====================================
// VALIDATION RULES - Business Logic
// ====================================

export const ZONE_VALIDATION_RULES: Record<string, ZoneValidationRules> = {
  rows: {
    canAcceptField: (
      field: FieldOption,
      currentItems: ReadonlyArray<string>
    ): FieldValidationResult => {
      if (isMetricField(field)) {
        return {
          isValid: false,
          errorMessage: "Campos numéricos não podem ser usados como linhas",
        };
      }

      if (currentItems.includes(field.value)) {
        return {
          isValid: false,
          errorMessage: "Campo já está sendo usado nesta área",
        };
      }

      return { isValid: true };
    },
    maxItems: 3,
    requiredTypes: ["string", "date"],
  },

  columns: {
    canAcceptField: (
      field: FieldOption,
      currentItems: ReadonlyArray<string>
    ): FieldValidationResult => {
      if (isMetricField(field)) {
        return {
          isValid: false,
          errorMessage: "Campos numéricos não podem ser usados como colunas",
        };
      }

      if (currentItems.includes(field.value)) {
        return {
          isValid: false,
          errorMessage: "Campo já está sendo usado nesta área",
        };
      }

      return { isValid: true };
    },
    maxItems: 2,
    requiredTypes: ["string", "date"],
  },

  values: {
    canAcceptField: (
      field: FieldOption,
      currentItems: ReadonlyArray<string>
    ): FieldValidationResult => {
      if (isDimensionField(field)) {
        return {
          isValid: false,
          errorMessage: "Apenas campos numéricos podem ser usados como valores",
        };
      }

      if (currentItems.includes(field.value)) {
        return {
          isValid: false,
          errorMessage: "Campo já está sendo usado nesta área",
        };
      }

      return { isValid: true };
    },
    maxItems: 3,
    requiredTypes: ["number"],
  },

  available: {
    canAcceptField: (): FieldValidationResult => ({ isValid: true }),
    requiredTypes: ["string", "number", "date"],
  },
};

// ====================================
// VALIDATION UTILITIES
// ====================================

export const validateFieldDrop = (
  targetZoneId: string,
  field: FieldOption,
  currentItems: ReadonlyArray<string>
): FieldValidationResult => {
  const rules = ZONE_VALIDATION_RULES[targetZoneId];

  if (!rules) {
    return {
      isValid: false,
      errorMessage: "Zona de destino inválida",
    };
  }

  return rules.canAcceptField(field, currentItems);
};

export const getZoneConfig = (zoneId: string): DropZoneConfig | undefined => {
  return DROP_ZONE_CONFIGS.find((config) => config.id === zoneId);
};

export const isZoneAtCapacity = (
  zoneId: string,
  currentItems: ReadonlyArray<string>
): boolean => {
  const rules = ZONE_VALIDATION_RULES[zoneId];
  return rules.maxItems ? currentItems.length >= rules.maxItems : false;
};
