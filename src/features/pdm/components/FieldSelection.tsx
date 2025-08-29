// src/features/pdm/components/FieldSelection.tsx
// Layout Vertical em Coluna Única - Scroll Único - Updated: 2025-08-28
// Seção 1: Resumo PDM (largura 100%, conteúdo fixo)
// Seção 2: Características (largura 100%, grid de cards)
// Seção 3: Dados do Produto (largura 100%, formulário)
// Todas as seções rolam juntas com scroll único

import React, { useState } from "react";
import {
  Typography,
  Paper,
  Button,
  Stack,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Add as AddIcon, GetApp as ExportIcon } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { EnrichmentResponse, EnrichedProductData } from "../types";
import { formatTechnicalKey } from "@/Utils/formatUtils";
import CheckboxSpecCard from "./CheckboxSpecCard";
import AddNewSpecDialog from "./AddNewSpecDialog";
import ExpandablePDMSummary from "./ExpandablePDMSummary";

// Interface para especificações com checkbox
interface SpecItem {
  readonly id: string;
  readonly key: string;
  readonly value: string;
  readonly checked: boolean;
}

// Interface para dados editáveis
interface EditableData {
  readonly categoria: string;
  readonly aplicacao: string;
  readonly informacoes: string;
  readonly marca: string;
  readonly especificacoesTecnicas: SpecItem[];
}

// Utilitário para extrair fabricante de forma robusta
const extractFabricante = (enriched: unknown, specs: Record<string, unknown>): string => {
  // 1. Primeiro: campo dedicado marcaFabricante
  if (enriched && typeof enriched === 'object' && 'marcaFabricante' in enriched) {
    const enrichedObj = enriched as Record<string, unknown>;
    const marcaFabricante = enrichedObj.marcaFabricante;
    if (marcaFabricante) return String(marcaFabricante);
  }

  // 2. Segundo: procurar em especificações técnicas
  const fabricanteKeys = ['fabricante', 'marca', 'manufacturer', 'brand'];
  for (const [key, value] of Object.entries(specs)) {
    if (fabricanteKeys.some(fab => key.toLowerCase().includes(fab.toLowerCase()))) {
      return String(value);
    }
  }

  // 3. Terceiro: valor padrão
  return "";
};

// Utilitário para filtrar especificações removendo fabricante
const filterFabricanteFromSpecs = (specs: Record<string, unknown>): Record<string, unknown> => {
  const fabricanteKeys = ['fabricante', 'marca', 'manufacturer', 'brand'];
  const filtered: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(specs)) {
    if (!fabricanteKeys.some(fab => key.toLowerCase().includes(fab.toLowerCase()))) {
      filtered[key] = value;
    }
  }

  return filtered;
};

// Utilitário para converter specs para array
const specsToArray = (
  specs: Record<string, unknown>
): Array<{ key: string; value: string }> => {
  return Object.entries(specs || {}).map(([key, value]) => ({
    key,
    value: String(value),
  }));
};

// Utilitário para converter array para specs object
const specsToObject = (specs: SpecItem[]): Record<string, unknown> => {
  return specs.reduce((acc, spec) => {
    acc[spec.key] = spec.value;
    return acc;
  }, {} as Record<string, unknown>);
};

interface FieldSelectionProps {
  readonly enrichmentResult: EnrichmentResponse;
  readonly onBack: () => void;
  readonly onContinue: (modifiedData: EnrichedProductData) => void;
}

export default function FieldSelection({
  enrichmentResult,
  onBack,
  onContinue,
}: FieldSelectionProps) {
  // Estado para dados editáveis
  const [editableData, setEditableData] = useState<EditableData>(() => {
    // Acessar as especificações técnicas da nova estrutura
    const rawSpecs =
      enrichmentResult.enriched.especificacoesTecnicas
        ?.especificacoesTecnicas || {};

    // Filtrar fabricante das especificações
    const specs = filterFabricanteFromSpecs(rawSpecs);

    const formattedSpecs = specsToArray(specs).map((spec) => ({
      id: uuidv4(),
      key: formatTechnicalKey(spec.key),
      value: spec.value,
      checked: true,
    }));

    // Debug para verificar as especificações
    console.log("🔍 Especificações brutas:", rawSpecs);
    console.log("🔍 Especificações filtradas:", specs);
    console.log("📋 Especificações formatadas:", formattedSpecs);
    console.log("📄 Estrutura completa do enrichmentResult:", enrichmentResult);

    return {
      categoria: enrichmentResult.enriched.categoria || "",
      aplicacao: enrichmentResult.enriched.aplicacao || "",
      informacoes: enrichmentResult.original.informacoes || "",
      marca: extractFabricante(enrichmentResult.enriched, rawSpecs),
      especificacoesTecnicas: formattedSpecs,
    };
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [marcaError, setMarcaError] = useState("");
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("xlsx");

  // Função para gerar dados completos
  const getDadosCompletos = () => {
    const nomeOriginal = editableData.informacoes || "Não informado";
    const fabricante = editableData.marca || "Não informado";
    const caracteristicasSelecionadas = editableData.especificacoesTecnicas
      .filter(spec => spec.checked)
      .map((spec) => `${spec.key}: ${spec.value}`)
      .join(", ");

    return `Nome Original: ${nomeOriginal}\n\nFabricante: ${fabricante}\n\nCaracterísticas Selecionadas:\n${
      caracteristicasSelecionadas || "Nenhuma característica selecionada"
    }`;
  };

  // Função para gerar resumo
  const getResumo = () => {
    const nomeOriginal = editableData.informacoes || "Produto";
    const marca = editableData.marca || "Marca não informada";
    return `${nomeOriginal} - ${marca}`;
  };

  // Funções de exportação
  const exportToCSV = (data: string) => {
    const csvContent = `Nome Original,Fabricante,Características Selecionadas,Resumo\n"${editableData.informacoes}","${editableData.marca}","${data.replace(/\n/g, ' ').replace(/"/g, '""')}","${getResumo()}"`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `dados_produto_${Date.now()}.csv`;
    link.click();
  };

  const exportToXLSX = (data: string) => {
    // Para XLSX, vamos criar um HTML table que pode ser aberto no Excel
    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Dados do Produto</title>
        </head>
        <body>
          <table border="1">
            <tr>
              <th>Nome Original</th>
              <th>Fabricante</th>
              <th>Características Selecionadas</th>
              <th>Resumo</th>
            </tr>
            <tr>
              <td>${editableData.informacoes}</td>
              <td>${editableData.marca}</td>
              <td>${data.replace(/\n/g, '<br>')}</td>
              <td>${getResumo()}</td>
            </tr>
          </table>
        </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `dados_produto_${Date.now()}.xlsx`;
    link.click();
  };

  const exportToPDF = (data: string) => {
    // Para PDF, vamos criar um HTML simples que pode ser impresso
    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Dados do Produto - ${getResumo()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Dados Completos do Produto</h1>
          <div class="section">
            <div class="label">Nome Original:</div>
            <div>${editableData.informacoes}</div>
          </div>
          <div class="section">
            <div class="label">Fabricante:</div>
            <div>${editableData.marca}</div>
          </div>
          <div class="section">
            <div class="label">Características Selecionadas:</div>
            <div>${data.replace(/\n/g, '<br>')}</div>
          </div>
          <div class="section">
            <div class="label">Resumo:</div>
            <div>${getResumo()}</div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const exportToODT = (data: string) => {
    // Para ODT, vamos criar um arquivo de texto formatado
    const odtContent = `Dados Completos do Produto
========================

Nome Original: ${editableData.informacoes}

Fabricante: ${editableData.marca}

Características Selecionadas:
${data}

Resumo:
${getResumo()}

Gerado em: ${new Date().toLocaleString('pt-BR')}
`;
    const blob = new Blob([odtContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `dados_produto_${Date.now()}.txt`;
    link.click();
  };

  const handleExport = () => {
    const dadosCompletos = getDadosCompletos();

    switch (exportFormat) {
      case 'csv':
        exportToCSV(dadosCompletos);
        break;
      case 'xlsx':
        exportToXLSX(dadosCompletos);
        break;
      case 'pdf':
        exportToPDF(dadosCompletos);
        break;
      case 'odt':
        exportToODT(dadosCompletos);
        break;
      default:
        console.error('Formato não suportado:', exportFormat);
    }

    setExportDialogOpen(false);
  };

  // Handlers para atualizar campos básicos
  const handleFieldChange = (
    field: keyof Omit<EditableData, "especificacoesTecnicas">,
    value: string
  ) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpecAdd = (key: string, value: string) => {
    const newSpec: SpecItem = {
      id: uuidv4(),
      key,
      value,
      checked: true,
    };
    setEditableData((prev) => ({
      ...prev,
      especificacoesTecnicas: [...prev.especificacoesTecnicas, newSpec],
    }));
  };

  const handleContinue = () => {
    // Validação da marca
    if (!editableData.marca.trim()) {
      setMarcaError("A marca é obrigatória para prosseguir");
      return;
    }

    setMarcaError("");

    const modifiedData: EnrichedProductData = {
      ...enrichmentResult.enriched,
      categoria: editableData.categoria,
      aplicacao: editableData.aplicacao,
      marcaFabricante: editableData.marca,
      // Também passamos as informações originais editadas
      informacoes: editableData.informacoes,
      especificacoesTecnicas: {
        // Preserva o resumoPDM original
        resumoPDM: enrichmentResult.enriched.especificacoesTecnicas?.resumoPDM,
        // Atualiza as especificações técnicas editadas
        especificacoesTecnicas: specsToObject(
          editableData.especificacoesTecnicas
        ),
      },
    };
    onContinue(modifiedData);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3, // Espaçamento entre seções
        width: "100%",
        // Removido padding para não criar limitações
      }}
    >
      {/* SEÇÃO 1: Resumo PDM - Card Expansível - Largura Total */}
      {enrichmentResult.enriched.especificacoesTecnicas?.resumoPDM && (
        <ExpandablePDMSummary
          summaryText={enrichmentResult.enriched.especificacoesTecnicas.resumoPDM}
          maxLines={5}
          imagens={enrichmentResult.enriched.imagens}
        />
      )}

      {/* SEÇÃO 2: Características - Largura Total */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          width: "100%",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontSize: "0.9rem" }}>
          Características ({editableData.especificacoesTecnicas.filter(spec => spec.checked).length} de {editableData.especificacoesTecnicas.length})
        </Typography>

        {/* Grid de Cards - Mantendo funcionamento original */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 0.8,
            mb: 2,
          }}
        >
          {editableData.especificacoesTecnicas.length === 0 ? (
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.75rem",
                color: "text.secondary",
                gridColumn: "1 / -1",
                textAlign: "center",
                py: 4,
              }}
            >
              Nenhuma característica encontrada. Use o botão
              &quot;Adicionar&quot; para criar novas características.
            </Typography>
          ) : (
            editableData.especificacoesTecnicas.map((spec) => (
              <CheckboxSpecCard
                key={spec.id}
                id={spec.id}
                label={spec.key}
                value={spec.value}
                checked={spec.checked}
                onCheck={(id, checked) => {
                  setEditableData((prev) => ({
                    ...prev,
                    especificacoesTecnicas: prev.especificacoesTecnicas.map((s) =>
                      s.id === id ? { ...s, checked } : s
                    ),
                  }));
                }}
                onValueChange={(id, newValue) => {
                  setEditableData((prev) => ({
                    ...prev,
                    especificacoesTecnicas: prev.especificacoesTecnicas.map(
                      (s) => (s.id === id ? { ...s, value: newValue } : s)
                    ),
                  }));
                }}
                onLabelChange={(id, newLabel) => {
                  setEditableData((prev) => ({
                    ...prev,
                    especificacoesTecnicas: prev.especificacoesTecnicas.map(
                      (s) => (s.id === id ? { ...s, key: newLabel } : s)
                    ),
                  }));
                }}
                editable={true}
              />
            ))
          )}
        </Box>

        {/* Botão Add */}
        <Button
          variant="outlined"
          onClick={() => setIsDialogOpen(true)}
          startIcon={<AddIcon />}
          sx={{
            height: 32,
            fontSize: "0.7rem",
          }}
        >
          Adicionar
        </Button>
      </Paper>

      {/* SEÇÃO 3: Dados do Produto - Largura Total */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          width: "100%",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontSize: "0.9rem" }}>
          Dados do Produto
        </Typography>

        <Stack spacing={2} sx={{ mb: 3 }}>
          {/* Campo Informações Originais */}
          <TextField
            label="Informações Originais"
            value={editableData.informacoes}
            onChange={(e) => handleFieldChange("informacoes", e.target.value)}
            size="small"
            fullWidth
            helperText="Edite as informações originais conforme necessário"
          />

          {/* Campo Marca */}
          <TextField
            label="Fabricante"
            value={editableData.marca}
            onChange={(e) => {
              handleFieldChange("marca", e.target.value);
              if (marcaError) setMarcaError("");
            }}
            size="small"
            fullWidth
            error={!!marcaError}
            helperText={marcaError || "Fabricante do produto (preenchido automaticamente)"}
            required
          />

          {/* Dados Completos */}
          <Box
            sx={{
              p: 1.5,
              bgcolor: "grey.50",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontSize: "0.8rem", mb: 1, fontWeight: 600 }}
            >
              Dados Completos:
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontSize: "0.65rem",
                lineHeight: 1.4,
                color: "text.secondary",
                whiteSpace: "pre-line",
              }}
            >
              {getDadosCompletos()}
            </Typography>
          </Box>

          {/* Resumo */}
          <Box
            sx={{
              p: 1.5,
              bgcolor: "grey.50",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontSize: "0.8rem", mb: 1, fontWeight: 600 }}
            >
              Resumo:
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontSize: "0.65rem",
                lineHeight: 1.4,
                color: "text.secondary",
              }}
            >
              {getResumo()}
            </Typography>
          </Box>
        </Stack>

        {/* Botões de Ação */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            pt: 2,
            borderTop: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Button
            variant="outlined"
            onClick={onBack}
            sx={{ height: 32, fontSize: "0.7rem" }}
          >
            Voltar
          </Button>
          <Button
            variant="outlined"
            onClick={() => setExportDialogOpen(true)}
            startIcon={<ExportIcon />}
            sx={{ height: 32, fontSize: "0.7rem" }}
          >
            Exportar
          </Button>
          <Button
            variant="contained"
            onClick={handleContinue}
            sx={{ height: 32, fontSize: "0.7rem", flex: 1 }}
          >
            Continuar
          </Button>
        </Stack>
      </Paper>

      {/* Dialog para adicionar novas especificações */}
      <AddNewSpecDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAdd={handleSpecAdd}
      />

      {/* Dialog para seleção de formato de exportação */}
      <Dialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Exportar Dados do Produto</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Formato do Arquivo</InputLabel>
            <Select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              label="Formato do Arquivo"
            >
              <MenuItem value="xlsx">Excel (XLSX)</MenuItem>
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="odt">Texto (ODT)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleExport} variant="contained">
            Exportar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
