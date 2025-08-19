"use client";

import { Box } from "@mui/material";

import { ChartMocks } from "@/components/Home/ChartMocks";

export default function HomePage() {
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <ChartMocks />
    </Box>
  );
}
