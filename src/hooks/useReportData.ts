// src/features/chat/hooks/useReportData.ts

import {
  AiChartPayload,
  ChartData,
  SqlResultRow,
  MessageMetadata,
} from "@/types/api.types";
import { useEffect, useState } from "react";

export const useReportData = (
  payload: AiChartPayload<MessageMetadata> | null
) => {
  const [chartType, setChartType] = useState<"bar" | "line" | "pie" | "table">(
    "table"
  );
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [tableData, setTableData] = useState<SqlResultRow<MessageMetadata>[]>(
    []
  );
  const [summary, setSummary] = useState<string>("");
  const [isChart, setIsChart] = useState<boolean>(false);

  useEffect(() => {
    if (!payload) return;

    const canGenerateChart =
      payload.chartType !== "table" && payload.chartData !== null;
    setIsChart(canGenerateChart);

    setChartType(payload.chartType);
    setSummary(payload.summary);

    // A correção crucial: sempre popula os dados da tabela com os dados brutos
    setTableData(payload.rawData || []);

    if (canGenerateChart) {
      setChartData(payload.chartData);
    } else {
      setChartData(null);
    }
  }, [payload]);

  return {
    isChart,
    chartType,
    chartData,
    tableData, // Agora esta variável é usada pelo componente de tabela
    summary,
  };
};
