// src/app/(app)/dashboard/components/Chart/ChartArea.tsx
"use client";

import React from "react";
import ChartControls, { ChartConfig } from "./ChartControls";
import ChartDisplay from "./ChartDisplay";
import { Box } from "@mui/material";

// CORREÇÃO: A interface de props foi ajustada para receber o estado e a função de setar o estado
import { ChartData } from "./ChartDisplay";

interface ChartAreaProps {
  config: ChartConfig;
  setConfig: (value: React.SetStateAction<ChartConfig>) => void;
  onGenerateChart: () => void;
  chartData: ChartData[];
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
  // A lógica de estado foi movida para page.tsx.
  // A função para mudar a configuração é agora a própria 'setConfig' passada via props.

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
        data={chartData.filter(Boolean)}
        chartType={config.chartType}
        loading={loading}
      />
    </Box>
  );
};

export default ChartArea;
