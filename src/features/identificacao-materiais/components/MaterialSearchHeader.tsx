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
      }}
    >
      <Typography variant="h6" component="h2" gutterBottom>
        Identificação de Materiais
      </Typography>

      <Box
        sx={{
          mt: 2,
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "flex-end" },
        }}
      >
        <TextField
          fullWidth
          label="Nome"
          value={searchData.nome}
          onChange={handleInputChange("nome")}
          variant="outlined"
          size="small"
          sx={{ flex: 1 }}
          disabled={isLoading}
        />

        <TextField
          fullWidth
          label="Referência"
          value={searchData.referencia}
          onChange={handleInputChange("referencia")}
          variant="outlined"
          size="small"
          sx={{ flex: 1 }}
          disabled={isLoading}
        />

        <TextField
          fullWidth
          label="Marca / Fabricante"
          value={searchData.marcaFabricante}
          onChange={handleInputChange("marcaFabricante")}
          variant="outlined"
          size="small"
          sx={{ flex: 1 }}
          disabled={isLoading}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
          onClick={onSearch}
          disabled={isLoading}
          sx={{
            minWidth: { xs: "100%", md: "auto" },
            height: 40,
            whiteSpace: "nowrap",
          }}
        >
          {isLoading ? "Identificando..." : "Identificar"}
        </Button>
      </Box>
    </Paper>
  );
};
