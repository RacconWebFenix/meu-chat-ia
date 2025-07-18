import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Box, Typography } from "@mui/material";

const dataLine = [
  { name: "Jan", uv: 400, pv: 240, amt: 240 },
  { name: "Feb", uv: 300, pv: 139, amt: 221 },
  { name: "Mar", uv: 200, pv: 980, amt: 229 },
  { name: "Apr", uv: 278, pv: 390, amt: 200 },
  { name: "May", uv: 189, pv: 480, amt: 218 },
];
const dataBar = [
  { name: "A", value: 12 },
  { name: "B", value: 18 },
  { name: "C", value: 32 },
  { name: "D", value: 9 },
];
const dataPie = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function ChartMocks() {
  return (
    <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      <Box sx={{ width: 300, height: 250 }}>
        <Typography color="primary" variant="h6">
          Gráfico de Linha
        </Typography>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={dataLine}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="uv" stroke="#8884d8" name="UV" />
            <Line type="monotone" dataKey="pv" stroke="#82ca9d" name="PV" />
            <Line type="monotone" dataKey="amt" stroke="#ffc658" name="AMT" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ width: 300, height: 250 }}>
        <Typography color="primary" variant="h6">
          Gráfico de Barras
        </Typography>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={dataBar}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ width: 300, height: 250 }}>
        <Typography color="primary" variant="h6">
          Gráfico de Pizza
        </Typography>
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={dataPie}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={60}
              fill="#8884d8"
              label
            >
              {dataPie.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
