// src/app/(app)/components/Chart/ChartArea.tsx
"use client";

import React from "react";
import ChartControls, { ChartConfig } from "./ChartControls";
import ChartDisplay, { ChartDataPoint } from "./ChartDisplay"; // Importa ChartDataPoint
import { Box } from "@mui/material";

// A interface foi removida daqui para usar a do ChartDisplay diretamente

interface ChartAreaProps {
  config: ChartConfig;
  setConfig: (value: React.SetStateAction<ChartConfig>) => void;
  onGenerateChart: () => void;
  chartData: ChartDataPoint[];
  loading: boolean;
  disabled: boolean;
  selectedTable: string;
}

const ChartArea: React.FC<ChartAreaProps> = ({
  config,
  setConfig,
  onGenerateChart,
  chartData,
  loading,
  disabled,
  selectedTable,
}) => {
  return (
    <Box>
      <ChartControls
        config={config}
        onConfigChange={setConfig}
        onGenerateChart={onGenerateChart}
        disabled={disabled || loading}
        selectedTable={selectedTable}
      />
      <ChartDisplay
        data={chartData}
        chartType={config.chartType}
        loading={loading}
      />
    </Box>
  );
};

export default ChartArea;
