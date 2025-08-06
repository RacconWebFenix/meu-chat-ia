// components/Header/Header.tsx
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
  useMediaQuery,
  useTheme,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { usePageTitle } from "@/contexts";
import { useGroup } from "@/contexts/GroupContext"; // <<<<<< IMPORTADO AQUI

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { pageTitle } = usePageTitle();
  const { groups, selectedGroupId, setSelectedGroupId, isLoading } = useGroup(); // <<<<<< USADO AQUI

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await signOut({ redirect: false });
    router.push("/login");
  };

  const handleGroupChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value as number;
    setSelectedGroupId(value === 0 ? null : value);
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
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
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

        {/* --- NOVO: SELECT DE GRUPOS --- */}
        <FormControl size="small" sx={{ minWidth: 280, mr: 2 }}>
          <Select
            value={isLoading ? "" : selectedGroupId ?? 0}
            onChange={handleGroupChange}
            disabled={isLoading}
            displayEmpty
          >
            {isLoading && (
              <MenuItem value="">
                <em>Carregando grupos...</em>
              </MenuItem>
            )}
            {groups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.nome_do_grupo}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* --- FIM DO SELECT --- */}

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
