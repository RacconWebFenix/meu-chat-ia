// src/app/(app)/components/Chart/ChartDisplay.tsx
import React from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Box, Alert } from "@mui/material";

export type ChartDataPoint = Record<string, string | number>;

export interface ChartDisplayProps {
  data: ChartDataPoint[];
  chartType: "bar" | "line" | "pie";
  loading?: boolean;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF6347"];

const ChartDisplay: React.FC<ChartDisplayProps> = ({ data, chartType, loading }) => {
  if (loading) {
    return <Alert severity="info">Carregando dados do gráfico...</Alert>;
  }
  if (!data || data.length === 0) {
    return <Alert severity="warning">Não há dados para exibir o gráfico.</Alert>;
  }

  // --- LÓGICA DINÂMICA PARA IDENTIFICAR CHAVES ---
  // Pega as chaves (cabeçalhos) do primeiro objeto de dados.
  const keys = Object.keys(data[0]);
  
  // Assume que a primeira chave que NÃO é um número é o nosso eixo X (ex: 'comprador', 'mês').
  const xAxisKey = keys.find(key => typeof data[0][key] === 'string');

  // Pega todas as outras chaves que são numéricas para serem as séries de dados (as linhas ou barras).
  const dataKeys = keys.filter(key => typeof data[0][key] === 'number');

  if (!xAxisKey || dataKeys.length === 0) {
    return <Alert severity="error">Formato de dados inválido para renderizar o gráfico.</Alert>;
  }

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* Gera uma Barra para cada série de dados encontrada */}
            {dataKeys.map((key, index) => (
              <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
            ))}
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* Gera uma Linha para cada série de dados encontrada */}
            {dataKeys.map((key, index) => (
              <Line key={key} type="monotone" dataKey={key} stroke={COLORS[index % COLORS.length]} />
            ))}
          </LineChart>
        );
      case "pie":
        // Gráfico de pizza só funciona com uma única série de dados.
        const pieDataKey = dataKeys[0]; 
        return (
          <PieChart>
            <Pie data={data} dataKey={pieDataKey} nameKey={xAxisKey} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
              {data.map((entry, index) => ( <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> ))}
            </Pie>
            <Tooltip /> <Legend />
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