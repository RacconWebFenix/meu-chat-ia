// src/components/ChatbootQuery/BotResponseRenderer.tsx
import React from "react";
import { TableComponent } from "./TableComponent";
import ChartDisplay from "@/app/(app)/components/Chart/ChartDisplay";
// Importamos os tipos necessários
import {
  AiChartPayload,
  SqlResultRow,
  MessageMetadata,
} from "@/types/api.types";

interface BotResponseRendererProps {
  // Usamos o tipo MessageMetadata para alinhar com nossa definição em api.types.ts
  payload: AiChartPayload<MessageMetadata>;
}

export const BotResponseRenderer: React.FC<BotResponseRendererProps> = ({
  payload,
}) => {
  // A tipagem do payload agora está correta
  const { chartType, chartData, rawData } = payload;

  if (chartType !== "table" && chartData && chartData.length > 0) {
    // Passamos os dados diretamente para o ChartDisplay
    return <ChartDisplay data={chartData} chartType={chartType} />;
  }

  // Se for uma tabela, renderizamos o TableComponent com os rawData
  if (chartType === "table" && rawData && rawData.length > 0) {
    // Usamos uma asserção de tipo para compatibilidade
    return <TableComponent data={rawData as SqlResultRow[]} />;
  }

  // Não renderiza nada se não houver dados ou tipo compatível
  return null;
};
