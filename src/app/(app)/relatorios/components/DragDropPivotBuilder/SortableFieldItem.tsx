/**
 * SORTABLE FIELD ITEM - ITEM REORDENÁVEL DENTRO DAS ZONAS
 *
 * Seguindo Clean Code e SOLID:
 * - Single Responsibility: Item específico para reordenação
 * - Presentation Component: UI pura
 * - Tipagem estrita sem 'any'
 */

"use client";

import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import CloseIcon from "@mui/icons-material/Close";

import { SortableFieldItemProps } from "./types";

/**
 * Item de campo que pode ser reordenado dentro de uma zona
 * Suporte a drag & drop para reordenação
 */
export const SortableFieldItem: React.FC<SortableFieldItemProps> = ({
  fieldId,
  field,
  onRemove,
}) => {
  // ====================================
  // SORTABLE SETUP
  // ====================================

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: fieldId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // ====================================
  // HANDLERS
  // ====================================

  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onRemove) {
      onRemove(fieldId);
    }
  };

  // ====================================
  // RENDER
  // ====================================

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "background.default",
        borderRadius: 1,
        px: 1.5,
        py: 1,
        border: 1,
        borderColor: isDragging ? "primary.main" : "divider",
        cursor: isDragging ? "grabbing" : "grab",
        "&:hover": {
          backgroundColor: "grey.100",
          "& .remove-button": {
            opacity: 1,
          },
          "& .drag-handle": {
            opacity: 1,
          },
        },
      }}
      {...attributes}
    >
      {/* Drag Handle */}
      <Box
        className="drag-handle"
        sx={{
          display: "flex",
          alignItems: "center",
          mr: 1,
          opacity: 0.5,
          transition: "opacity 0.2s",
          cursor: "grab",
          "&:active": {
            cursor: "grabbing",
          },
        }}
        {...listeners}
      >
        <DragIndicatorIcon fontSize="small" sx={{ color: "grey.500" }} />
      </Box>

      {/* Field Info */}
      <Box sx={{ flex: 1, mr: 1 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            fontSize: "0.875rem",
            lineHeight: 1.2,
          }}
        >
          {field.label}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontSize: "0.7rem",
            display: "block",
          }}
        >
          {field.dataType === "number"
            ? "🔢 Numérico"
            : field.dataType === "date"
            ? "📅 Data"
            : "📝 Texto"}
        </Typography>
      </Box>

      {/* Remove Button */}
      <Tooltip title="Remover campo">
        <IconButton
          size="small"
          onClick={handleRemove}
          className="remove-button"
          sx={{
            opacity: 0,
            transition: "opacity 0.2s",
            p: 0.5,
            "&:hover": {
              backgroundColor: "error.50",
              color: "error.main",
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
