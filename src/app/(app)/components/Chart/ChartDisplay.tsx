// src/app/(app)/dashboard/components/Chart/ChartDisplay.tsx
"use client";

import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Typography, Paper } from "@mui/material";

// Interface para os dados formatados que o gráfico irá renderizar.
interface ChartData {
  group: string;
  [key: string]: string | number;
}

interface ChartDisplayProps {
  data: ChartData[];
  chartType: "bar" | "line" | "pie";
  loading: boolean;
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#FFBB28",
  "#00C49F",
  "#FF8042",
  "#0088FE",
];

const ChartDisplay: React.FC<ChartDisplayProps> = ({
  data,
  chartType,
  loading,
}) => {
  if (loading || data.length === 0) {
    return (
      <Typography>
        {loading ? "Carregando dados do gráfico..." : "Sem dados para exibir."}
      </Typography>
    );
  }

  // Chave para a correção: Esta lógica agora é usada por AMBOS, linha e barra.
  const dataKeys = Object.keys(data[0]).filter((key) => key !== "group");

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="group" angle={-30} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* --- CORREÇÃO APLICADA AQUI --- */}
            {/* Agora o gráfico de barras também pode renderizar múltiplas séries */}
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={COLORS[index % COLORS.length]}
                name={key}
              />
            ))}
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
            {/* Esta parte já estava correta e continua igual */}
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLORS[index % COLORS.length]}
                name={key}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        );
      case "pie":
        // Gráficos de Pizza geralmente usam a chave "value"
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value" // Mantido como "value" pois Pie Charts são de série única
              nameKey="group"
              label={({ name, percent }) =>
                `${name} ${(percent! * 100).toFixed(0)}%`
              }
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
        return <Typography>Tipo de gráfico inválido.</Typography>;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <ResponsiveContainer width="100%" height={400}>
        {renderChart()}
      </ResponsiveContainer>
    </Paper>
  );
};

export default ChartDisplay;
