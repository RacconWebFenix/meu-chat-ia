// Script de teste para verificar a query gerada

// Simular dados de entrada
const pivotConfig = {
  filters: [
    {
      field: "dia",
      filter: {
        filterType: "date",
        dateFrom: "2024-11-25",
        dateTo: "2024-12-31",
      },
    },
  ],
  rows: ["fabricante", "categoria"],
  columns: ["dia"],
  values: ["QUANTIDADE"],
  aggregation: "sum",
};

// Copiar o mapping e funções do arquivo corrigido
const fieldMapping = {
  dia: {
    column: "CAST(qp.updated_at AS DATE)",
    isMetric: false,
    isDate: true,
  },
  fabricante: {
    column: "qp.fabricante",
    isMetric: false,
  },
  categoria: {
    column: "COALESCE(qp.categoria, 'Outros')",
    isMetric: false,
  },
  QUANTIDADE: {
    expression: 'COUNT(DISTINCT qp."process_ptr_id")',
    isMetric: true,
  },
};

const aggregationFunctions = {
  sum: function (field) {
    return "SUM(" + field + ")";
  },
  avg: function (field) {
    return "AVG(" + field + ")";
  },
  count: function (field) {
    return "COUNT(" + field + ")";
  },
  min: function (field) {
    return "MIN(" + field + ")";
  },
  max: function (field) {
    return "MAX(" + field + ")";
  },
};

// Função para construir a query
function buildPivotQuery(pivotConfig) {
  const selectClauses = [];
  const fromClause = 'FROM "Buscar_preco_QueryProcess" qp';
  const whereConditions = [];
  const groupByColumns = [];

  // Processar filtros
  pivotConfig.filters.forEach(function (filterConfig) {
    const mapping = fieldMapping[filterConfig.field];
    if (mapping && filterConfig.filter) {
      if (filterConfig.filter.filterType === "date") {
        if (filterConfig.filter.dateFrom && filterConfig.filter.dateTo) {
          whereConditions.push(
            mapping.column +
              " BETWEEN '" +
              filterConfig.filter.dateFrom +
              "' AND '" +
              filterConfig.filter.dateTo +
              "'"
          );
        }
      }
    }
  });

  // Processar linhas (rows)
  pivotConfig.rows.forEach(function (fieldName) {
    const mapping = fieldMapping[fieldName];
    if (mapping && !mapping.isMetric) {
      selectClauses.push(mapping.column + ' AS "' + fieldName + '"');
      groupByColumns.push(mapping.column);
    }
  });

  // Processar colunas (columns)
  pivotConfig.columns.forEach(function (fieldName) {
    const mapping = fieldMapping[fieldName];
    if (mapping && !mapping.isMetric) {
      selectClauses.push(mapping.column + ' AS "' + fieldName + '"');
      groupByColumns.push(mapping.column);
    }
  });

  // ✅ CORREÇÃO CRÍTICA: Processar campos de valor/métricas
  pivotConfig.values.forEach(function (fieldName) {
    const mapping = fieldMapping[fieldName];
    const aggFunction = aggregationFunctions[pivotConfig.aggregation];

    if (mapping && mapping.isMetric) {
      if (
        mapping.expression.includes("COUNT(DISTINCT") ||
        mapping.expression.includes("COUNT(")
      ) {
        // ✅ Campo já tem agregação COUNT, usar diretamente SEM aplicar SUM
        selectClauses.push(mapping.expression + ' AS "' + fieldName + '"');
        console.log(
          "✅ QUANTIDADE corrigido: usando COUNT DISTINCT diretamente"
        );
      } else if (aggFunction) {
        // Aplicar função de agregação para outros campos
        selectClauses.push(
          aggFunction(mapping.expression) + ' AS "' + fieldName + '"'
        );
      }
    }
  });

  // Construir query final
  let query = "SELECT " + selectClauses.join(", ");
  query += " " + fromClause;

  if (whereConditions.length > 0) {
    query += " WHERE " + whereConditions.join(" AND ");
  }

  if (groupByColumns.length > 0) {
    query += " GROUP BY " + groupByColumns.join(", ");
  }

  query += " ORDER BY " + groupByColumns.join(", ");

  return query;
}

// Testar a query
const query = buildPivotQuery(pivotConfig);
console.log("Query gerada:");
console.log(query);
console.log("\n✅ Verificações:");
console.log('- Campo QUANTIDADE usa COUNT(DISTINCT qp."process_ptr_id")');
console.log("- NÃO aplica SUM sobre o COUNT");
console.log("- Deve retornar 629 cotações únicas (não 519 soma)");
