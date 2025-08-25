"use client";

import { createTheme, PaletteOptions } from "@mui/material/styles";

// Definindo a paleta de cores como uma constante separada
const corporatePalette: PaletteOptions = {
  mode: "light",
  primary: {
    main: "#00529B", // Azul Corporativo
    contrastText: "#F8F9FA", // Branco Gelo para texto
  },
  secondary: {
    main: "#6C757D", // Cinza Médio
    contrastText: "#F8F9FA",
  },
  background: {
    default: "#F8F9FA", // Branco Gelo (Fundo Principal)
    paper: "#FFFFFF", // Branco para os cards/seções
  },
  text: {
    primary: "#212529", // Grafite (Texto Principal)
    secondary: "#6C757D", // Cinza Médio
  },
  divider: "#E9ECEF", // Cinza Claro para bordas e divisórias
  info: {
    main: "#00529B",
  },
};

const theme = createTheme({
  palette: corporatePalette,
  typography: {
    fontFamily: "Arial, sans-serif",
    // CORREÇÃO: Acessando a cor diretamente do objeto palette, que é garantido de existir
    // dentro da configuração do tema. Usamos o valor literal para evitar o erro de tipo.
    h5: {
      fontWeight: 700,
      color: "#212529", // Cor do texto primário (Grafite)
    },
    h6: {
      fontWeight: 600,
      color: "#212529", // Cor do texto primário (Grafite)
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 5,
          textTransform: "none",
          fontWeight: "bold",
        },
      },
    },
  },
});

export default theme;
