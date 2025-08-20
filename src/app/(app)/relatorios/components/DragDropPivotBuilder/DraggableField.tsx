/**
 * DRAGGABLE FIELD COMPONENT - CAMPO ARRASTÁVEL
 *
 * Seguindo Clean Code e SOLID:
 * - Single Responsibility: Campo individual que pode ser arrastado
 * - Presentation Component: UI pura
 * - Tipagem estrita sem 'any'
 */

"use client";

import React from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Paper,
} from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import { DraggableFieldProps } from "./types";

/**
 * Campo individual que pode ser arrastado da lista para as zonas
 * Usado tanto na lista quanto no overlay de drag
 */
export const DraggableField: React.FC<DraggableFieldProps> = ({
  item,
  showCheckbox = true,
}) => {
  // ====================================
  // DRAGGABLE SETUP
  // ====================================

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
      disabled: item.isDisabled,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  // ====================================
  // RENDER
  // ====================================

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      elevation={isDragging ? 8 : 1}
      sx={{
        p: 1.5,
        mb: 0.5,
        borderRadius: 1,
        backgroundColor: item.isDisabled ? "grey.100" : "background.paper",
        cursor: item.isDisabled ? "not-allowed" : "grab",
        opacity: item.isDisabled ? 0.6 : isDragging ? 0.8 : 1,
        border: isDragging ? 2 : 1,
        borderColor: isDragging ? "primary.main" : "divider",
        "&:hover": {
          backgroundColor: item.isDisabled ? "grey.100" : "primary.50",
          borderColor: item.isDisabled ? "divider" : "primary.main",
        },
        transition: "all 0.2s ease-in-out",
        userSelect: "none",
      }}
      {...attributes}
      {...listeners}
    >
      {showCheckbox ? (
        <FormControlLabel
          control={
            <Checkbox
              checked={!item.isDisabled}
              disabled={item.isDisabled}
              size="small"
              sx={{ mr: 1 }}
            />
          }
          label={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: item.isDisabled ? 400 : 500,
                    color: item.isDisabled ? "text.disabled" : "text.primary",
                    lineHeight: 1.3,
                  }}
                >
                  {item.field.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: item.isDisabled ? "text.disabled" : "text.secondary",
                    textTransform: "uppercase",
                    fontSize: "0.7rem",
                    display: "block",
                  }}
                >
                  {item.field.dataType === "number"
                    ? "🔢 Numérico"
                    : item.field.dataType === "date"
                    ? "📅 Data"
                    : "📝 Texto"}
                </Typography>
              </Box>

              {!item.isDisabled && (
                <DragIndicatorIcon
                  sx={{
                    color: "grey.400",
                    fontSize: "1.2rem",
                    ml: 1,
                  }}
                />
              )}
            </Box>
          }
          sx={{
            m: 0,
            width: "100%",
            "& .MuiFormControlLabel-label": {
              width: "100%",
            },
          }}
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: "text.primary",
                lineHeight: 1.3,
              }}
            >
              {item.field.label}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                textTransform: "uppercase",
                fontSize: "0.7rem",
                display: "block",
              }}
            >
              {item.field.dataType === "number"
                ? "🔢 Numérico"
                : item.field.dataType === "date"
                ? "📅 Data"
                : "📝 Texto"}
            </Typography>
          </Box>

          <DragIndicatorIcon
            sx={{
              color: "grey.400",
              fontSize: "1.2rem",
              ml: 1,
            }}
          />
        </Box>
      )}
    </Paper>
  );
};
