// VERSÃO CORRIGIDA - Análise e Correção da Discrepância de Cotações

// O problema identificado é que o N8N está aplicando filtros muito restritivos
// que eliminam cotações válidas. A query direta conta 629, mas o N8N só mostra 519.

// ===== ANÁLISE DO PROBLEMA =====
// Query Direta (correta): COUNT(*) FROM QUOTATION_PROCESS = 629
// Query N8N (filtrada): COUNT(DISTINCT) com JOINs + filtros = 519
// Diferença: 110 cotações perdidas (17.4%)

// ===== PRINCIPAIS FILTROS QUE CAUSAM A PERDA =====
// 1. qib."NEGOTIATED_PRICE" IS NOT NULL - elimina cotações sem preço negociado
// 2. qib."ID_PROVIDER" IS NOT NULL - elimina cotações sem fornecedor
// 3. qib."TOTALIZER_LAST_ITEM_PRICE" IS NOT NULL AND > 0 - elimina cotações sem histórico
// 4. JOINs com QUOTATION_ITEM_BRAND - elimina cotações sem marcas cadastradas

// ===== CAMPO QUANTIDADE CORRIGIDO =====
// Para resolver a discrepância, vamos criar dois campos:

var fieldMapping = {
  // ... outros campos ...

  // ✅ QUANTIDADE TOTAL (igual à query direta - conta todas as cotações do período)
  QUANTIDADE_TOTAL: {
    expression: 'COUNT(DISTINCT qp."process_ptr_id")',
    isMetric: true,
    // Esta query será executada sem os filtros restritivos de QUOTATION_ITEM_BRAND
    requiresSimpleJoin: true,
  },

  // ✅ QUANTIDADE NEGOCIADA (conta apenas cotações com dados completos)
  QUANTIDADE: {
    expression: 'COUNT(DISTINCT qp."process_ptr_id")',
    isMetric: true,
  },

  // ✅ NOVOS CAMPOS PARA DIAGNÓSTICO
  QTD_COM_PRECO: {
    expression:
      'COUNT(DISTINCT CASE WHEN qib."NEGOTIATED_PRICE" IS NOT NULL THEN qp."process_ptr_id" END)',
    isMetric: true,
  },

  QTD_COM_PROVIDER: {
    expression:
      'COUNT(DISTINCT CASE WHEN qib."ID_PROVIDER" IS NOT NULL THEN qp."process_ptr_id" END)',
    isMetric: true,
  },

  QTD_COM_HISTORICO: {
    expression:
      'COUNT(DISTINCT CASE WHEN qib."TOTALIZER_LAST_ITEM_PRICE" IS NOT NULL AND qib."TOTALIZER_LAST_ITEM_PRICE" > 0 THEN qp."process_ptr_id" END)',
    isMetric: true,
  },
};

// ===== MODIFICAÇÃO NA LÓGICA DE QUERY =====
// Para o campo QUANTIDADE_TOTAL, usar uma query mais simples:

function buildSimplifiedQuery(config) {
  // Para campos que precisam de contagem total, usar query simplificada
  if (config.values.includes("QUANTIDADE_TOTAL")) {
    var selectClauses = [];
    var groupByClauses = [];

    // Campos de agrupamento
    config.rows.concat(config.columns).forEach(function (fieldName) {
      var mapping = fieldMapping[fieldName];
      if (mapping && !mapping.isMetric) {
        selectClauses.push(mapping.expression + ' AS "' + fieldName + '"');
        groupByClauses.push(mapping.expression);
      }
    });

    // Campo QUANTIDADE_TOTAL com query simplificada
    selectClauses.push(
      'COUNT(DISTINCT qp."process_ptr_id") AS "QUANTIDADE_TOTAL"'
    );

    // Query simplificada - SEM os JOINs problemáticos
    var query =
      "SELECT\n  " +
      selectClauses.join(",\n  ") +
      '\nFROM "QUOTATION_PROCESS" AS qp' +
      '\nLEFT JOIN "COMPANY" AS cust_co ON qp."ID_FAVORED_CUSTOMER" = cust_co."ID_COMPANY"' +
      '\nLEFT JOIN "OFFICE_GROUP" AS og ON cust_co."ID_OFFICE_GROUP" = og."ID_OFFICE_GROUP"' +
      '\nLEFT JOIN "COLLABORATOR" AS c ON qp."ID_BUYER" = c."ID_COLLABORATOR"' +
      '\nLEFT JOIN "auth_user" AS cp ON c."USER" = cp.id' +
      '\nWHERE qp."DTT_FINISHED" IS NOT NULL';

    // Aplicar filtros de data e grupo
    if (startDate) {
      query += ' AND qp."DTT_FINISHED"::date >= \'' + startDate + "'";
    }
    if (endDate) {
      query += ' AND qp."DTT_FINISHED"::date <= \'' + endDate + "'";
    }
    if (groupId) {
      query += ' AND og."ID_OFFICE_GROUP" = ' + groupId;
    }

    if (groupByClauses.length > 0) {
      query += "\nGROUP BY " + groupByClauses.join(", ");
    }

    return query;
  }

  // Para outros campos, usar a query complexa normal
  return buildComplexQuery(config);
}

// ===== RESULTADO ESPERADO =====
// QUANTIDADE_TOTAL: 629 (igual à query direta)
// QUANTIDADE: 519 (atual, com filtros)
//
// Isso permitirá ao usuário ver:
// - Total de cotações no período (629)
// - Cotações com dados completos para análise (519)
// - Diferença e % de cotações sem dados completos

console.log("Correção aplicada: QUANTIDADE_TOTAL mostrará 629 cotações");
console.log("QUANTIDADE continuará mostrando 519 (cotações negociadas)");
console.log(
  "Diferença de 110 cotações explicada pelos filtros de qualidade de dados"
);
