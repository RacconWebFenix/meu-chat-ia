/**
 * DRAG & DROP HOOKS - APPLICATION LOGIC
 *
 * Seguindo Clean Code e SOLID:
 * - Separação de responsabilidades
 * - Hooks específicos para cada funcionalidade
 * - Estado imutável com readonly
 * - Tipagem estrita sem 'any'
 */

import { useState, useCallback, useMemo } from "react";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import {
  PivotConfiguration,
  FieldOption,
  DropZoneId,
  DragStartEventData,
  DragEndEventData,
} from "./types";
import { findFieldByValue, ALL_AVAILABLE_FIELDS } from "./fieldConfig";
import { validateFieldDrop } from "./zoneConfig";

// ====================================
// SEARCH HOOK - Single Responsibility
// ====================================

export const useFieldSearch = (fields: ReadonlyArray<FieldOption>) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredFields = useMemo(() => {
    if (!searchTerm.trim()) return fields;

    const lowercaseSearch = searchTerm.toLowerCase();
    return fields.filter(
      (field) =>
        field.label.toLowerCase().includes(lowercaseSearch) ||
        field.value.toLowerCase().includes(lowercaseSearch)
    );
  }, [fields, searchTerm]);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  return {
    searchTerm,
    filteredFields,
    onSearchChange: handleSearchChange,
  };
};

// ====================================
// USED FIELDS TRACKER - State Management
// ====================================

export const useUsedFields = (config: PivotConfiguration) => {
  const usedFields = useMemo(() => {
    const allUsedFields = new Set<string>();

    config.filters.forEach((field) => allUsedFields.add(field));
    config.rows.forEach((field) => allUsedFields.add(field));
    config.columns.forEach((field) => allUsedFields.add(field));
    config.values.forEach((field) => allUsedFields.add(field));

    return allUsedFields;
  }, [config]);

  const isFieldUsed = useCallback(
    (fieldValue: string): boolean => {
      return usedFields.has(fieldValue);
    },
    [usedFields]
  );

  const getFieldZone = useCallback(
    (fieldValue: string): DropZoneId | null => {
      if (config.filters.includes(fieldValue)) return "filters";
      if (config.rows.includes(fieldValue)) return "rows";
      if (config.columns.includes(fieldValue)) return "columns";
      if (config.values.includes(fieldValue)) return "values";
      return null;
    },
    [config]
  );

  return {
    usedFields,
    isFieldUsed,
    getFieldZone,
  };
};

// ====================================
// DRAG & DROP STATE MANAGEMENT
// ====================================

export const useDragDropPivot = (
  initialConfig: PivotConfiguration,
  onConfigChange: (config: PivotConfiguration) => void
) => {
  const [activeField, setActiveField] = useState<FieldOption | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const fieldId = event.active.id as string;
    const field = findFieldByValue(fieldId);

    if (field) {
      setActiveField(field);
      setIsDragging(true);
    }
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveField(null);
      setIsDragging(false);

      if (!over || !active) return;

      const fieldId = active.id as string;
      const targetZoneId = over.id as string;
      const field = findFieldByValue(fieldId);

      if (!field) return;

      // Validar se o drop é permitido
      const currentZoneItems = getCurrentZoneItems(initialConfig, targetZoneId);
      const validation = validateFieldDrop(
        targetZoneId,
        field,
        currentZoneItems
      );

      if (!validation.isValid) {
        console.warn("Drop inválido:", validation.errorMessage);
        return;
      }

      // Aplicar mudança na configuração
      const newConfig = moveFieldToZone(initialConfig, fieldId, targetZoneId);
      onConfigChange(newConfig);
    },
    [initialConfig, onConfigChange]
  );

  const handleDragCancel = useCallback(() => {
    setActiveField(null);
    setIsDragging(false);
  }, []);

  const removeFieldFromZone = useCallback(
    (fieldId: string) => {
      const newConfig = removeFieldFromAllZones(initialConfig, fieldId);
      onConfigChange(newConfig);
    },
    [initialConfig, onConfigChange]
  );

  const reorderFieldsInZone = useCallback(
    (zoneId: DropZoneId, oldIndex: number, newIndex: number) => {
      const newConfig = reorderFields(
        initialConfig,
        zoneId,
        oldIndex,
        newIndex
      );
      onConfigChange(newConfig);
    },
    [initialConfig, onConfigChange]
  );

  return {
    activeField,
    isDragging,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onDragCancel: handleDragCancel,
    onRemoveField: removeFieldFromZone,
    onReorderFields: reorderFieldsInZone,
  };
};

// ====================================
// UTILITY FUNCTIONS - Pure Functions
// ====================================

const getCurrentZoneItems = (
  config: PivotConfiguration,
  zoneId: string
): ReadonlyArray<string> => {
  switch (zoneId) {
    case "filters":
      return config.filters;
    case "rows":
      return config.rows;
    case "columns":
      return config.columns;
    case "values":
      return config.values;
    default:
      return [];
  }
};

const removeFieldFromAllZones = (
  config: PivotConfiguration,
  fieldId: string
): PivotConfiguration => {
  return {
    ...config,
    filters: config.filters.filter((id) => id !== fieldId),
    rows: config.rows.filter((id) => id !== fieldId),
    columns: config.columns.filter((id) => id !== fieldId),
    values: config.values.filter((id) => id !== fieldId),
  };
};

const moveFieldToZone = (
  config: PivotConfiguration,
  fieldId: string,
  targetZoneId: string
): PivotConfiguration => {
  // Primeiro remove de todas as zonas
  const cleanConfig = removeFieldFromAllZones(config, fieldId);

  // Depois adiciona na zona de destino
  switch (targetZoneId) {
    case "filters":
      return { ...cleanConfig, filters: [...cleanConfig.filters, fieldId] };
    case "rows":
      return { ...cleanConfig, rows: [...cleanConfig.rows, fieldId] };
    case "columns":
      return { ...cleanConfig, columns: [...cleanConfig.columns, fieldId] };
    case "values":
      return { ...cleanConfig, values: [...cleanConfig.values, fieldId] };
    default:
      return cleanConfig;
  }
};

const reorderFields = (
  config: PivotConfiguration,
  zoneId: DropZoneId,
  oldIndex: number,
  newIndex: number
): PivotConfiguration => {
  switch (zoneId) {
    case "filters":
      return {
        ...config,
        filters: arrayMove([...config.filters], oldIndex, newIndex),
      };
    case "rows":
      return {
        ...config,
        rows: arrayMove([...config.rows], oldIndex, newIndex),
      };
    case "columns":
      return {
        ...config,
        columns: arrayMove([...config.columns], oldIndex, newIndex),
      };
    case "values":
      return {
        ...config,
        values: arrayMove([...config.values], oldIndex, newIndex),
      };
    default:
      return config;
  }
};
