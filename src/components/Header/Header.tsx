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
} from "@mui/material";
import { useRouter } from "next/navigation";
import { usePageTitle } from "@/contexts";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { pageTitle } = usePageTitle();

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ redirect: false });
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setIsLoggingOut(false);
    }
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
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            color: "primary.main",
          }}
        >
          {pageTitle}
        </Typography>

        <Button
          color="inherit"
          onClick={handleSignOut}
          disabled={isLoggingOut}
          startIcon={
            isLoggingOut ? (
              <CircularProgress size={18} thickness={4} color="inherit" />
            ) : (
              <LogoutIcon sx={{ color: "text.primary" }} />
            )
          }
          sx={{
            color: "text.primary",
            fontWeight: 500,
            minWidth: "100px",
            "&:hover": {
              backgroundColor: "grey.100",
            },
          }}
        >
          {isLoggingOut ? "Saindo..." : "Sair"}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
