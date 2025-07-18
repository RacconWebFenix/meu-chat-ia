"use client";

import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Typography,
  Box,
} from "@mui/material";
import { Home as HomeIcon, Search as SearchIcon } from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";

const drawerWidth = 280;

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
  description?: string;
}

const menuItems: MenuItem[] = [
  {
    text: "Início",
    icon: <HomeIcon />,
    path: "/",
    description: "Página inicial",
  },
  {
    text: "Pesquisa de Materiais",
    icon: <SearchIcon />,
    path: "/search",
    description: "Chat para pesquisa de materiais",
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant?: "permanent" | "persistent" | "temporary";
  onNavigationStart?: () => void;
  onNavigationEnd?: () => void;
}

export default function Sidebar({
  open,
  onClose,
  variant = "permanent",
  onNavigationStart,
  onNavigationEnd,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    // Se o caminho atual for diferente do caminho de destino, mostra o loading
    if (pathname !== path) {
      onNavigationStart?.();

      // Navegação real
      router.push(path);

      // Simula um tempo mínimo de loading para melhor UX
      setTimeout(() => {
        onNavigationEnd?.();
      }, 800);
    }

    if (variant === "temporary") {
      onClose();
    }
  };

  const drawerContent = (
    <Box
      sx={{
        overflow: "auto",
        height: "100%",
        backgroundColor: "background.default",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ fontWeight: "bold" }}
        >
          Menu Principal
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={isActive}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  minHeight: 60,
                  "&:hover": {
                    "& .MuiListItemText-primary": {
                      color: "primary.main",
                    },
                    "& .MuiListItemText-secondary": {
                      color: "primary.main",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "primary.main",
                    },
                  },
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "white",
                    },
                    "& .MuiListItemText-primary": {
                      color: "white",
                    },
                    "& .MuiListItemText-secondary": {
                      color: "rgba(255,255,255,0.7)",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? "white" : "text.primary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  secondary={item.description}
                  sx={{
                    "& .MuiListItemText-primary": {
                      color: isActive ? "white" : "text.primary",
                      fontWeight: 500,
                    },
                    "& .MuiListItemText-secondary": {
                      color: isActive
                        ? "rgba(255,255,255,0.7)"
                        : "text.primary",
                      fontSize: "0.75rem",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          // boxSizing: "border-box",
          boxShadow: "1px 1px 2px rgba(0,0,0,0.15)",
          // borderRight: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
