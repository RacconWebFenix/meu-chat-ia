/**
 * DRAG & DROP PIVOT BUILDER - TIPOS E INTERFACES
 *
 * Seguindo princípios SOLID:
 * - Single Responsibility: Cada interface tem uma responsabilidade única
 * - Open/Closed: Extensível sem modificar código existente
 * - Interface Segregation: Interfaces específicas para cada uso
 * - Dependency Inversion: Abstração de tipos concretos
 */

import { UniqueIdentifier } from "@dnd-kit/core";

// ====================================
// FIELD TYPES - Responsabilidade única
// ====================================

export interface BaseFieldOption {
  readonly value: string;
  readonly label: string;
  readonly dataType: "string" | "number" | "date";
}

export interface DimensionOption extends BaseFieldOption {
  readonly dataType: "string" | "date";
}

export interface MetricOption extends BaseFieldOption {
  readonly dataType: "number";
}

export type FieldOption = DimensionOption | MetricOption;

// ====================================
// DRAG & DROP ZONES - Interface Segregation
// ====================================

export type DropZoneId = "rows" | "columns" | "values" | "available";

export interface DropZoneConfig {
  readonly id: DropZoneId;
  readonly title: string;
  readonly acceptedTypes: ReadonlyArray<"string" | "number" | "date">;
  readonly maxItems?: number;
  readonly description: string;
}

// ====================================
// DRAGGABLE ITEMS - Single Responsibility
// ====================================

export interface DraggableFieldItem {
  readonly id: UniqueIdentifier;
  readonly field: FieldOption;
  readonly currentZone: DropZoneId;
  readonly isDisabled: boolean;
}

// ====================================
// PIVOT CONFIGURATION - Open/Closed
// ====================================

export interface PivotConfiguration {
  readonly rows: ReadonlyArray<string>;
  readonly columns: ReadonlyArray<string>;
  readonly values: ReadonlyArray<string>;
  readonly aggregation: AggregationType;
}

export type AggregationType = "sum" | "avg" | "count" | "min" | "max";

// ====================================
// COMPONENT PROPS - Dependency Inversion
// ====================================

export interface DragDropPivotBuilderProps {
  readonly availableFields: ReadonlyArray<DimensionOption>;
  readonly availableMetrics: ReadonlyArray<MetricOption>;
  readonly currentConfig: PivotConfiguration;
  readonly onConfigChange: (config: PivotConfiguration) => void;
  readonly isLoading?: boolean;
}

export interface FieldsListProps {
  readonly fields: ReadonlyArray<FieldOption>;
  readonly usedFields: ReadonlySet<string>;
  readonly searchTerm: string;
  readonly onSearchChange: (term: string) => void;
}

export interface DropZoneProps {
  readonly config: DropZoneConfig;
  readonly items: ReadonlyArray<string>;
  readonly fields: ReadonlyArray<FieldOption>;
  readonly onRemoveItem?: (fieldId: string) => void;
}

export interface DraggableFieldProps {
  readonly item: DraggableFieldItem;
}

export interface SortableFieldItemProps {
  readonly fieldId: string;
  readonly field: FieldOption;
  readonly onRemove?: (fieldId: string) => void;
}

// ====================================
// VALIDATION TYPES - Single Responsibility
// ====================================

export interface FieldValidationResult {
  readonly isValid: boolean;
  readonly errorMessage?: string;
}

export interface ZoneValidationRules {
  readonly canAcceptField: (
    field: FieldOption,
    currentItems: ReadonlyArray<string>
  ) => FieldValidationResult;
  readonly maxItems?: number;
  readonly requiredTypes?: ReadonlyArray<"string" | "number" | "date">;
}

// ====================================
// DRAG & DROP EVENTS - Interface Segregation
// ====================================

export interface DragStartEventData {
  readonly fieldId: string;
  readonly sourceZone: DropZoneId;
  readonly field: FieldOption;
}

export interface DragEndEventData {
  readonly fieldId: string;
  readonly sourceZone: DropZoneId;
  readonly targetZone: DropZoneId;
  readonly field: FieldOption;
}

export interface DragDropEventHandlers {
  readonly onDragStart: (event: DragStartEventData) => void;
  readonly onDragEnd: (event: DragEndEventData) => void;
  readonly onDragCancel: () => void;
}
