/**
 * Material Search Header Component
 * Following Single Responsibility Principle
 */

import React from "react";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { MaterialSearchData } from "../types";

interface MaterialSearchHeaderProps {
  searchData: MaterialSearchData;
  onSearchDataChange: (field: keyof MaterialSearchData, value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export const MaterialSearchHeader: React.FC<MaterialSearchHeaderProps> = ({
  searchData,
  onSearchDataChange,
  onSearch,
  isLoading,
}) => {
  const handleInputChange =
    (field: keyof MaterialSearchData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onSearchDataChange(field, event.target.value);
    };

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
          disabled={isLoading}
        />

        <TextField
          fullWidth
          label="Características"
          value={searchData.caracteristicas}
          onChange={handleInputChange("caracteristicas")}
          variant="outlined"
          size="small"
          disabled={isLoading}
        />

        <TextField
          fullWidth
          label="Fabricante / Marca"
          value={searchData.fabricanteMarca}
          onChange={handleInputChange("fabricanteMarca")}
          variant="outlined"
          size="small"
          disabled={isLoading}
        />

        <TextField
          fullWidth
          label="Referência"
          value={searchData.referencia}
          onChange={handleInputChange("referencia")}
          variant="outlined"
          size="small"
          disabled={isLoading}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
          onClick={onSearch}
          disabled={isLoading}
          sx={{
            height: 40,
            width: "100%",
            whiteSpace: "nowrap",
          }}
        >
          {isLoading ? "Identificando..." : "Identificar"}
        </Button>
      </Box>
    </Paper>
  );
};
