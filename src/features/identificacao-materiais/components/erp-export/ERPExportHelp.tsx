/**
 * ERP Export Help Component
 * Following Single Responsibility Principle
 */

import React from "react";
import { Box, Typography } from "@mui/material";

export const ERPExportHelp: React.FC = () => (
  <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "flex-start" }}>
    <Box sx={{ flex: 1 }}>
      <Typography variant="h6">📤 Exportação para ERP</Typography>
    </Box>
    <Box sx={{ flex: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Digite atributos no formato: <code>nome: valor; nome2: valor2</code>
        <br />
        Use Ctrl+V para colar - &quot;;&quot; será adicionado automaticamente
      </Typography>
    </Box>
  </Box>
);
