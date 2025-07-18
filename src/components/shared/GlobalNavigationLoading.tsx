"use client";
import { Box, Backdrop } from "@mui/material";
import { ChatLoading } from "@/components/shared";
import { useNavigation } from "@/contexts";

export default function GlobalNavigationLoading() {
  const { isNavigating } = useNavigation();

  if (!isNavigating) return null;

  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
      }}
      open={isNavigating}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100%",
        }}
      >
        <ChatLoading />
      </Box>
    </Backdrop>
  );
}
