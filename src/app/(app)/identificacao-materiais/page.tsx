"use client";

import { Container, Box } from "@mui/material";
import MaterialSearchHeader from "@/components/MaterialSearchHeader";

export default function IdentificacaoMateriaisPage() {
  return (
    <Container maxWidth="xl" disableGutters>
      <Box sx={{ width: "100%", p: 2 }}>
        <MaterialSearchHeader />
      </Box>
    </Container>
  );
}
