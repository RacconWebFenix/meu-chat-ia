// src/components/Sidebar/Sidebar.tsx
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
  Theme,
  CSSObject,
} from "@mui/material";
import {
  Search as SearchIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";

const drawerWidth = 280;
const collapsedDrawerWidth = 72;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `${collapsedDrawerWidth}px`,
});

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
  description?: string;
}

const menuItems: MenuItem[] = [
  {
    text: "Pesquisa de Materiais",
    icon: <SearchIcon />,
    path: "/",
    description: "Chat para pesquisa de materiais",
  },
  {
    text: "Relatórios",
    icon: <AssessmentIcon />,
    path: "/relatorios",
    description: "Painel de relatórios e análises",
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant?: "permanent" | "persistent" | "temporary";
  onNavigationStart?: () => void;
  onNavigationEnd?: () => void;
  pinned: boolean;
}

export default function Sidebar({
  open,
  onClose,
  variant = "permanent",
  onNavigationStart,
  onNavigationEnd,
  pinned,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    if (pathname !== path) {
      onNavigationStart?.();
      router.push(path);
      setTimeout(() => onNavigationEnd?.(), 500);
    }
    if (variant === "temporary") {
      onClose();
    }
  };

  const isExpanded = pinned;

  const drawerContent = (
    <Box>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            opacity: isExpanded ? 1 : 0,
            transition: "opacity 0.2s",
          }}
        >
          Menu Principal
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ p: 1 }}>
        {menuItems.map((item) => {
          const isActive =
            item.path === "/"
              ? pathname === item.path
              : pathname.startsWith(item.path);
          return (
            <ListItem
              key={item.text}
              disablePadding
              sx={{ display: "block", mb: 0.5 }}
            >
              <ListItemButton
                selected={isActive}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  minHeight: 60,
                  justifyContent: "initial",
                  px: 2.5,
                  borderRadius: 2,
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "primary.contrastText",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isExpanded ? 0 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  secondary={item.description}
                  sx={{ opacity: isExpanded ? 1 : 0 }}
                  // CORREÇÃO: Utilizando a API 'slotProps' recomendada
                  slotProps={{
                    primary: {
                      style: {
                        fontWeight: isActive ? 600 : 500,
                        color: isActive
                          ? "rgb(246, 246, 246)"
                          : "rgba(0, 5, 59, 0.87)",
                        display: "flex",
                        marginLeft: "1rem",
                      },
                    },
                    secondary: {
                      style: {
                        fontSize: "0.8rem",
                        color: isActive
                          ? "rgb(246, 246, 246)"
                          : "rgba(0, 5, 59, 0.87)",
                        marginLeft: "1rem",
                      },
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
      open={variant === "temporary" ? open : true}
      onClose={onClose}
      sx={(theme) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        ...(variant === "permanent" && {
          ...(pinned ? openedMixin(theme) : closedMixin(theme)),
          "& .MuiDrawer-paper": pinned
            ? openedMixin(theme)
            : closedMixin(theme),
          ...(!pinned && {
            "& .MuiDrawer-paper:hover": {
              ...openedMixin(theme),
              boxShadow: theme.shadows[4],
              "& .MuiListItemText-root": {
                opacity: 1,
                transition: theme.transitions.create("opacity", {
                  delay: theme.transitions.duration.enteringScreen / 2,
                }),
              },
            },
          }),
        }),
      })}
    >
      {drawerContent}
    </Drawer>
  );
}
