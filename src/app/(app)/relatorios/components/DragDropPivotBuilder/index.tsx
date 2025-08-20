/**
 * DRAG & DROP PIVOT BUILDER - COMPONENTE PRINCIPAL
 *
 * Seguindo Clean Code e SOLID:
 * - Interface Component (UI Layer)
 * - Responsabilidade única: Coordenar drag & drop
 * - Dependency Inversion: Recebe dependências via props
 * - Open/Closed: Extensível sem modificar código
 */

"use client";

import React from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { DragDropPivotBuilderProps, PivotConfiguration } from "./types";
import { useDragDropPivot, useUsedFields } from "./hooks";
import { FieldsList } from "./FieldsList";
import { DropZone } from "./DropZone";
import { DraggableField } from "./DraggableField";
import { DROP_ZONE_CONFIGS } from "./zoneConfig";

/**
 * Componente principal do construtor de tabela dinâmica com drag & drop
 * Interface similar ao Excel para configuração de pivots
 */
export const DragDropPivotBuilder: React.FC<DragDropPivotBuilderProps> = ({
  availableFields,
  availableMetrics,
  currentConfig,
  onConfigChange,
  isLoading = false,
}) => {
  // ====================================
  // CONFIGURAÇÃO DE SENSORES
  // ====================================

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Previne conflito com cliques
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ====================================
  // HOOKS CUSTOMIZADOS
  // ====================================

  const {
    activeField,
    isDragging,
    onDragStart,
    onDragEnd,
    onDragCancel,
    onRemoveField,
  } = useDragDropPivot(currentConfig, onConfigChange);

  const { usedFields } = useUsedFields(currentConfig);

  // ====================================
  // CAMPOS COMBINADOS
  // ====================================

  const allFields = React.useMemo(
    () => [...availableFields, ...availableMetrics],
    [availableFields, availableMetrics]
  );

  // ====================================
  // CONFIGURAÇÕES DAS ZONAS
  // ====================================

  const dropZones = React.useMemo(
    () => DROP_ZONE_CONFIGS.filter((zone) => zone.id !== "available"),
    []
  );

  // ====================================
  // RENDER
  // ====================================

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        backgroundColor: "background.paper",
        opacity: isLoading ? 0.7 : 1,
        pointerEvents: isLoading ? "none" : "auto",
      }}
    >
      {/* Indicador de Drag Ativo */}
      {isDragging && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mb: 2,
            color: "primary.main",
            fontStyle: "italic",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          🔄 Arrastando: {activeField?.label}
        </Typography>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
      >
        <Box sx={{ display: "flex", gap: 3, height: 500 }}>
          {/* ====================================
              LISTA DE CAMPOS DISPONÍVEIS
              ==================================== */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <FieldsList
              fields={allFields}
              usedFields={usedFields}
              searchTerm=""
              onSearchChange={() => {}}
            />
          </Box>

          {/* ====================================
              ÁREAS DE CONFIGURAÇÃO
              ==================================== */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600, mb: 2 }}
            >
              🎯 Configuração da Tabela Dinâmica
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                height: "calc(100% - 40px)",
              }}
            >
              {dropZones.map((zoneConfig) => {
                const currentItems = getCurrentZoneItems(
                  currentConfig,
                  zoneConfig.id
                );

                return (
                  <Box key={zoneConfig.id}>
                    <DropZone
                      config={zoneConfig}
                      items={currentItems}
                      fields={allFields}
                      onRemoveItem={onRemoveField}
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>

        {/* ====================================
            DRAG OVERLAY - Visual Feedback
            ==================================== */}
        <DragOverlay>
          {activeField ? (
            <DraggableField
              item={{
                id: activeField.value,
                field: activeField,
                currentZone: "available",
                isDisabled: false,
              }}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* ====================================
          TÍTULO E INSTRUÇÕES DE USO
          ==================================== */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          backgroundColor: "info.50",
          borderRadius: 2,
          border: 1,
          borderColor: "info.200",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            fontWeight: 600,
            color: "info.900",
          }}
        >
          📊 Construtor de Tabela Dinâmica
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "info.800",
            lineHeight: 1.6,
            "& strong": {
              fontWeight: 600,
              color: "info.900",
            },
          }}
        >
          💡 <strong>Como usar o Drag & Drop:</strong>{" "}
          <strong>① Arraste campos</strong> da lista à esquerda para as áreas de
          configuração. <strong>② Filtros/Linhas/Colunas</strong> aceitam campos
          de texto e data. <strong>③ Valores</strong> aceita apenas campos
          numéricos para agregação. <strong>④ Reordene</strong> arrastando
          dentro das áreas. <strong>⑤ Remova</strong> clicando no ✕ ou
          arrastando de volta para a lista.
        </Typography>
      </Box>
    </Paper>
  );
};

// ====================================
// UTILITY FUNCTIONS
// ====================================

const getCurrentZoneItems = (
  config: PivotConfiguration,
  zoneId: string
): ReadonlyArray<string> => {
  switch (zoneId) {
    case "rows":
      return config.rows || [];
    case "columns":
      return config.columns || [];
    case "values":
      return config.values || [];
    default:
      return [];
  }
};
