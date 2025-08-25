"use client";

import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
// CORREÇÃO: Importando nosso tema centralizado!
import theme from "@/theme";

interface MaterialUIProviderProps {
  children: React.ReactNode;
}

export default function MaterialUIProvider({
  children,
}: MaterialUIProviderProps) {
  return (
    // O ThemeProvider agora usa o tema que importamos do arquivo theme.ts
    <ThemeProvider theme={theme}>
      {/* CssBaseline é essencial. Ele aplica a cor de fundo 'default' 
          e reseta os estilos do navegador, eliminando o azul #b8cedb */}
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
