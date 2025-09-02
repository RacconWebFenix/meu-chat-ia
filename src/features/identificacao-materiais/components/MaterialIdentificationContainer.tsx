/**
 * Material Identification Container
 * Following Single Respon      // Função para converter camelCase em labels amigáveis
  const convertCamelCaseToLabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1') // Espaço antes de maiúsculas
      .replace(/^./, str => str.toUpperCase()) // Primeira letra maiúscula
      .replace(/Mm$/, ' (mm)') // Unidades de medida
      .replace(/Kn$/, ' (kN)')
      .replace(/Rpm$/, ' (RPM)')
      .replace(/Dpi$/, ' (DPI)') // Resolução
      .replace(/Usb$/, ' (USB)') // Conectividade
      .replace(/Os$/, ' (OS)') // Sistema Operacional
      .replace(/M\d+x[\d.]+$/, match => ` ${match}`) // Rosca (ex: M20x1.5)
      .replace(/Ncm$/, ' (NCM)') // Código NCM
      .trim();
  };tries(techSpecs).forEach(([key, value], index) => {
        if (value !== null && value !== undefined && value !== "") {
          // Criar label amigável diretamente da chave, sem usar parser hardcoded
          const friendlyLabel = key
            .replace(/([A-Z])/g, ' $1') // Adicionar espaço antes de maiúsculas
            .replace(/^./, str => str.toUpperCase()) // Primeira letra maiúscula
            .replace(/Mm$/, ' (mm)') // Adicionar unidade para medidas
            .replace(/Kn$/, ' (kN)') // Adicionar unidade para forças
            .replace(/Rpm$/, ' (RPM)'); // Adicionar unidade para rotações

          caracteristicasList.push({
            id: `dynamic-${key}-${index}`,
            label: friendlyLabel,
            value: String(value),
            checked: true,
          });
        }
      });le and Dependency Inversion
 */

import React, { useState, useCallback } from "react";
import { Container, Box, Paper, Typography } from "@mui/material";
import { useMaterialIdentification, useEquivalenceSearch } from "../hooks";
import {
  createMaterialIdentificationService,
  createEquivalenceSearchService,
} from "../services";
import { MaterialIdentificationResult, EquivalenceSearchData } from "../types";
import {
  MaterialSearchHeader,
  PDMModelDisplay,
  MaterialIdentificationLoading,
  CaracteristicasSelectorContainer,
  EquivalenciasTableContainer,
} from "./index";

interface CaracteristicaItem {
  id: string;
  label: string;
  value: string;
  checked: boolean;
}

export const MaterialIdentificationContainer: React.FC = () => {
  // Create services
  const materialService = React.useMemo(() => {
    return createMaterialIdentificationService();
  }, []);

  const equivalenceService = React.useMemo(() => {
    return createEquivalenceSearchService();
  }, []);

  const { state, updateSearchData, identifyMaterial } =
    useMaterialIdentification({ service: materialService });

  const equivalenceState = useEquivalenceSearch(equivalenceService);

  // Estado para características selecionáveis
  const [caracteristicas, setCaracteristicas] = useState<CaracteristicaItem[]>(
    []
  );

  // Estado para controlar a exibição da tabela de equivalências
  const [showEquivalenciasTable, setShowEquivalenciasTable] = useState(false);

  // Função para validar se um campo deve ser exibido
  const shouldDisplayField = (
    key: string,
    value: string | number | null
  ): boolean => {
    // Regras de validação - ser mais permissivo
    const invalidKeys = ["id", "createdAt", "updatedAt"]; // Campos técnicos

    // Não permitir null ou undefined
    if (value === null || value === undefined) {
      return false;
    }

    // Não permitir campos técnicos
    if (invalidKeys.includes(key)) {
      return false;
    }

    // Permitir tudo o resto (incluindo strings vazias e números 0)
    return true;
  };

  // Função para converter camelCase em labels amigáveis
  const convertCamelCaseToLabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1") // Espaço antes de maiúsculas
      .replace(/^./, (str) => str.toUpperCase()) // Primeira letra maiúscula
      .replace(/Mm$/, " (mm)") // Unidades de medida
      .replace(/Kn$/, " (kN)")
      .replace(/Rpm$/, " (RPM)")
      .replace(/M\d+x[\d.]+$/, (match) => ` ${match}`) // Rosca (ex: M20x1.5)
      .trim();
  };

  // Função para extrair características do resultado
  const extractCaracteristicasFromResult = useCallback(
    (result: MaterialIdentificationResult): CaracteristicaItem[] => {
      const caracteristicasList: CaracteristicaItem[] = [];

      // 1. Adicionar nome do produto (sempre deve existir)
      let nomeProduto = result?.response?.enriched?.nomeProdutoEncontrado || "";

      // Se não houver nomeProdutoEncontrado, construir a partir de referência e fabricante
      if (!nomeProduto.trim()) {
        const referencia =
          result?.response?.enriched?.especificacoesTecnicas
            ?.especificacoesTecnicas?.["Referencia Encontrada"] ||
          result?.response?.enriched?.especificacoesTecnicas
            ?.especificacoesTecnicas?.["Referência Encontrada"] ||
          result?.response?.enriched?.especificacoesTecnicas
            ?.especificacoesTecnicas?.["referenciaEncontrada"] ||
          "";
        const fabricante = result?.response?.enriched?.marcaFabricante || "";

        if (referencia && fabricante) {
          nomeProduto = `${String(referencia)} ${fabricante}`.trim();
        } else if (referencia) {
          nomeProduto = String(referencia);
        } else if (fabricante) {
          nomeProduto = fabricante;
        } else {
          nomeProduto = "Produto não identificado";
        }
      }

      caracteristicasList.push({
        id: "nome-produto",
        label: "Nome do Produto",
        value: nomeProduto,
        checked: true,
      });

      // 2. Adicionar campos de nível superior relevantes
      const enriched = result?.response?.enriched;
      if (enriched) {
        // Adicionar categoria se existir e não estiver vazia
        if (enriched.categoria && enriched.categoria.trim() !== "") {
          caracteristicasList.push({
            id: "categoria",
            label: "Categoria",
            value: enriched.categoria,
            checked: true,
          });
        }

        // Adicionar subcategoria se existir e não estiver vazia
        if (enriched.subcategoria && enriched.subcategoria.trim() !== "") {
          caracteristicasList.push({
            id: "subcategoria",
            label: "Subcategoria",
            value: enriched.subcategoria,
            checked: true,
          });
        }

        // Adicionar marca fabricante
        if (
          enriched.marcaFabricante &&
          enriched.marcaFabricante.trim() !== ""
        ) {
          caracteristicasList.push({
            id: "marca-fabricante",
            label: "Marca Fabricante",
            value: enriched.marcaFabricante,
            checked: true,
          });
        }
      }

      // 3. Adicionar campos específicos importantes das especificações técnicas
      const techSpecs =
        result?.response?.enriched?.especificacoesTecnicas
          ?.especificacoesTecnicas;

      if (techSpecs) {
        // Campos prioritários que sempre devem aparecer
        const priorityFields = [
          "Referencia Encontrada",
          "Referência Encontrada",
          "referenciaEncontrada",
          "N",
          "Ncm",
          "Unidade Medida",
          "unidadeMedida",
        ];

        priorityFields.forEach((fieldKey) => {
          const value = techSpecs[fieldKey];
          if (
            value !== null &&
            value !== undefined &&
            String(value).trim() !== ""
          ) {
            const friendlyLabel = convertCamelCaseToLabel(fieldKey);
            caracteristicasList.push({
              id: `priority-${fieldKey}`,
              label: friendlyLabel,
              value: String(value),
              checked: true,
            });
          }
        });

        // 4. Processar campos dinâmicos restantes
        Object.entries(techSpecs).forEach(([key, value]) => {
          // Pular campos já adicionados como prioridade
          if (priorityFields.includes(key)) return;

          // Filtrar apenas valores válidos usando shouldDisplayField
          if (shouldDisplayField(key, value)) {
            const friendlyLabel = convertCamelCaseToLabel(key);

            caracteristicasList.push({
              id: `dynamic-${key}`,
              label: friendlyLabel,
              value: String(value),
              checked: true,
            });
          }
        });
      }

      return caracteristicasList;
    },
    []
  );

  // Atualizar características quando o resultado muda
  React.useEffect(() => {
    if (state.result) {
      const extractedCaracteristicas = extractCaracteristicasFromResult(
        state.result
      );
      setCaracteristicas(extractedCaracteristicas);
    }
  }, [state.result, extractCaracteristicasFromResult]);

  const handleSearch = async () => {
    await identifyMaterial();
  };

  const handleCaracteristicaChange = (id: string, checked: boolean) => {
    setCaracteristicas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked } : item))
    );
  };

  const handleCaracteristicaValueChange = (id: string, newValue: string) => {
    setCaracteristicas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: newValue } : item))
    );
  };

  const handleCaracteristicaLabelChange = (id: string, newLabel: string) => {
    setCaracteristicas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, label: newLabel } : item))
    );
  };

  const handleConfirmSelection = async () => {
    const selected = caracteristicas.filter((item) => item.checked);

    if (selected.length === 0) {
      alert(
        "Selecione pelo menos uma característica para buscar equivalências"
      );
      return;
    }

    // Preparar dados para busca de equivalências
    // Pegar o nome do produto das características selecionadas
    const nomeProdutoCaracteristica = selected.find(
      (item) => item.id === "nome-produto"
    );
    const referenciaCaracteristica = selected.find(
      (item) =>
        item.label.toLowerCase().includes("referencia") ||
        item.label.toLowerCase().includes("referência")
    );
    const fabricanteCaracteristica = selected.find(
      (item) => item.id === "marca-fabricante"
    );

    const nome =
      nomeProdutoCaracteristica?.value ||
      (referenciaCaracteristica && fabricanteCaracteristica
        ? `${referenciaCaracteristica.value} ${fabricanteCaracteristica.value}`.trim()
        : referenciaCaracteristica?.value ||
          fabricanteCaracteristica?.value ||
          state.result?.response?.enriched?.nomeProdutoEncontrado ||
          "Produto não identificado");

    const searchData: EquivalenceSearchData = {
      nome: nome,
      marcaFabricante:
        fabricanteCaracteristica?.value ||
        state.result?.response?.enriched?.marcaFabricante ||
        "",
      categoria: state.result?.response?.enriched?.categoria || "",
      subcategoria: state.result?.response?.enriched?.subcategoria || "",
      especificacoesTecnicas:
        state.result?.response?.enriched?.especificacoesTecnicas
          ?.especificacoesTecnicas || {},
      aplicacao: "",
      unidadeMedida: "",
      breveDescricao:
        state.result?.response?.enriched?.especificacoesTecnicas?.resumoPDM ||
        "",
      normas: [],
      imagens: state.result?.response?.enriched?.imagens || [],
    };

    // Buscar equivalências
    await equivalenceState.searchEquivalences(searchData);
    setShowEquivalenciasTable(true);
  };

  const handleAddCaracteristica = (key: string, value: string) => {
    const newCaracteristica: CaracteristicaItem = {
      id: `custom-${Date.now()}`,
      label: key,
      value: value,
      checked: true,
    };
    setCaracteristicas((prev) => [...prev, newCaracteristica]);
  };

  return (
    <Container maxWidth="xl" disableGutters>
      <Box sx={{ width: "100%", p: 2 }}>
        <MaterialSearchHeader
          searchData={state.searchData}
          onSearchDataChange={updateSearchData}
          onSearch={handleSearch}
          isLoading={state.isLoading}
        />

        {state.isLoading && <MaterialIdentificationLoading />}

        {!state.isLoading && state.result && (
          <>
            <PDMModelDisplay result={state.result} error={state.error} />

            <CaracteristicasSelectorContainer
              caracteristicas={caracteristicas}
              onCaracteristicaChange={handleCaracteristicaChange}
              onCaracteristicaValueChange={handleCaracteristicaValueChange}
              onCaracteristicaLabelChange={handleCaracteristicaLabelChange}
              onConfirmSelection={handleConfirmSelection}
              onAddCaracteristica={handleAddCaracteristica}
              result={state.result}
              isLoading={state.isLoading}
              onShowEquivalenciasTable={handleConfirmSelection}
            />

            {showEquivalenciasTable && (
              <EquivalenciasTableContainer
                equivalencias={equivalenceState.results}
                isLoading={equivalenceState.isLoading}
              />
            )}

            {/* Loading para busca de equivalências */}
            {equivalenceState.isLoading && !showEquivalenciasTable && (
              <Paper sx={{ p: 2, mt: 2 }}>
                <Typography>Carregando equivalências...</Typography>
              </Paper>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};
