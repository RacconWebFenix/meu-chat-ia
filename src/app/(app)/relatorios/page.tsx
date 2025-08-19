// src/app/(app)/relatorios/page.tsx
"use client";

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import ReportsTabs from "./components/ReportsTabs";
import PivotTab from "./components/PivotTab";
import { useSetPageTitle } from "@/hooks/usePageTitle";
import { FadeSwitch } from "@/components/shared";

// Componente Placeholder para abas futuras
const PlaceholderTab = ({ title }: { title: string }) => (
  <Box>
    <Typography variant="h5" component="h2" color="text.primary">
      {title}
    </Typography>
    <Typography color="text.secondary">Conteúdo em desenvolvimento.</Typography>
  </Box>
);

export default function ReportsPage() {
  useSetPageTitle("Painel de Relatórios");
  const [activeTab, setActiveTab] = useState("cotacoes");

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", color: "text.primary" }}
      >
        Relatórios
      </Typography>

      <ReportsTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <FadeSwitch activeKey={activeTab}>
        <div key="cotacoes">
          <PivotTab />
        </div>
        <div key="requisicoes">
          <PlaceholderTab title="Relatório de Requisições" />
        </div>
        <div key="pedidos">
          <PlaceholderTab title="Relatório de Pedidos" />
        </div>
        <div key="recebimentos">
          <PlaceholderTab title="Relatório de Recebimentos" />
        </div>
        <div key="contratos">
          <PlaceholderTab title="Relatório de Contratos" />
        </div>
        <div key="empresas">
          <PlaceholderTab title="Relatório de Empresas" />
        </div>
      </FadeSwitch>
    </Box>
  );
}
