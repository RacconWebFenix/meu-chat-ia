// Código Corrigido para o nó: Code (Main Query) - VERSÃO FINAL CORRIGIDA
// ✅ RESOLVE A DISCREPÂNCIA DE 629 vs 519 COTAÇÕES

// --- CAPTURA DOS PARÂMETROS ---
var startDate = $("Prepare").first().json.startDate;
var endDate = $("Prepare").first().json.endDate;
var groupId = $("Prepare").first().json.groupId;
var searchTerm = $("Prepare").first().json.searchTerm;

var pivotConfigString = $("Prepare").first().json.pivotConfig;
if (!pivotConfigString) {
  throw new Error("pivotConfig não foi encontrado. Verifique o nó 'Prepare'.");
}
var pivotConfig = JSON.parse(pivotConfigString);

if (
  !pivotConfig ||
  !pivotConfig.rows ||
  !pivotConfig.values ||
  pivotConfig.values.length === 0
) {
  throw new Error(
    "Configuração da tabela dinâmica (pivotConfig) é inválida ou não possui valores para agregar."
  );
}

// ✅ DICIONÁRIO DE CAMPOS CORRIGIDO - COM QUANTIDADE_TOTAL PARA MOSTRAR 629
var fieldMapping = {
  GRUPO_DE_ESCRITORIO: { expression: 'og."DESCRIPTION"', isMetric: false },
  GRUPO_MASTER: { expression: 'mg."DESCRIPTION"', isMetric: false },
  COMPRADOR: {
    expression: "cp.first_name || ' ' || cp.last_name",
    isMetric: false,
  },
  EMPRESA: { expression: 'cust_co."NAME"', isMetric: false },
  FORNECEDOR: { expression: 'prov_co."NAME"', isMetric: false },
  FAMILIA: { expression: 'ri."ITEM_FAMILY"', isMetric: false },
  SOLICITANTE: { expression: 'qi."REQUESTER"', isMetric: false },
  MARCA: { expression: 'qib."BRAND"', isMetric: false },
  MARCA_SUGERIDA: { expression: 'qpi."SUGGESTED_BRAND"', isMetric: false },
  CLASSIFICACAO: { expression: 'ri."ITEM_CLASSIFICATION"', isMetric: false },
  SUBFAMILIA: { expression: 'ri."ITEM_SUBFAMILY"', isMetric: false },
  CRITERIO: { expression: 'ri."CRITERION"', isMetric: false },
  NCM: {
    expression:
      "COALESCE(NULLIF(qib.\"CUSTOMER_NCM\", ''), NULLIF(m.\"CUSTOMER_NCM\", ''))",
    isMetric: false,
  },
  UNID_MEDIDA: { expression: 'qi."MEASUREMENT_UNIT"', isMetric: false },
  MOEDA: {
    expression: 'COALESCE(po."CURRENCY", rp."CURRENCY")',
    isMetric: false,
  },
  DEPARTAMENTO: { expression: 'd."DESCRIPTION"', isMetric: false },
  APLICACAO: { expression: 'ri."APPLICATION"', isMetric: false },
  STATUS_PROCESSO: { expression: 'qp."CUSTOMER_STATUS"', isMetric: false },
  STATUS_ITEM: { expression: 'qi."ITEM_STATUS"', isMetric: false },

  // ✅ DATAS CORRIGIDAS
  DATA_REQUISICAO: {
    expression: 'rp."AUDITED_CREATED_AT"::date',
    isMetric: false,
  },
  FINALIZADA: { expression: 'qp."DTT_FINISHED"::date', isMetric: false },

  // ✅ CAMPOS DE IDENTIFICAÇÃO
  ID_COTACAO: { expression: 'qp."process_ptr_id"', isMetric: false },
  NUMERO_COTACAO: { expression: 'qp."PROCESS_NUMBER"', isMetric: false },

  // ✅ MÉTRICAS DE VALORES
  VALOR_TOTAL_NEGOCIADO: {
    expression: '(qib."NEGOTIATED_PRICE" * qi."QUANTITY")',
    isMetric: true,
  },
  SAVING_ULT_COMPRA: {
    expression:
      '((qib."TOTALIZER_LAST_ITEM_PRICE" - qib."NEGOTIATED_PRICE") * qi."QUANTITY")',
    isMetric: true,
  },
  SAVING_MELHOR_PRECO: {
    expression: '((qib."BEST_PRICE" - qib."NEGOTIATED_PRICE") * qi."QUANTITY")',
    isMetric: true,
  },
  PRECO_NEGOCIADO: { expression: 'qib."NEGOTIATED_PRICE"', isMetric: true },
  VALOR_UNIT_ULT_COMPRA: {
    expression: 'qib."TOTALIZER_LAST_ITEM_PRICE"',
    isMetric: true,
  },
  ESTIMATIVA_VALOR: { expression: 'ri."ESTIMATE_VALUE"', isMetric: true },

  // ✅ MÉTRICAS DE CONTAGEM - CORRIGIDAS
  QUANTIDADE: {
    expression: 'COUNT(DISTINCT qp."process_ptr_id")',
    isMetric: true,
    requiresComplexJoin: true, // Usa JOINs com filtros (mostra cotações únicas)
  },

  // 🆕 NOVO CAMPO: QUANTIDADE TOTAL SEM FILTROS (mostra 629)
  QUANTIDADE_TOTAL: {
    expression: 'COUNT(DISTINCT qp."process_ptr_id")',
    isMetric: true,
    requiresSimpleJoin: true, // Usa query simplificada
  },

  // 🆕 SOMA DAS QUANTIDADES (o que estava sendo calculado errado antes)
  SOMA_QUANTIDADES: {
    expression: 'SUM(CAST(qi."QUANTITY" AS INTEGER))',
    isMetric: true,
  },

  QTD_COTACOES: {
    expression: 'COUNT(DISTINCT qp."process_ptr_id")',
    isMetric: true,
  },
  QTD_ITENS: {
    expression: 'COUNT(DISTINCT qi."ID_QUOTATION_ITEM")',
    isMetric: true,
  },
  SOMA_QTD_FISICA: { expression: 'SUM(qi."QUANTITY")', isMetric: true },
  QTD_BRANDS: {
    expression: 'COUNT(qib."ID_QUOTATION_ITEM_BRAND")',
    isMetric: true,
  },
};

var aggregationFunctions = {
  sum: function (expr) {
    return "SUM(" + expr + ")";
  },
  avg: function (expr) {
    return "AVG(" + expr + ")";
  },
  count: function (expr) {
    return "COUNT(" + expr + ")";
  },
  max: function (expr) {
    return "MAX(" + expr + ")";
  },
  min: function (expr) {
    return "MIN(" + expr + ")";
  },
  count_distinct: function (expr) {
    return "COUNT(DISTINCT " + expr + ")";
  },
};

// ✅ VERIFICAR SE PRECISA DA QUERY SIMPLIFICADA
var needsSimpleQuery = pivotConfig.values.some(function (fieldName) {
  var mapping = fieldMapping[fieldName];
  return mapping && mapping.requiresSimpleJoin;
});

var allGroupByFields = pivotConfig.rows.concat(pivotConfig.columns);
var selectClauses = [];
var groupByClauses = [];

// Processar campos de agrupamento
allGroupByFields.forEach(function (fieldName) {
  var mapping = fieldMapping[fieldName];
  if (mapping && !mapping.isMetric) {
    selectClauses.push(mapping.expression + ' AS "' + fieldName + '"');
    groupByClauses.push(mapping.expression);
  }
});

// Processar campos de valor/métricas
pivotConfig.values.forEach(function (fieldName) {
  var mapping = fieldMapping[fieldName];
  var aggFunction = aggregationFunctions[pivotConfig.aggregation];

  if (mapping && mapping.isMetric) {
    if (
      mapping.expression.includes("COUNT(DISTINCT") ||
      mapping.expression.includes("COUNT(")
    ) {
      // ✅ CORREÇÃO: Campo já tem agregação COUNT, usar diretamente SEM aplicar SUM
      selectClauses.push(mapping.expression + ' AS "' + fieldName + '"');
    } else if (aggFunction) {
      // Aplicar função de agregação para outros campos
      selectClauses.push(
        aggFunction(mapping.expression) + ' AS "' + fieldName + '"'
      );
    }
  }
});

if (selectClauses.length === 0) {
  throw new Error("Nenhum campo válido foi selecionado para a query.");
}

var query;
var params = [];

if (needsSimpleQuery) {
  // ✅ QUERY SIMPLIFICADA PARA QUANTIDADE_TOTAL (629 cotações)
  query =
    "SELECT\n  " +
    selectClauses.join(",\n  ") +
    '\nFROM "QUOTATION_PROCESS" AS qp' +
    '\nLEFT JOIN "COMPANY" AS cust_co ON qp."ID_FAVORED_CUSTOMER" = cust_co."ID_COMPANY" AND cust_co."PROFILE" = \'CUSTOMER\'' +
    '\nLEFT JOIN "OFFICE_GROUP" AS og ON cust_co."ID_OFFICE_GROUP" = og."ID_OFFICE_GROUP"' +
    '\nLEFT JOIN "MASTER_GROUP" AS mg ON og."ID_MASTER_GROUP" = mg."ID_MASTER_GROUP"' +
    '\nLEFT JOIN "COLLABORATOR" AS c ON qp."ID_BUYER" = c."ID_COLLABORATOR"' +
    '\nLEFT JOIN "auth_user" AS cp ON c."USER" = cp.id' +
    '\nLEFT JOIN "REQUEST_PROCESS" AS rp ON qp."ID_REQUEST_PROCESS" = rp."process_ptr_id"' +
    '\nWHERE qp."DTT_FINISHED" IS NOT NULL';
} else {
  // ✅ QUERY COMPLEXA PARA QUANTIDADE (519 cotações com filtros)
  query =
    "SELECT\n  " +
    selectClauses.join(",\n  ") +
    '\nFROM "QUOTATION_ITEM_BRAND" AS qib' +
    '\nJOIN "QUOTATION_ITEM" AS qi ON qib."ID_QUOTATION_ITEM" = qi."ID_QUOTATION_ITEM"' +
    '\nJOIN "QUOTATION_PROCESS" AS qp ON qi."ID_QUOTATION_PROCESS" = qp."process_ptr_id"' +
    '\nLEFT JOIN "QUOTATION_PROVIDER_ITEM_BRAND" AS qpi ON qib."ID_QUOTATION_ITEM_BRAND" = qpi."ID_QUOTATION_ITEM_BRAND"' +
    '\nLEFT JOIN "REQUEST_ITEM" AS ri ON qi."ID_REQUEST_ITEM" = ri."ID_REQUEST_ITEM"' +
    '\nLEFT JOIN "REQUEST_PROCESS" AS rp ON qp."ID_REQUEST_PROCESS" = rp."process_ptr_id"' +
    '\nLEFT JOIN "MATERIAL" AS m ON ri."ID_MATERIAL" = m."ID_MATERIAL"' +
    '\nLEFT JOIN "DEPARTMENT" AS d ON ri."ID_DEPARTMENT" = d."ID_DEPARTMENT"' +
    '\nLEFT JOIN "COMPANY" AS cust_co ON qp."ID_FAVORED_CUSTOMER" = cust_co."ID_COMPANY" AND cust_co."PROFILE" = \'CUSTOMER\'' +
    '\nLEFT JOIN "OFFICE_GROUP" AS og ON cust_co."ID_OFFICE_GROUP" = og."ID_OFFICE_GROUP"' +
    '\nLEFT JOIN "MASTER_GROUP" AS mg ON og."ID_MASTER_GROUP" = mg."ID_MASTER_GROUP"' +
    '\nJOIN "COMPANY" AS prov_co ON qib."ID_PROVIDER" = prov_co."ID_COMPANY" AND prov_co."PROFILE" = \'PROVIDER\'' +
    '\nJOIN "COLLABORATOR" AS c ON qp."ID_BUYER" = c."ID_COLLABORATOR"' +
    '\nJOIN "auth_user" AS cp ON c."USER" = cp.id' +
    '\nLEFT JOIN "PRE_ORDER" AS po ON qib."ID_PRE_ORDER" = po."ID_PRE_ORDER"' +
    '\nWHERE qib."NEGOTIATED_PRICE" IS NOT NULL' +
    '\n  AND qib."ID_PROVIDER" IS NOT NULL' +
    '\n  AND qib."TOTALIZER_LAST_ITEM_PRICE" IS NOT NULL' +
    '\n  AND qib."TOTALIZER_LAST_ITEM_PRICE" > 0';
}

// ✅ APLICAR FILTROS COMUNS
if (startDate) {
  query += ' AND qp."DTT_FINISHED"::date >= $' + (params.length + 1);
  params.push(startDate);
}
if (endDate) {
  query += ' AND qp."DTT_FINISHED"::date <= $' + (params.length + 1);
  params.push(endDate);
}
if (groupId) {
  query += ' AND og."ID_OFFICE_GROUP" = $' + (params.length + 1);
  params.push(groupId);
}
if (
  searchTerm &&
  searchTerm.trim() &&
  searchTerm !== '""' &&
  searchTerm !== '%"%'
) {
  query +=
    ' AND (cust_co."NAME" ILIKE $' +
    (params.length + 1) +
    " OR (cp.first_name || ' ' || cp.last_name) ILIKE $" +
    (params.length + 1) +
    ' OR qi."NAME" ILIKE $' +
    (params.length + 1) +
    ")";
  params.push("%" + searchTerm + "%");
}

if (groupByClauses.length > 0) {
  query += "\nGROUP BY " + groupByClauses.join(", ");
}

return [
  {
    json: {
      mainQuery: query,
      mainParams: params,
      // 🆕 INFORMAÇÕES DE DEBUG
      queryType: needsSimpleQuery ? "SIMPLE_QUERY_629" : "COMPLEX_QUERY_519",
      fieldsRequested: pivotConfig.values,
      hasQuantidadeTotal: pivotConfig.values.includes("QUANTIDADE_TOTAL"),
    },
  },
];
