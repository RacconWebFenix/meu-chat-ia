/**
 * Material Search Header Component
 * Following Single Responsibility Principle
 */

import React from "react";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { MaterialSearchData } from "../../types";

interface MaterialSearchHeaderProps {
  searchData: MaterialSearchData;
  onSearchDataChange: (field: keyof MaterialSearchData, value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  isLoading: boolean;
}

export const MaterialSearchHeader: React.FC<MaterialSearchHeaderProps> = ({
  searchData,
  onSearchDataChange,
  onSearch,
  onClear,
  isLoading,
}) => {
  // Função para sanitizar entrada removendo aspas e caracteres problemáticos
  const sanitizeInput = (value: string): string => {
    return value
      .trim()
      .replace(/["']/g, "") // Remove aspas simples e duplas
      .replace(/\s+/g, " ") // Substitui múltiplos espaços por um único
      .replace(/[<>\[\]{}]/g, "") // Remove caracteres potencialmente problemáticos
      .slice(0, 500); // Limita o tamanho para evitar inputs muito longos
  };

  const handleInputChange =
    (field: keyof MaterialSearchData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const sanitizedValue = sanitizeInput(event.target.value);
      onSearchDataChange(field, sanitizedValue);
    };

  // Verifica se há algum valor preenchido nos campos de busca
  const hasData = Object.values(searchData).some(
    (value) => value.trim() !== ""
  );

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        backgroundColor: "background.paper",
        position: "sticky",
        top: 50, // Altura típica do header/app bar
        zIndex: 1000,
        borderRadius: 0,
        boxShadow: (theme) => `0 2px 8px ${theme.palette.grey[300]}`,
      }}
    >
      <Box
        sx={{
          mt: 2,
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(5, 1fr)",
          },
          alignItems: "flex-start",
        }}
      >
        <TextField
          fullWidth
          label="Nome"
          value={searchData.nome}
          onChange={handleInputChange("nome")}
          variant="outlined"
          size="small"
        />

        <TextField
          fullWidth
          label="Características"
          value={searchData.caracteristicas}
          onChange={handleInputChange("caracteristicas")}
          variant="outlined"
          size="small"
        />

        <TextField
          fullWidth
          label="Fabricante / Marca"
          value={searchData.fabricanteMarca}
          onChange={handleInputChange("fabricanteMarca")}
          variant="outlined"
          size="small"
        />

        <TextField
          fullWidth
          label="Referência"
          value={searchData.referencia}
          onChange={handleInputChange("referencia")}
          variant="outlined"
          size="small"
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            width: "100%",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={onSearch}
            disabled={!hasData}
            sx={{
              height: 40,
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {isLoading ? "Identificando..." : "Identificar"}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ClearIcon />}
            onClick={onClear}
            disabled={!hasData}
            sx={{
              height: 40,
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            Limpar
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
