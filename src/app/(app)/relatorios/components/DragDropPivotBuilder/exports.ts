/**
 * DRAG & DROP PIVOT BUILDER - EXPORTS
 *
 * Facilita importações e mantém encapsulamento
 * Seguindo padrão de barrel exports
 */

// Componente principal
export { DragDropPivotBuilder } from "./index";

// Tipos públicos
export type {
  DragDropPivotBuilderProps,
  PivotConfiguration,
  FieldOption,
  DimensionOption,
  MetricOption,
  DropZoneId,
  AggregationType,
} from "./types";

// Configurações de campos (para uso externo se necessário)
export {
  DIMENSION_OPTIONS,
  METRIC_OPTIONS,
  ALL_AVAILABLE_FIELDS,
  findFieldByValue,
  isDimensionField,
  isMetricField,
} from "./fieldConfig";

// Hooks customizados (para uso em outros componentes se necessário)
export { useFieldSearch, useUsedFields, useDragDropPivot } from "./hooks";
