// src/app/(app)/relatorios/components/DragDropPivotBuilder/index.tsx
"use client";

import React, { useState } from "react";
import { Paper, Typography, Box, Button, TextField } from "@mui/material";
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

export const DragDropPivotBuilder: React.FC<DragDropPivotBuilderProps> = ({
  availableFields,
  availableMetrics,
  currentConfig,
  onConfigChange,
  isLoading = false,
  filters,
  onFilterChange,
  onApplyFilters,
  filterLoading = false,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const {
    activeField,
    isDragging,
    onDragStart,
    onDragEnd,
    onDragCancel,
    onRemoveField,
  } = useDragDropPivot(currentConfig, onConfigChange);

  const { usedFields } = useUsedFields(currentConfig);
  const [searchTerm, setSearchTerm] = useState("");

  const allFields = React.useMemo(
    () => [...availableFields, ...availableMetrics],
    [availableFields, availableMetrics]
  );

  // Separa as configurações das zonas para controle de layout
  const rowsZoneConfig = DROP_ZONE_CONFIGS.find((z) => z.id === "rows");
  const columnsZoneConfig = DROP_ZONE_CONFIGS.find((z) => z.id === "columns");
  const valuesZoneConfig = DROP_ZONE_CONFIGS.find((z) => z.id === "values");

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
      <Box
        sx={{
          mb: 3,
          p: 2,
          backgroundColor: "info.50",
          borderRadius: 2,
          border: 1,
          borderColor: "info.200",
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          📊 Construtor de Tabela Dinâmica
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          💡 <strong>Arraste os campos</strong> da lista para as áreas de
          configuração para montar seu relatório.
        </Typography>

        {/* Filtros de Data */}
        {filters && onFilterChange && onApplyFilters && (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, mt: 2 }}
            >
              📅 Filtros de Data
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <TextField
                label="Data Início"
                type="date"
                value={(filters?.startDate as string) || ""}
                onChange={(e) => onFilterChange?.("startDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                sx={{ minWidth: 150 }}
              />
              <TextField
                label="Data Fim"
                type="date"
                value={(filters?.endDate as string) || ""}
                onChange={(e) => onFilterChange?.("endDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                sx={{ minWidth: 150 }}
              />
              <Button
                variant="contained"
                onClick={onApplyFilters}
                disabled={filterLoading}
                sx={{ height: 40 }}
              >
                {filterLoading ? "Filtrando..." : "FILTRAR"}
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
      >
        <Box sx={{ display: "flex", gap: 3, minHeight: 500 }}>
          <Box sx={{ flex: 1, minWidth: 300, maxWidth: 400 }}>
            <FieldsList
              fields={allFields}
              usedFields={usedFields}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </Box>

          {/* ✅ ÁREA DE CONFIGURAÇÃO COM LAYOUT CORRIGIDO */}
          <Box
            sx={{ flex: 2, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              🎯 Áreas da Tabela
            </Typography>

            {/* Linha para Colunas e Linhas */}
            <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
              {rowsZoneConfig && (
                <Box sx={{ flex: 1 }}>
                  <DropZone
                    config={rowsZoneConfig}
                    items={getCurrentZoneItems(currentConfig, "rows")}
                    fields={allFields}
                    onRemoveItem={onRemoveField}
                  />
                </Box>
              )}
              {columnsZoneConfig && (
                <Box sx={{ flex: 1 }}>
                  <DropZone
                    config={columnsZoneConfig}
                    items={getCurrentZoneItems(currentConfig, "columns")}
                    fields={allFields}
                    onRemoveItem={onRemoveField}
                  />
                </Box>
              )}
            </Box>

            {/* Linha para Valores */}
            <Box sx={{ display: "flex", flex: 1 }}>
              {valuesZoneConfig && (
                <Box sx={{ flex: 1 }}>
                  <DropZone
                    config={valuesZoneConfig}
                    items={getCurrentZoneItems(currentConfig, "values")}
                    fields={allFields}
                    onRemoveItem={onRemoveField}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>

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
    </Paper>
  );
};

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
