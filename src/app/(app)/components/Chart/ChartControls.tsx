// src/app/(app)/dashboard/components/Chart/ChartControls.tsx
'use client';

import React from 'react';
import Box from '@mui/material/Box'; 
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Paper, Typography, SelectChangeEvent } from '@mui/material';
import { BarChart, Timeline, PieChart as PieChartIcon, Equalizer } from '@mui/icons-material';

export interface ChartConfig {
  chartType: 'bar' | 'line' | 'pie';
  dimension: string;
  metric: string;
  dateField: string;
  limit: number;
  dateRange: {
    start?: string;
    end?: string;
  };
}

interface ChartControlsProps {
  config: ChartConfig;
  onConfigChange: React.Dispatch<React.SetStateAction<ChartConfig>>;
  onGenerateChart: () => void;
  disabled: boolean;
  selectedTable: string;
}

const getDimensionOptions = (tableName: string) => {
  if (tableName === 'REQUEST_PROCESS') {
    return [
      { value: 'status', label: 'Status do Processo' },
      { value: 'responsible', label: 'Responsável' },
      { value: 'request_date_monthly', label: 'Mês da Requisição' },
    ];
  }
  return [
    { value: 'status', label: 'Status do Processo' },
    { value: 'responsible', label: 'Responsável' },
    { value: 'creation_date_monthly', label: 'Mês de Criação' },
  ];
};

const getDateFieldOptions = (tableName: string) => {
    if (tableName === 'REQUEST_PROCESS') {
        return [{ value: 'request_date', label: 'Data da Requisição' }];
    }
    return [{ value: 'creation_date', label: 'Data de Criação' }];
};

const METRIC_OPTIONS = [{ value: 'count', label: 'Contagem de Registros' }];

const LIMIT_OPTIONS = [
    { value: 10, label: 'Top 10' },
    { value: 20, label: 'Top 20' },
    { value: 50, label: 'Top 50' },
    { value: 0, label: 'Exibir Todos' },
];


const ChartControls: React.FC<ChartControlsProps> = ({ config, onConfigChange, onGenerateChart, disabled, selectedTable }) => {

  const dimensionOptions = getDimensionOptions(selectedTable);
  const dateFieldOptions = getDateFieldOptions(selectedTable);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // CORREÇÃO: Usando a forma de função para garantir uma atualização segura do estado.
    onConfigChange(prev => ({
        ...prev,
        dateRange: {
            ...prev.dateRange,
            [name === 'startDate' ? 'start' : 'end']: value
        }
    }));
  };
  
  const handleSelectChange = (event: SelectChangeEvent<string | number>) => {
      const { name, value } = event.target;
      // CORREÇÃO: Usando a forma de função para garantir uma atualização segura do estado.
      onConfigChange(prev => ({...prev, [name]: value}));
  };

  React.useEffect(() => {
    // CORREÇÃO: Usando a forma de função para garantir uma atualização segura do estado.
    onConfigChange(prev => ({
        ...prev,
        dimension: getDimensionOptions(selectedTable)[0].value,
        dateField: getDateFieldOptions(selectedTable)[0].value,
    }));
  // Adicionando onConfigChange às dependências para seguir as regras de hooks.
  }, [selectedTable, onConfigChange]);


  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{display: "flex", alignItems: "center"}}><Equalizer sx={{mr: 1}}/>Análise Gráfica</Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
        
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Gráfico</InputLabel>
            <Select name="chartType" value={config.chartType} label="Tipo de Gráfico" onChange={handleSelectChange}>
              <MenuItem value="bar"><BarChart sx={{mr: 1, verticalAlign: "middle"}}/> Gráfico de Barras</MenuItem>
              <MenuItem value="line"><Timeline sx={{mr: 1, verticalAlign: "middle"}}/> Gráfico de Linha</MenuItem>
              <MenuItem value="pie"><PieChartIcon sx={{mr: 1, verticalAlign: "middle"}}/> Gráfico de Pizza</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <FormControl fullWidth>
            <InputLabel>Agrupar por (Eixo X)</InputLabel>
            <Select name="dimension" value={config.dimension} label="Agrupar por (Eixo X)" onChange={handleSelectChange}>
              {dimensionOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <FormControl fullWidth>
            <InputLabel>Calcular (Eixo Y)</InputLabel>
            <Select name="metric" value={config.metric} label="Calcular (Eixo Y)" onChange={handleSelectChange}>
              {METRIC_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <FormControl fullWidth>
            <InputLabel>Limite de Itens</InputLabel>
            <Select name="limit" value={config.limit} label="Limite de Itens" onChange={handleSelectChange}>
              {LIMIT_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <FormControl fullWidth>
            <InputLabel>Campo de Data do Filtro</InputLabel>
            <Select name="dateField" value={config.dateField} label="Campo de Data do Filtro" onChange={handleSelectChange}>
               {dateFieldOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <TextField
            name="startDate"
            label="Data de Início"
            type="date"
            fullWidth
            value={config.dateRange.start || ''}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <TextField
            name="endDate"
            label="Data de Fim"
            type="date"
            fullWidth
            value={config.dateRange.end || ''}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

      </Box>
      <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={onGenerateChart} disabled={disabled}>
            Gerar Gráfico
          </Button>
      </Box>
    </Paper>
  );
};

export default ChartControls;