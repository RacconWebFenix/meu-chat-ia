// src/features/chat/components/ReportData.tsx

import React from "react";

import ChartDisplay from "@/app/(app)/components/Chart/ChartDisplay"; // Verifique o caminho

import { useReportData } from "@/hooks/useReportData";
import { TableComponent } from "./TableComponent";
import { AiChartPayload, MessageMetadata } from "@/types/api.types";

interface ReportDataProps {
  payload: AiChartPayload<MessageMetadata> | null;
}

const ReportData: React.FC<ReportDataProps> = ({ payload }) => {
  const { isChart, chartType, chartData, tableData } = useReportData(payload);

  if (!payload) {
    return null;
  }

  // **Cenário 1: Renderizar um Gráfico**
  if (isChart && chartData && chartData.length > 0 && chartType !== "table") {
    return (
      <ChartDisplay
        data={chartData}
        chartType={chartType as "bar" | "line" | "pie"}
        loading={false}
      />
    );
  }

  // **Cenário 2: Renderizar uma Tabela**
  if (chartType === "table" && tableData.length > 0) {
    return <TableComponent data={tableData} />;
  }

  // Fallback, caso não haja dados para exibir
  return null;
};

export default ReportData;
