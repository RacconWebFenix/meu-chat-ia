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
import { MaterialIdentificationResult } from "../../types";

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
      // Preparar dados seguindo o mesmo formato do useERPExport
      const exportRow: Record<string, string> = {};

      // Adicionar nome do produto se disponível
      if (
        result?.response?.enriched?.especificacoesTecnicas
          ?.especificacoesTecnicas?.nomeProduto
      ) {
        exportRow["Nome do Produto"] = String(
          result.response.enriched.especificacoesTecnicas.especificacoesTecnicas
            .nomeProduto
        );
      }

      // Adicionar características selecionadas
      selectedCaracteristicas.forEach((item) => {
        exportRow[item.label] = item.value;
      });

      // Criar worksheet com uma única linha (igual ao useERPExport)
      const ws = XLSX.utils.json_to_sheet([exportRow]);

      // Ajustar largura das colunas dinamicamente (igual ao useERPExport)
      const columnWidths = Object.keys(exportRow).map((key) => ({
        wch: Math.max(key.length, exportRow[key].length, 15), // Largura mínima de 15
      }));
      ws["!cols"] = columnWidths;

      // Criar workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Especificações");

      // Gerar nome do arquivo com timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const fileName = `especificacoes_produto_${timestamp}.xlsx`;

      // Salvar arquivo com configurações UTF-8 (igual ao useERPExport)
      XLSX.writeFile(wb, fileName, {
        bookSST: false, // Desabilitar Shared String Table para preservar UTF-8
        type: "binary", // Usar tipo binário para melhor suporte a caracteres
      });

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
          {/* <Button
            variant="contained"
            size="small"
            startIcon={<SearchIcon />}
            onClick={handleSearchEquivalence}
            sx={{ minWidth: 140 }}
          >
            Pesquisar Equivalência
          </Button> */}
        </Stack>
      </Box>
    </Paper>
  );
};
