# Análise da Discrepância entre Query Direta e N8N

## Problema Identificado
- **Query Direta**: 629 cotações
- **Frontend (N8N)**: 519 cotações
- **Diferença**: 110 cotações (17.4% menos)

## Comparação das Queries

### Query Direta (Simples)
```sql
SELECT COUNT(*) AS "Total_Cotacoes_Julho_2025"
FROM "QUOTATION_PROCESS" AS qp
LEFT JOIN "OFFICE_GROUP" AS og ON qp."ID_FAVORED_CUSTOMER_OFFICE_GROUP" = og."ID_OFFICE_GROUP"
WHERE
  og."ID_OFFICE_GROUP" = 114
  AND qp."DTT_FINISHED" >= '2025-07-01'
  AND qp."DTT_FINISHED" < '2025-08-01';
```

### Query N8N (Complexa)
```sql
SELECT COUNT(DISTINCT qp."process_ptr_id") AS "QUANTIDADE"
FROM "QUOTATION_ITEM_BRAND" AS qib 
JOIN "QUOTATION_ITEM" AS qi ON qib."ID_QUOTATION_ITEM" = qi."ID_QUOTATION_ITEM" 
JOIN "QUOTATION_PROCESS" AS qp ON qi."ID_QUOTATION_PROCESS" = qp."process_ptr_id" 
LEFT JOIN "QUOTATION_PROVIDER_ITEM_BRAND" AS qpi ON qib."ID_QUOTATION_ITEM_BRAND" = qpi."ID_QUOTATION_ITEM_BRAND" 
LEFT JOIN "REQUEST_ITEM" AS ri ON qi."ID_REQUEST_ITEM" = ri."ID_REQUEST_ITEM" 
LEFT JOIN "REQUEST_PROCESS" AS rp ON qp."ID_REQUEST_PROCESS" = rp."process_ptr_id" 
LEFT JOIN "MATERIAL" AS m ON ri."ID_MATERIAL" = m."ID_MATERIAL" 
LEFT JOIN "DEPARTMENT" AS d ON ri."ID_DEPARTMENT" = d."ID_DEPARTMENT" 
LEFT JOIN "COMPANY" AS cust_co ON qp."ID_FAVORED_CUSTOMER" = cust_co."ID_COMPANY" AND cust_co."PROFILE" = 'CUSTOMER' 
LEFT JOIN "OFFICE_GROUP" AS og ON cust_co."ID_OFFICE_GROUP" = og."ID_OFFICE_GROUP" 
LEFT JOIN "MASTER_GROUP" AS mg ON og."ID_MASTER_GROUP" = mg."ID_MASTER_GROUP" 
JOIN "COMPANY" AS prov_co ON qib."ID_PROVIDER" = prov_co."ID_COMPANY" AND prov_co."PROFILE" = 'PROVIDER' 
JOIN "COLLABORATOR" AS c ON qp."ID_BUYER" = c."ID_COLLABORATOR" 
JOIN "auth_user" AS cp ON c."USER" = cp.id 
LEFT JOIN "PRE_ORDER" AS po ON qib."ID_PRE_ORDER" = po."ID_PRE_ORDER" 
WHERE qib."NEGOTIATED_PRICE" IS NOT NULL 
  AND qib."ID_PROVIDER" IS NOT NULL 
  AND qib."TOTALIZER_LAST_ITEM_PRICE" IS NOT NULL 
  AND qib."TOTALIZER_LAST_ITEM_PRICE" > 0
  AND qp."DTT_FINISHED"::date >= '2025-07-01'
  AND qp."DTT_FINISHED"::date <= '2025-07-31'
  AND og."ID_OFFICE_GROUP" = 114
```

## Diferenças Principais

### 1. **Filtros Adicionais na Query N8N**
```sql
-- Query N8N tem filtros que a query direta não tem:
qib."NEGOTIATED_PRICE" IS NOT NULL 
AND qib."ID_PROVIDER" IS NOT NULL 
AND qib."TOTALIZER_LAST_ITEM_PRICE" IS NOT NULL 
AND qib."TOTALIZER_LAST_ITEM_PRICE" > 0
```

### 2. **Diferença nas Datas**
- Query Direta: `< '2025-08-01'` (exclusivo)
- Query N8N: `<= '2025-07-31'` (inclusivo)

### 3. **Estrutura das Tabelas**
- Query Direta: Usa `ID_FAVORED_CUSTOMER_OFFICE_GROUP` diretamente
- Query N8N: Vai através de `COMPANY` -> `OFFICE_GROUP`

### 4. **Contagem Diferente**
- Query Direta: `COUNT(*)` na tabela QUOTATION_PROCESS
- Query N8N: `COUNT(DISTINCT qp."process_ptr_id")` com JOINs complexos

## Possíveis Causas da Discrepância

1. **Cotações sem QUOTATION_ITEM_BRAND**: Cotações que não têm registros na tabela QUOTATION_ITEM_BRAND
2. **Cotações sem preços negociados**: Cotações onde `NEGOTIATED_PRICE` é NULL
3. **Cotações sem último preço**: Cotações onde `TOTALIZER_LAST_ITEM_PRICE` é NULL ou <= 0
4. **Cotações sem provedor**: Cotações onde `ID_PROVIDER` é NULL

## Teste de Diagnóstico Sugerido

```sql
-- Verificar quantas cotações são perdidas por cada filtro
SELECT 
  COUNT(*) as total_cotacoes,
  COUNT(CASE WHEN qib."ID_QUOTATION_ITEM_BRAND" IS NOT NULL THEN 1 END) as com_item_brand,
  COUNT(CASE WHEN qib."NEGOTIATED_PRICE" IS NOT NULL THEN 1 END) as com_preco_negociado,
  COUNT(CASE WHEN qib."ID_PROVIDER" IS NOT NULL THEN 1 END) as com_provider,
  COUNT(CASE WHEN qib."TOTALIZER_LAST_ITEM_PRICE" IS NOT NULL AND qib."TOTALIZER_LAST_ITEM_PRICE" > 0 THEN 1 END) as com_ultimo_preco_valido
FROM "QUOTATION_PROCESS" AS qp
LEFT JOIN "OFFICE_GROUP" AS og ON qp."ID_FAVORED_CUSTOMER_OFFICE_GROUP" = og."ID_OFFICE_GROUP"
LEFT JOIN "QUOTATION_ITEM" AS qi ON qi."ID_QUOTATION_PROCESS" = qp."process_ptr_id"
LEFT JOIN "QUOTATION_ITEM_BRAND" AS qib ON qib."ID_QUOTATION_ITEM" = qi."ID_QUOTATION_ITEM"
WHERE og."ID_OFFICE_GROUP" = 114
  AND qp."DTT_FINISHED" >= '2025-07-01'
  AND qp."DTT_FINISHED" < '2025-08-01';
```
