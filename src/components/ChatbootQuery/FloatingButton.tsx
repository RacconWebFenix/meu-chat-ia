"use client";
import React from "react";
import { Fab, Fade, Typography, Box } from "@mui/material";
import Image from "next/image";

interface FloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function FloatingButton({
  onClick,
  isOpen,
}: FloatingButtonProps) {
  return (
    <div hidden>
      <Fade in={!isOpen} timeout={400} unmountOnExit>
        <Fab
          variant="extended"
          color="primary"
          aria-label="Abrir chat"
          onClick={onClick}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: (theme) => theme.zIndex.drawer + 2,
            height: "64px",
            padding: "0 24px",
            boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
            transition:
              "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 8px 28px rgba(0,0,0,0.3)",
            },
          }}
        >
          <Box sx={{ mr: 1.5, display: "flex", alignItems: "center" }}>
            {/* --- CORREÇÃO APLICADA AQUI --- */}
            <Image
              src="/assets/logo-comercio-integrado.png"
              alt="Logo da Empresa"
              // 1. Ajustado para a proporção correta (ex: 55x25)
              width={55}
              height={25}
              // 2. Removido o estilo de borda arredondada
              // style={{ borderRadius: "50%" }}
            />
          </Box>

          <Typography
            variant="button"
            sx={{ fontWeight: "bold", fontSize: "1rem" }}
          >
            Abrir Chat
          </Typography>
        </Fab>
      </Fade>
    </div>
  );
}
