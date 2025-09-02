/**
 * Selected Specifications Summary Component
 * Displays selected characteristics in a unified format
 */

import React from "react";
import { Paper, Typography, Box, Button, Stack } from "@mui/material";
import {
  GetApp as ExportIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import { MaterialIdentificationResult } from "../types";

interface CaracteristicaItem {
  id: string;
  label: string;
  value: string;
  checked: boolean;
}

interface SelectedSpecificationsSummaryProps {
  caracteristicas: CaracteristicaItem[];
  result: MaterialIdentificationResult;
  onShowEquivalenciasTable?: () => void;
}

export const SelectedSpecificationsSummary: React.FC<
  SelectedSpecificationsSummaryProps
> = ({ caracteristicas, result, onShowEquivalenciasTable }) => {
  // Obter características selecionadas
  const selectedCaracteristicas = caracteristicas.filter(
    (item) => item.checked
  );

  if (selectedCaracteristicas.length === 0) {
    return null;
  }

  // Função para exportar dados para XLSX
  const handleExportToXLSX = () => {
    try {
      // Preparar dados para exportação
      const exportData = selectedCaracteristicas.map((item, index) => ({
        Campo: item.label,
        Valor: item.value,
        Ordem: index + 1,
      }));

      // Adicionar informações do produto se disponível
      if (
        result?.response?.enriched?.especificacoesTecnicas
          ?.especificacoesTecnicas
      ) {
        const productInfo =
          result.response.enriched.especificacoesTecnicas
            .especificacoesTecnicas;
        if (productInfo.nomeProduto) {
          exportData.unshift({
            Campo: "Nome do Produto",
            Valor: productInfo.nomeProduto,
            Ordem: 0,
          });
        }
      }

      // Criar workbook e worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Ajustar largura das colunas
      const colWidths = [
        { wch: 30 }, // Campo
        { wch: 40 }, // Valor
        { wch: 10 }, // Ordem
      ];
      ws["!cols"] = colWidths;

      // Adicionar worksheet ao workbook
      XLSX.utils.book_append_sheet(wb, ws, "Especificações");

      // Gerar nome do arquivo com timestamp
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const fileName = `especificacoes_produto_${timestamp}.xlsx`;

      // Salvar arquivo
      XLSX.writeFile(wb, fileName);

      console.log(`Arquivo exportado com sucesso: ${fileName}`);
    } catch (error) {
      console.error("Erro ao exportar arquivo XLSX:", error);
      alert("Erro ao exportar arquivo. Tente novamente.");
    }
  };

  // Função para pesquisar equivalência
  const handleSearchEquivalence = () => {
    if (onShowEquivalenciasTable) {
      onShowEquivalenciasTable();
    } else {
      console.log("Pesquisar equivalência para:", selectedCaracteristicas);
      alert(
        "Funcionalidade de pesquisa de equivalência será implementada em breve!"
      );
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 0,
        mt: 0,
        backgroundColor: "background.paper",
      }}
    >
      {/* Texto unificado das informações selecionadas */}
      <Box sx={{ p: 1, backgroundColor: "grey.50", borderRadius: 1 }}>
        <Typography
          variant="body1"
          sx={{ mb: 0, fontWeight: "bold", color: "text.primary" }}
        >
          Descrição:
        </Typography>
        <Typography
          variant="body1"
          color="text.primary"
          sx={{ fontWeight: 500 }}
        >
          {selectedCaracteristicas
            .map((item) => `${item.label}: ${item.value}`)
            .join("; ")}
        </Typography>
      </Box>

      {/* Botões de ação */}
      <Box sx={{ p: 1, borderTop: 1, borderColor: "divider" }}>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            variant="outlined"
            size="small"
            startIcon={<ExportIcon />}
            onClick={handleExportToXLSX}
            sx={{ minWidth: 120 }}
          >
            Exportar
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<SearchIcon />}
            onClick={handleSearchEquivalence}
            sx={{ minWidth: 140 }}
          >
            Pesquisar Equivalência
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};
