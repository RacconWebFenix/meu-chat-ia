// src/app/(app)/relatorios/components/PivotControls.tsx
"use client";

/**
 * 🔄 PASSO 1 IMPLEMENTADO: CONFIGURAÇÃO COMPLETA DOS CAMPOS
 *
 * ✅ SINCRONIZADO COM QUERY SQL: Todos os 36 campos da query principal estão mapeados
 * ✅ DIMENSÕES: 29 campos categóricos/textuais/datas disponíveis para linhas e colunas
 * ✅ MÉTRICAS: 7 campos numéricos disponíveis para agregação
 * ✅ TIPOS CORRETOS: Campos de data marcados como "date", numéricos como métricas
 *
 * Query SQL de referência possui 36 campos:
 * - ID_DO_ITEM, GRUPO_DE_ESCRITORIO, GRUPO_MASTER, COMPRADOR, EMPRESA, FORNECEDOR,
 * - ID_COTACAO, NO_ERP, FAMILIA, FINALIZADA, COD_ITEM, DESCRICAO_RESUMIDA,
 * - DESCRICAO_COMPLETA, SOLICITANTE, MARCA, MARCA_SUGERIDA, QUANTIDADE,
 * - VALOR_UNIT_ULT_COMPRA, PRECO_NEGOCIADO, NO_CONTRATO, VALOR_TOTAL_NEGOCIADO,
 * - SAVING_ULT_COMPRA, SAVING_MELHOR_PRECO, ORDEM_COMPRA, PROJETO_RFA,
 * - CLASSIFICACAO, DATA_REQUISICAO, DATA_NECESSIDADE, SUBFAMILIA, NO_SOLICITACAO,
 * - CRITERIO, NCM, ESTIMATIVA_VALOR, UNID_MEDIDA, MOEDA, DEPARTAMENTO,
 * - APLICACAO, STATUS_PROCESSO, STATUS_ITEM, REQUISICAO_ERP
 */

import React from "react";
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
  Chip,
  Autocomplete,
  TextField,
} from "@mui/material";
import {
  PivotConfiguration,
  DimensionOption,
  MetricOption,
  AggregationType,
} from "@/features/reports/types/pivot.types";

// Opções de dimensões baseadas na sua query SQL - TODOS OS 36 CAMPOS
// Campos categóricos/textuais/datas (29 campos) - os 7 campos numéricos estão em METRIC_OPTIONS abaixo
const DIMENSION_OPTIONS: DimensionOption[] = [
  // Campos identificadores (9 campos)
  { value: "ID_DO_ITEM", label: "ID do Item", dataType: "string" },
  { value: "ID_COTACAO", label: "ID Cotação", dataType: "string" },
  { value: "NO_ERP", label: "Nº ERP", dataType: "string" },
  { value: "COD_ITEM", label: "Código Item", dataType: "string" },
  { value: "NO_CONTRATO", label: "Nº Contrato", dataType: "string" },
  { value: "NO_SOLICITACAO", label: "Nº Solicitação", dataType: "string" },
  { value: "ORDEM_COMPRA", label: "Ordem Compra", dataType: "string" },
  { value: "PROJETO_RFA", label: "Projeto RFA", dataType: "string" },
  { value: "REQUISICAO_ERP", label: "Requisição ERP", dataType: "string" },

  // Campos organizacionais (4 campos)
  {
    value: "GRUPO_DE_ESCRITORIO",
    label: "Grupo de Escritório",
    dataType: "string",
  },
  { value: "GRUPO_MASTER", label: "Grupo Master", dataType: "string" },
  { value: "EMPRESA", label: "Empresa", dataType: "string" },
  { value: "DEPARTAMENTO", label: "Departamento", dataType: "string" },

  // Pessoas (3 campos)
  { value: "COMPRADOR", label: "Comprador", dataType: "string" },
  { value: "SOLICITANTE", label: "Solicitante", dataType: "string" },
  { value: "FORNECEDOR", label: "Fornecedor", dataType: "string" },

  // Descrições do item (9 campos)
  {
    value: "DESCRICAO_RESUMIDA",
    label: "Descrição Resumida",
    dataType: "string",
  },
  {
    value: "DESCRICAO_COMPLETA",
    label: "Descrição Completa",
    dataType: "string",
  },
  { value: "FAMILIA", label: "Família", dataType: "string" },
  { value: "SUBFAMILIA", label: "Subfamília", dataType: "string" },
  { value: "CLASSIFICACAO", label: "Classificação", dataType: "string" },
  { value: "NCM", label: "NCM", dataType: "string" },
  { value: "UNID_MEDIDA", label: "Unidade Medida", dataType: "string" },
  { value: "APLICACAO", label: "Aplicação", dataType: "string" },
  { value: "CRITERIO", label: "Critério", dataType: "string" },

  // Marcas (2 campos)
  { value: "MARCA", label: "Marca", dataType: "string" },
  { value: "MARCA_SUGERIDA", label: "Marca Sugerida", dataType: "string" },

  // Status (2 campos)
  { value: "STATUS_PROCESSO", label: "Status Processo", dataType: "string" },
  { value: "STATUS_ITEM", label: "Status Item", dataType: "string" },

  // Outros (1 campo)
  { value: "MOEDA", label: "Moeda", dataType: "string" },

  // Campos de data (3 campos)
  { value: "FINALIZADA", label: "Data Finalizada", dataType: "date" },
  { value: "DATA_REQUISICAO", label: "Data Requisição", dataType: "date" },
  { value: "DATA_NECESSIDADE", label: "Data Necessidade", dataType: "date" },
];

// Opções de métricas (campos numéricos) - OS 7 CAMPOS NUMÉRICOS DA QUERY SQL
const METRIC_OPTIONS: MetricOption[] = [
  {
    value: "QUANTIDADE",
    label: "Quantidade",
    aggregations: ["sum", "avg", "count", "max", "min"],
  },
  {
    value: "VALOR_UNIT_ULT_COMPRA",
    label: "Valor Unit. Última Compra",
    aggregations: ["sum", "avg", "count", "max", "min"],
  },
  {
    value: "PRECO_NEGOCIADO",
    label: "Preço Negociado",
    aggregations: ["sum", "avg", "count", "max", "min"],
  },
  {
    value: "VALOR_TOTAL_NEGOCIADO",
    label: "Valor Total Negociado",
    aggregations: ["sum", "avg", "count", "max", "min"],
  },
  {
    value: "SAVING_ULT_COMPRA",
    label: "Saving (Última Compra)",
    aggregations: ["sum", "avg", "count", "max", "min"],
  },
  {
    value: "SAVING_MELHOR_PRECO",
    label: "Saving (Melhor Preço)",
    aggregations: ["sum", "avg", "count", "max", "min"],
  },
  {
    value: "ESTIMATIVA_VALOR",
    label: "Estimativa Valor",
    aggregations: ["sum", "avg", "count", "max", "min"],
  },
];

// Opções de agregação
const AGGREGATION_OPTIONS: { value: AggregationType; label: string }[] = [
  { value: "sum", label: "Soma" },
  { value: "avg", label: "Média" },
  { value: "count", label: "Contagem" },
  { value: "max", label: "Máximo" },
  { value: "min", label: "Mínimo" },
];

interface PivotControlsProps {
  config: PivotConfiguration;
  onConfigChange: (config: PivotConfiguration) => void;
  onApplyPivot: () => void;
  loading: boolean;
}

export default function PivotControls({
  config,
  onConfigChange,
  onApplyPivot,
  loading,
}: PivotControlsProps) {
  const handleRowsChange = (newRows: string[]) => {
    onConfigChange({
      ...config,
      rows: newRows,
    });
  };

  const handleColumnsChange = (newColumns: string[]) => {
    onConfigChange({
      ...config,
      columns: newColumns,
    });
  };

  const handleValuesChange = (newValues: string[]) => {
    onConfigChange({
      ...config,
      values: newValues,
    });
  };

  const handleAggregationChange = (event: SelectChangeEvent) => {
    onConfigChange({
      ...config,
      aggregation: event.target.value as AggregationType,
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        backgroundColor: "grey.50",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "grey.200",
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main" }}
      >
        🔄 Configuração da Tabela Dinâmica
      </Typography>

      <Box
        sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 3 }}
      >
        {/* Linhas */}
        <FormControl fullWidth>
          <Autocomplete
            multiple
            options={DIMENSION_OPTIONS.map((opt) => opt.value)}
            getOptionLabel={(option) =>
              DIMENSION_OPTIONS.find((opt) => opt.value === option)?.label ||
              option
            }
            value={config.rows}
            onChange={(_, newValue) => handleRowsChange(newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={
                    DIMENSION_OPTIONS.find((opt) => opt.value === option)
                      ?.label || option
                  }
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Linhas"
                placeholder="Selecione campos para as linhas"
                variant="outlined"
              />
            )}
          />
        </FormControl>

        {/* Colunas */}
        <FormControl fullWidth>
          <Autocomplete
            multiple
            options={DIMENSION_OPTIONS.map((opt) => opt.value)}
            getOptionLabel={(option) =>
              DIMENSION_OPTIONS.find((opt) => opt.value === option)?.label ||
              option
            }
            value={config.columns}
            onChange={(_, newValue) => handleColumnsChange(newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={
                    DIMENSION_OPTIONS.find((opt) => opt.value === option)
                      ?.label || option
                  }
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Colunas"
                placeholder="Selecione campos para as colunas"
                variant="outlined"
              />
            )}
          />
        </FormControl>
      </Box>

      <Box
        sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 3 }}
      >
        {/* Valores */}
        <FormControl fullWidth>
          <Autocomplete
            multiple
            options={METRIC_OPTIONS.map((opt) => opt.value)}
            getOptionLabel={(option) =>
              METRIC_OPTIONS.find((opt) => opt.value === option)?.label ||
              option
            }
            value={config.values}
            onChange={(_, newValue) => handleValuesChange(newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  color="primary"
                  label={
                    METRIC_OPTIONS.find((opt) => opt.value === option)?.label ||
                    option
                  }
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Valores"
                placeholder="Selecione campos para agregação"
                variant="outlined"
              />
            )}
          />
        </FormControl>

        {/* Agregação */}
        <FormControl fullWidth>
          <InputLabel>Tipo de Agregação</InputLabel>
          <Select
            value={config.aggregation}
            label="Tipo de Agregação"
            onChange={handleAggregationChange}
          >
            {AGGREGATION_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="contained"
          onClick={onApplyPivot}
          disabled={loading || config.values.length === 0}
          sx={{ minWidth: 140 }}
        >
          {loading ? "Processando..." : "Gerar Tabela Dinâmica"}
        </Button>
      </Box>

      {/* Instruções */}
      <Box sx={{ mt: 2, p: 2, backgroundColor: "info.light", borderRadius: 1 }}>
        <Typography variant="body2" color="info.contrastText">
          💡 <strong>Como usar:</strong> Selecione campos para{" "}
          <strong>Linhas</strong> e <strong>Colunas</strong>
          (dimensões), escolha campos numéricos para <strong>
            Valores
          </strong>{" "}
          (métricas) e defina o tipo de
          <strong> Agregação</strong>. Em seguida, clique em &quot;Gerar Tabela
          Dinâmica&quot;.
        </Typography>
      </Box>
    </Paper>
  );
}
