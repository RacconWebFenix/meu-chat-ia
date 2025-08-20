/**
 * DROP ZONE COMPONENT - ÁREA DE DROP PARA CAMPOS
 *
 * Seguindo Clean Code e SOLID:
 * - Single Responsibility: Área específica para receber campos
 * - Interface Segregation: Props específicas para drop zones
 * - Tipagem estrita sem 'any'
 */

"use client";

import React from "react";
import {
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import CloseIcon from "@mui/icons-material/Close";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import CalculateIcon from "@mui/icons-material/Calculate";

import { DropZoneProps } from "./types";
import { findFieldByValue } from "./fieldConfig";

/**
 * Zona de drop para configuração de campos da tabela dinâmica
 * Interface similar às áreas de configuração do Excel
 */
export const DropZone: React.FC<DropZoneProps> = ({
  config,
  items,
  fields,
  onRemoveItem,
}) => {
  // ====================================
  // DROPPABLE SETUP
  // ====================================

  const { setNodeRef, isOver } = useDroppable({
    id: config.id,
  });

  // ====================================
  // HELPERS
  // ====================================

  const getZoneIcon = () => {
    switch (config.id) {
      case "rows":
        return <ViewListIcon />;
      case "columns":
        return <ViewColumnIcon />;
      case "values":
        return <CalculateIcon />;
      default:
        return null;
    }
  };

  const getZoneColor = () => {
    switch (config.id) {
      case "rows":
        return "primary";
      case "columns":
        return "secondary";
      case "values":
        return "success";
      default:
        return "default";
    }
  };

  const handleRemoveField = (fieldId: string) => {
    if (onRemoveItem) {
      onRemoveItem(fieldId);
    }
  };

  // ====================================
  // RENDER
  // ====================================

  return (
    <Paper
      ref={setNodeRef}
      elevation={isOver ? 4 : 1}
      sx={{
        height: "100%",
        minHeight: 120,
        p: 2,
        display: "flex",
        flexDirection: "column",
        backgroundColor: isOver ? `${getZoneColor()}.50` : "background.paper",
        border: 2,
        borderColor: isOver ? `${getZoneColor()}.main` : "divider",
        borderStyle: isOver ? "solid" : "dashed",
        transition: "all 0.2s ease-in-out",
        cursor: isOver ? "copy" : "default",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 1.5,
          pb: 1,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        {getZoneIcon()}
        <Typography
          variant="subtitle2"
          sx={{
            ml: 1,
            fontWeight: 600,
            color: `${getZoneColor()}.main`,
          }}
        >
          {config.title}
        </Typography>

        {items.length > 0 && (
          <Chip
            label={items.length}
            size="small"
            color={
              getZoneColor() as
                | "primary"
                | "secondary"
                | "error"
                | "info"
                | "success"
                | "warning"
                | "default"
            }
            sx={{ ml: "auto", minWidth: 32 }}
          />
        )}
      </Box>

      {/* Drop Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          minHeight: 80,
        }}
      >
        {items.length > 0 ? (
          <SortableContext
            items={[...items]}
            strategy={verticalListSortingStrategy}
          >
            {items.map((fieldId) => {
              const field = findFieldByValue(fieldId);
              if (!field) return null;

              return (
                <Box
                  key={fieldId}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "background.default",
                    borderRadius: 1,
                    px: 1.5,
                    py: 1,
                    border: 1,
                    borderColor: "divider",
                    "&:hover": {
                      backgroundColor: "grey.100",
                      "& .remove-button": {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    }}
                  >
                    {field.label}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      mr: 1,
                      color: "text.secondary",
                      fontSize: "0.7rem",
                    }}
                  >
                    {field.dataType === "number"
                      ? "🔢"
                      : field.dataType === "date"
                      ? "📅"
                      : "📝"}
                  </Typography>

                  <Tooltip title="Remover campo">
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveField(fieldId)}
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
            })}
          </SortableContext>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: 2,
              borderColor: "grey.300",
              borderStyle: "dashed",
              borderRadius: 1,
              backgroundColor: isOver ? `${getZoneColor()}.50` : "grey.50",
              transition: "all 0.2s ease-in-out",
              minHeight: 60,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontStyle: "italic",
                textAlign: "center",
                px: 2,
              }}
            >
              {isOver
                ? `Solte aqui para adicionar à ${config.title.toLowerCase()}`
                : config.description}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Footer Info */}
      {config.maxItems && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            mt: 1,
            pt: 1,
            borderTop: 1,
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          Máximo: {config.maxItems} campos
        </Typography>
      )}
    </Paper>
  );
};
