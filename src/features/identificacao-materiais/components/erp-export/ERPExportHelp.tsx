/**
 * Eexport const ERPExportHelp: React.FC = () => (
  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
    <Typography variant="h6">
      📤 Exportação para ERP
    </Typography>
    <Typography variant="body2" color="text.secondary">
      | Digite atributos no formato: <code>nome: valor; nome2: valor2</code> Use Ctrl+V para colar - ";" será adicionado automaticamente
    </Typography>
  </Box>
);lp Component
 * Following Single Responsibility Principle
 */

import React from "react";
import { Box, Typography } from "@mui/material";

export const ERPExportHelp: React.FC = () => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="h6" gutterBottom>
      📤 Exportação para ERP
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Digite atributos no formato: <code>nome: valor; nome2: valor2</code>
      <br />
      Use Ctrl+V para colar - &quot;;&quot; será adicionado automaticamente
    </Typography>
  </Box>
);
