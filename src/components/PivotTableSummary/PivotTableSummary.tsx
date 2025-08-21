// src/components/PivotTableSummary/PivotTableSummary.tsx
import React from "react";
import { Box, Typography, Chip } from "@mui/material";

interface PivotTableSummaryProps {
  summary: {
    totalFields: number;
    fieldsInUse: number;
    displayedRows: number;
    totalRows: number;
    totalGeral?: number;
    valorMedio?: number;
    maiorValor?: number;
    menorValor?: number;
    linhasAtivas?: number;
  };
}

// Função para formatar valores monetários de forma inteligente
const formatCurrency = (value: number): string => {
  if (value === 0) return "0";

  // Se for um número inteiro, exibe sem casas decimais
  if (Number.isInteger(value)) {
    return value.toLocaleString("pt-BR");
  }

  // Se for decimal, exibe com 2 casas decimais
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const PivotTableSummary: React.FC<PivotTableSummaryProps> = ({
  summary,
}) => {
  const {
    totalFields,
    fieldsInUse,
    displayedRows,
    totalRows,
    totalGeral = 0,
    valorMedio = 0,
    maiorValor = 0,
    menorValor = 0,
    linhasAtivas = 0,
  } = summary;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 3, // ✅ MAIOR ESPAÇAMENTO ENTRE COLUNAS
        p: 2,
        backgroundColor: "background.paper",
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        mt: 2,
        flexWrap: "nowrap", // ✅ NUNCA QUEBRAR LINHAS
        flexDirection: "row",
        overflowX: "auto", // ✅ SCROLL HORIZONTAL SE NECESSÁRIO
        minHeight: "70px",
        width: "100%",
      }}
    >
      {/* Coluna 1: Total */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          minWidth: "max-content",
          flexShrink: 0,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ whiteSpace: "nowrap" }}
        >
          📊 Total:
        </Typography>
        <Chip
          label={`${totalFields} campos`}
          size="small"
          variant="outlined"
          color="default"
        />
      </Box>

      {/* Coluna 2: Em uso */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          minWidth: "max-content",
          flexShrink: 0,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ whiteSpace: "nowrap" }}
        >
          ✅ Em uso:
        </Typography>
        <Chip
          label={fieldsInUse}
          size="small"
          variant="filled"
          color="success"
        />
      </Box>

      {/* Coluna 3: Exibindo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          minWidth: "max-content",
          flexShrink: 0,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ whiteSpace: "nowrap" }}
        >
          🔍 Exibindo:
        </Typography>
        <Chip
          label={displayedRows}
          size="small"
          variant="filled"
          color="primary"
        />
      </Box>

      {/* Coluna 4: Total de linhas (condicional) */}
      {totalRows !== displayedRows && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            minWidth: "max-content",
            flexShrink: 0,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ whiteSpace: "nowrap" }}
          >
            📈 Total de linhas:
          </Typography>
          <Chip
            label={totalRows}
            size="small"
            variant="outlined"
            color="info"
          />
        </Box>
      )}

      {/* Coluna 5: Total Geral */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          minWidth: "max-content",
          flexShrink: 0,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ whiteSpace: "nowrap" }}
        >
          💰 Total Geral:
        </Typography>
        <Chip
          label={formatCurrency(totalGeral)}
          size="small"
          variant="filled"
          color="primary"
          sx={{ fontWeight: "bold" }}
        />
      </Box>

      {/* Colunas 6-9: Estatísticas de valores (apenas se houver linhas ativas) */}
      {linhasAtivas > 0 && (
        <>
          {/* Coluna 6: Valor Médio */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              minWidth: "max-content",
              flexShrink: 0,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: "nowrap" }}
            >
              📊 Valor Médio:
            </Typography>
            <Chip
              label={formatCurrency(valorMedio)}
              size="small"
              variant="outlined"
              color="info"
            />
          </Box>

          {/* Coluna 7: Maior Valor */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              minWidth: "max-content",
              flexShrink: 0,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: "nowrap" }}
            >
              🔺 Maior:
            </Typography>
            <Chip
              label={formatCurrency(maiorValor)}
              size="small"
              variant="outlined"
              color="success"
            />
          </Box>

          {/* Coluna 8: Menor Valor */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              minWidth: "max-content",
              flexShrink: 0,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: "nowrap" }}
            >
              🔻 Menor:
            </Typography>
            <Chip
              label={formatCurrency(menorValor)}
              size="small"
              variant="outlined"
              color="warning"
            />
          </Box>

          {/* Coluna 9: Linhas Ativas */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              minWidth: "max-content",
              flexShrink: 0,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: "nowrap" }}
            >
              🎯 Linhas Ativas:
            </Typography>
            <Chip
              label={linhasAtivas}
              size="small"
              variant="outlined"
              color="secondary"
            />
          </Box>
        </>
      )}
    </Box>
  );
};
