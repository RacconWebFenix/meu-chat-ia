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

interface ChartDisplayProps {
  data: unknown[];
  chartType: "bar" | "line" | "pie";
  loading: boolean;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const ChartDisplay: React.FC<ChartDisplayProps> = ({
  data,
  chartType,
  loading,
}) => {
  if (loading) {
    return <Typography>Carregando dados do gráfico...</Typography>;
  }

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
            <Bar dataKey="value" fill="#8884d8" name="Valor" />
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
            <Line
              type="monotone"
              dataKey="value"
              stroke="#82ca9d"
              name="Valor"
            />
          </LineChart>
        );
      case "pie":
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
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
