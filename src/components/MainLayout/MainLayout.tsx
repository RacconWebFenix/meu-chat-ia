"use client";

import React, { useState, useEffect } from "react";
import { Box, Drawer, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import { usePathname } from "next/navigation";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import GlobalLoading from "../shared/GlobalLoading/GlobalLoading";
import FloatingButton from "../ChatbootQuery/FloatingButton";
import ChatWindow from "../ChatbootQuery/ChatWindow";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pathname = usePathname();

  // Safety mechanism to ensure loading doesn't get stuck
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000); // 3 seconds max loading time

      return () => clearTimeout(timer);
    }
  }, [isLoading, pathname]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigationStart = () => {
    setIsLoading(true);
  };

  const handleNavigationEnd = () => {
    setIsLoading(false);
  };

  const handleChatWindowToggle = () => {
    setIsChatWindowOpen(!isChatWindowOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <GlobalLoading open={isLoading} />

      <Header onMenuClick={handleDrawerToggle} />

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar
          open={true}
          onClose={() => {}}
          variant="permanent"
          onNavigationStart={handleNavigationStart}
          onNavigationEnd={handleNavigationEnd}
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <Sidebar
          open={mobileOpen}
          onClose={handleDrawerToggle}
          variant="temporary"
          onNavigationStart={handleNavigationStart}
          onNavigationEnd={handleNavigationEnd}
        />
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - 80px)` },
          minHeight: "100vh",
          backgroundColor: "background.default",
          border: "none",
          borderLeft: "none",
        }}
      >
        <Toolbar /> {/* This creates space for the fixed header */}
        {/* Welcome message */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            backgroundColor: "white",
            borderRadius: 1,
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          }}
        >
          <Box sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
            Bem-vindo ao Ambiente de Pesquisa, Relatórios e Métricas da Comércio
            Integrado
          </Box>
        </Box>
        {children}
      </Box>
      <FloatingButton onClick={handleChatWindowToggle}  isOpen={isChatWindowOpen} />

      {/* Janela do Chatbot (Drawer) */}
      <Drawer
        anchor="right" // Abre da direita
        open={isChatWindowOpen} // Controlado pelo estado
        onClose={handleChatWindowToggle} // Permite fechar o chat
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 400, lg: "70%" }, // Largura responsiva da janela do chat
            boxSizing: "border-box",
            boxShadow: "-4px 0 8px rgba(0,0,0,0.1)",
            top: "64px", // Posiciona abaixo do Header
            height: "calc(100% - 64px)", // Ocupa o restante da altura
            borderRadius: "8px 0 0 8px", // Opcional: borda arredondada na lateral visível
          },
        }}
      >
        <ChatWindow onClose={handleChatWindowToggle} />
      </Drawer>
    </Box>
  );
}
