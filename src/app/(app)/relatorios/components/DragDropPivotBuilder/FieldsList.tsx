/**
 * FIELDS LIST COMPONENT - LISTA DE CAMPOS DISPONÍVEIS
 *
 * Seguindo Clean Code e SOLID:
 * - Single Responsibility: Apenas exibir lista de campos
 * - Presentation Component: UI pura
 * - Tipagem estrita sem 'any'
 */

"use client";

import React from "react";
import {
  Paper,
  Typography,
  TextField,
  Box,
  List,
  ListItem,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { FieldsListProps } from "./types";
import { useFieldSearch } from "./hooks";
import { DraggableField } from "./DraggableField";

/**
 * Lista de campos disponíveis para drag & drop
 * Interface similar ao painel de campos do Excel
 */
export const FieldsList: React.FC<FieldsListProps> = ({
  fields,
  usedFields,
  searchTerm: externalSearchTerm,
  onSearchChange,
}) => {
  // ====================================
  // SEARCH FUNCTIONALITY
  // ====================================

  const {
    searchTerm,
    filteredFields,
    onSearchChange: handleInternalSearch,
  } = useFieldSearch(fields);

  const currentSearchTerm = externalSearchTerm || searchTerm;
  const currentFields = externalSearchTerm ? fields : filteredFields;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (externalSearchTerm !== undefined) {
      onSearchChange(value);
    } else {
      handleInternalSearch(value);
    }
  };

  // ====================================
  // RENDER
  // ====================================

  return (
    <Paper
      elevation={1}
      sx={{
        height: 500,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.paper",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 600, fontSize: "1.1rem" }}
        >
          📋 Campos da Tabela Dinâmica
        </Typography>

        {/* Search Field */}
        <TextField
          size="small"
          fullWidth
          placeholder="Pesquisar campos..."
          value={currentSearchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mt: 1 }}
        />
      </Box>

      {/* Fields List */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "grey.100",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "grey.400",
            borderRadius: "4px",
          },
        }}
      >
        <List dense sx={{ p: 1 }}>
          {currentFields.map((field) => {
            const isUsed = usedFields.has(field.value);

            return (
              <DraggableField
                key={field.value}
                item={{
                  id: field.value,
                  field: field,
                  currentZone: "available",
                  isDisabled: isUsed,
                }}
              />
            );
          })}

          {currentFields.length === 0 && (
            <ListItem>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic", textAlign: "center", width: "100%" }}
              >
                {currentSearchTerm
                  ? "Nenhum campo encontrado"
                  : "Carregando campos..."}
              </Typography>
            </ListItem>
          )}
        </List>
      </Box>

      {/* Footer Stats */}
      <Box
        sx={{
          p: 1.5,
          borderTop: 1,
          borderColor: "divider",
          backgroundColor: "grey.50",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          📊 Total: {fields.length} campos | ✅ Em uso: {usedFields.size} | 🔍
          Exibindo: {currentFields.length}
        </Typography>
      </Box>
    </Paper>
  );
};
