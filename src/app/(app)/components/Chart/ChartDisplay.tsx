// src/app/(app)/components/Chart/ChartDisplay.tsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Box, Alert } from "@mui/material";

// CORREÇÃO: A interface de dados agora corresponde EXATAMENTE ao nosso AiChartPayload.
export interface ChartDataPoint {
  group: string;
  value: number;
}

export interface ChartDisplayProps {
  data: ChartDataPoint[];
  chartType: "bar" | "line" | "pie";
  loading?: boolean;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const ChartDisplay: React.FC<ChartDisplayProps> = ({
  data,
  chartType,
  loading,
}) => {
  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: 300,
          mt: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Alert severity="info">Carregando dados do gráfico...</Alert>
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Alert severity="warning">Não há dados para exibir o gráfico.</Alert>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="group" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="group" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        );
      case "pie":
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="group"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      default:
        return <Alert severity="error">Tipo de gráfico desconhecido.</Alert>;
    }
  };

  return (
    <Box sx={{ width: "100%", height: 300, mt: 2 }}>
      <ResponsiveContainer>{renderChart()}</ResponsiveContainer>
    </Box>
  );
};

export default ChartDisplay;
