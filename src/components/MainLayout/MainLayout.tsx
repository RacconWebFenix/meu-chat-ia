// src/components/MainLayout/MainLayout.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Box, Drawer, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import { usePathname } from "next/navigation";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import GlobalLoading from "../shared/GlobalLoading/GlobalLoading";
import FloatingButton from "../ChatbootQuery/FloatingButton";
import ChatWindow from "../ChatbootQuery/ChatWindow";

const drawerWidth = 0;
const collapsedDrawerWidth = 0; // Largura do menu quando está apenas com os ícones

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  // O estado agora controla se o menu está afixado (expandido)
  const [isSidebarPinned, setSidebarPinned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setIsLoading(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, pathname]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleSidebarPinToggle = () => setSidebarPinned(!isSidebarPinned); // Função para afixar/desafixar
  const handleNavigationStart = () => setIsLoading(true);
  const handleNavigationEnd = () => setIsLoading(false);
  const handleChatWindowToggle = () => setIsChatWindowOpen(!isChatWindowOpen);

  // A largura do espaço reservado pelo menu muda se ele estiver afixado
  const currentDrawerWidth = isSidebarPinned
    ? drawerWidth
    : collapsedDrawerWidth;

  return (
    <Box sx={{ display: "flex" }}>
      <GlobalLoading open={isLoading} />

      <Header
        onMenuClick={isMobile ? handleDrawerToggle : handleSidebarPinToggle}
      />

      <Sidebar
        open={mobileOpen}
        onClose={handleDrawerToggle}
        variant={isMobile ? "temporary" : "permanent"}
        onNavigationStart={handleNavigationStart}
        onNavigationEnd={handleNavigationEnd}
        pinned={isSidebarPinned}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          // A margem e a largura se ajustam dinamicamente
          marginLeft: {
            md: `${isMobile ? 0 : currentDrawerWidth}px`,
          },
          // CORREÇÃO: A largura agora usa 'currentDrawerWidth' para o cálculo
          width: {
            md: `calc(100% - ${isMobile ? 0 : currentDrawerWidth}px)`,
          },
          // CORREÇÃO: Define a cor de fundo correta para a área de conteúdo
          backgroundColor: "background.default",
          minHeight: "100vh", // Garante que o conteúdo ocupe toda a altura da tela 
        }}
      >
        <Toolbar />
        {children}
      </Box>

      <FloatingButton
        onClick={handleChatWindowToggle}
        isOpen={isChatWindowOpen}
      />

      <Drawer
        anchor="right"
        open={isChatWindowOpen}
        onClose={handleChatWindowToggle}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 400, lg: "70%" },
            top: "64px",
            height: "calc(100% - 64px)",
          },
        }}
      >
        <ChatWindow onClose={handleChatWindowToggle} />
      </Drawer>
    </Box>
  );
}
