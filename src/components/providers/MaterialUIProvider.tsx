"use client";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
const theme = createTheme({
  palette: {
    mode: "light",
    error: {
      main: "#d32f2f", // Vermelho para erros
      contrastText: "#fff", // Texto branco para contraste
    },
    warning: {
      main: "#f57c00", // Laranja para avisos
      contrastText: "#fff", // Texto branco para contraste
    },
    info: {
      main: "#1976d2", // Azul para informações
      contrastText: "#fff", // Texto branco para contraste
    },
    primary: {
      main: "#005c99", // Azul intermediário
      dark: "#003c67", // Azul escuro
      light: "#0173bc", // Azul principal
      
    },
    secondary: {
      main: "#fff",
      contrastText: "#003c67",
      
    },
    background: {
      default: "#f6f7f7", 
      paper: "#b8cedb",
    },
    text: {
      primary: "#003c67", // Texto azul escuro para componentes
      secondary: "#666666", // Texto secundário
      disabled: "#999999", // Texto desabilitado
    },
  },
  typography: {
    fontFamily: "var(--font-geist-sans), Roboto, Arial, sans-serif",
    h1: {
      color: "#ffffff",
    },
    h2: {
      color: "#ffffff",
    },
    h3: {
      color: "#ffffff",
    },
    h4: {
      color: "#ffffff",
    },
    h5: {
      color: "#ffffff",
    },
    h6: {
      color: "#ffffff",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#0173bc",
          color: "#ffffff",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
          color: "#005c99",
          borderRight: "none",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: "#003c67",
          fontWeight: 500,
        },
        secondary: {
          color: "#fff",
          fontSize: "0.75rem",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "#003c67",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: "bold",
          transition: "background 0.2s",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#ffffff",
            "& fieldset": {
              borderColor: "#005c99",
            },
            "&:hover fieldset": {
              borderColor: "#003c67",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#005c99",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#005c99",
          },
          "& .MuiOutlinedInput-input": {
            color: "#003c67",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
          color: "#003c67",
          borderRadius: 12,
        },
      },
    },
  },
});

export default function MaterialUIProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
