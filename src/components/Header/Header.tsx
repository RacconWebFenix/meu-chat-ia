// src/components/Header/Header.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Menu as MenuIcon, Logout as LogoutIcon } from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { usePageTitle } from "@/contexts";
import { useGroup } from "@/contexts/GroupContext";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { pageTitle } = usePageTitle();
  const { groups, selectedGroupId, setSelectedGroupId, isLoading } = useGroup();

  // Verifica se estamos na página principal (com abas PDM/equivalência)
  const isMainPage = pathname === "/" || pathname === "/app";

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await signOut({ redirect: false });
    router.push("/login");
  };

  const handleGroupChange = (event: SelectChangeEvent<number | "">) => {
    const value = event.target.value as number | "";
    setSelectedGroupId(value === 0 || value === "" ? null : value);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "white",
        color: "text.primary",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          edge="start"
          onClick={onMenuClick} // Esta função agora afixa/desafixa o menu
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
          <Image
            src="/assets/logo-comercio-integrado.png"
            alt="Comércio Integrado"
            width={110}
            height={50}
          />
        </Box>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: "bold", color: "primary.main" }}
        >
          {pageTitle}
        </Typography>

        {pathname === "/relatorios" && (
          <FormControl size="small" sx={{ minWidth: 280, mr: 2 }}>
            <Select
              value={isLoading ? "" : selectedGroupId ?? 0}
              onChange={handleGroupChange}
              disabled={isLoading}
              displayEmpty
            >
              {isLoading && (
                <MenuItem value="">
                  {" "}
                  <em>Carregando grupos...</em>{" "}
                </MenuItem>
              )}
              {groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.nome_do_grupo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Button
          color="inherit"
          onClick={handleSignOut}
          disabled={isLoggingOut}
          startIcon={
            isLoggingOut ? <CircularProgress size={18} /> : <LogoutIcon />
          }
        >
          {isLoggingOut ? "Saindo..." : "Sair"}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
