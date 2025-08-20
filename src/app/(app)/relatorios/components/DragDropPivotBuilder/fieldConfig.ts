/**
 * FIELD CONFIGURATION - DATA LAYER
 *
 * Seguindo Clean Code:
 * - Separação de responsabilidades (dados vs lógica)
 * - Configuração imutável com readonly
 * - Tipagem estrita sem uso de 'any'
 * - Nomes descritivos e auto-documentados
 */

import { DimensionOption, MetricOption } from "./types";

// ====================================
// DIMENSION FIELDS - 29 campos categóricos/textuais/datas
// ====================================

export const DIMENSION_OPTIONS: ReadonlyArray<DimensionOption> = [
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

  // Campos organizacionais (6 campos)
  {
    value: "GRUPO_DE_ESCRITORIO",
    label: "Grupo de Escritório",
    dataType: "string",
  },
  { value: "GRUPO_MASTER", label: "Grupo Master", dataType: "string" },
  { value: "EMPRESA", label: "Empresa", dataType: "string" },
  { value: "DEPARTAMENTO", label: "Departamento", dataType: "string" },
  { value: "FAMILIA", label: "Família", dataType: "string" },
  { value: "SUBFAMILIA", label: "Sub-família", dataType: "string" },

  // Campos de pessoas (3 campos)
  { value: "COMPRADOR", label: "Comprador", dataType: "string" },
  { value: "SOLICITANTE", label: "Solicitante", dataType: "string" },
  { value: "FORNECEDOR", label: "Fornecedor", dataType: "string" },

  // Campos de produto (8 campos)
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
  { value: "MARCA", label: "Marca", dataType: "string" },
  { value: "MARCA_SUGERIDA", label: "Marca Sugerida", dataType: "string" },
  { value: "UNID_MEDIDA", label: "Unidade de Medida", dataType: "string" },
  { value: "NCM", label: "NCM", dataType: "string" },
  { value: "CLASSIFICACAO", label: "Classificação", dataType: "string" },
  { value: "APLICACAO", label: "Aplicação", dataType: "string" },

  // Campos de status (3 campos)
  { value: "STATUS_PROCESSO", label: "Status do Processo", dataType: "string" },
  { value: "STATUS_ITEM", label: "Status do Item", dataType: "string" },
  { value: "CRITERIO", label: "Critério", dataType: "string" },
  { value: "MOEDA", label: "Moeda", dataType: "string" },

  // Campos de data (3 campos) - TRATAMENTO ESPECIAL
  { value: "FINALIZADA", label: "Data Finalizada", dataType: "date" },
  { value: "DATA_REQUISICAO", label: "Data Requisição", dataType: "date" },
  { value: "DATA_NECESSIDADE", label: "Data Necessidade", dataType: "date" },
] as const;

// ====================================
// METRIC FIELDS - 7 campos numéricos
// ====================================

export const METRIC_OPTIONS: ReadonlyArray<MetricOption> = [
  // Campos de quantidade e valores
  { value: "QUANTIDADE", label: "Quantidade", dataType: "number" },
  {
    value: "VALOR_UNIT_ULT_COMPRA",
    label: "Valor Unit. Últ. Compra",
    dataType: "number",
  },
  { value: "PRECO_NEGOCIADO", label: "Preço Negociado", dataType: "number" },
  {
    value: "VALOR_TOTAL_NEGOCIADO",
    label: "Valor Total Negociado",
    dataType: "number",
  },
  {
    value: "ESTIMATIVA_VALOR",
    label: "Estimativa de Valor",
    dataType: "number",
  },

  // Campos de economia (savings)
  {
    value: "SAVING_ULT_COMPRA",
    label: "Saving Últ. Compra",
    dataType: "number",
  },
  {
    value: "SAVING_MELHOR_PRECO",
    label: "Saving Melhor Preço",
    dataType: "number",
  },
] as const;

// ====================================
// COMBINED FIELDS - Todos os campos disponíveis
// ====================================

export const ALL_AVAILABLE_FIELDS: ReadonlyArray<
  DimensionOption | MetricOption
> = [...DIMENSION_OPTIONS, ...METRIC_OPTIONS] as const;

// ====================================
// FIELD TYPE GUARDS - Validação de tipos
// ====================================

export const isDimensionField = (
  field: DimensionOption | MetricOption
): field is DimensionOption => {
  return field.dataType === "string" || field.dataType === "date";
};

export const isMetricField = (
  field: DimensionOption | MetricOption
): field is MetricOption => {
  return field.dataType === "number";
};

export const isDateField = (field: DimensionOption | MetricOption): boolean => {
  return field.dataType === "date";
};

// ====================================
// FIELD LOOKUP UTILITIES - Busca otimizada
// ====================================

export const findFieldByValue = (
  value: string
): DimensionOption | MetricOption | undefined => {
  return ALL_AVAILABLE_FIELDS.find((field) => field.value === value);
};

export const getFieldsByType = (
  dataType: "string" | "number" | "date"
): ReadonlyArray<DimensionOption | MetricOption> => {
  return ALL_AVAILABLE_FIELDS.filter((field) => field.dataType === dataType);
};
