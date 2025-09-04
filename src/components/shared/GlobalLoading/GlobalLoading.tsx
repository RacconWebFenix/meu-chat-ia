"use client";

import React from "react";
import { Box, Backdrop } from "@mui/material";
import Image from "next/image";

interface GlobalLoadingProps {
  open: boolean;
}

export default function GlobalLoading({ open }: GlobalLoadingProps) {
  return (
    <Backdrop
      sx={{
        color: "#1976d2",
        zIndex: (theme) => theme.zIndex.drawer + 1000,
        backgroundColor: "rgba(255, 255, 255, 0.0)",
        backdropFilter: "blur(4px)",
      }}
      open={open}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "spinY 3s linear infinite",
            "@keyframes spinY": {
              "0%": {
                transform: "rotateY(0deg)",
              },
              "100%": {
                transform: "rotateY(360deg)",
              },
            },
          }}
        >
          <Image
            src="/assets/logo-comercio-integrado.png"
            alt="Logo"
            width={110}
            height={50}
            priority
          />
        </Box>

        <Box
          sx={{
            color: "primary.main",
            fontWeight: 500,
            fontSize: "1.1rem",
          }}
        >
          Carregando...
        </Box>
      </Box>
    </Backdrop>
  );
}
