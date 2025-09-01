"use client";

import React, { useState } from "react";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

interface MaterialSearchData {
  nome: string;
  referencia: string;
  marcaFabricante: string;
}

interface MaterialSearchHeaderProps {}

export default function MaterialSearchHeader(
  _props: MaterialSearchHeaderProps
) {
  const [searchData, setSearchData] = useState<MaterialSearchData>({
    nome: "",
    referencia: "",
    marcaFabricante: "",
  });

  const handleInputChange =
    (field: keyof MaterialSearchData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSearchData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSearch = () => {
    console.log("Dados da pesquisa:", searchData);
    // TODO: Implementar lógica de pesquisa
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
        />

        <TextField
          fullWidth
          label="Referência"
          value={searchData.referencia}
          onChange={handleInputChange("referencia")}
          variant="outlined"
          size="small"
          sx={{ flex: 1 }}
        />

        <TextField
          fullWidth
          label="Marca / Fabricante"
          value={searchData.marcaFabricante}
          onChange={handleInputChange("marcaFabricante")}
          variant="outlined"
          size="small"
          sx={{ flex: 1 }}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
          sx={{
            minWidth: { xs: "100%", md: "auto" },
            height: 40,
            whiteSpace: "nowrap",
          }}
        >
          Identificar
        </Button>
      </Box>
    </Paper>
  );
}
