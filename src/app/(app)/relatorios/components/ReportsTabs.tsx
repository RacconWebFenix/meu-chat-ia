// src/app/(app)/relatorios/components/ReportsTabs.tsx
"use client";

import React from "react";
import { Box, Tab, Tabs } from "@mui/material";

interface ReportsTabsProps {
  activeTab: string;
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
}

const TABS = [
  { value: "requisicoes", label: "Requisições" },
  { value: "cotacoes", label: "Cotações" },
  { value: "pedidos", label: "Pedidos" },
  { value: "recebimentos", label: "Recebimentos" },
  { value: "contratos", label: "Contratos" },
  { value: "empresas", label: "Empresas" },
];

export default function ReportsTabs({
  activeTab,
  onTabChange,
}: ReportsTabsProps) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
      <Tabs
        value={activeTab}
        onChange={onTabChange}
        aria-label="abas de relatórios"
        textColor="primary"
        indicatorColor="primary"
        sx={{
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
            color: "text.secondary",
            "&.Mui-selected": {
              color: "primary.main",
            },
          },
        }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
    </Box>
  );
}
