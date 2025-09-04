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

import React, { useState, useCallback, useEffect } from "react";
import { Container, Box, Paper, Typography } from "@mui/material";
import { useMaterialIdentification, useEquivalenceSearch } from "../../hooks";
import {
  createMaterialIdentificationService,
  createEquivalenceSearchService,
} from "../../services";
import {
  MaterialIdentificationResult,
  EquivalenceSearchData,
  EquivalenceSearchResult,
} from "../../types";
import {
  MaterialSearchHeader,
  PDMModelDisplay,
  MaterialIdentificationLoading,
  CaracteristicasSelectorContainer,
  EquivalenciasTableContainer,
  ERPExportContainer,
} from "../index";
import GlobalLoading from "../../../../components/shared/GlobalLoading/GlobalLoading";

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

  // Estado para armazenar os resultados modificados com linha original
  const [modifiedEquivalences, setModifiedEquivalences] =
    useState<EquivalenceSearchResult | null>(null);

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

      // 2. Adicionar apenas campos das especificações técnicas (removendo duplicação)
      const techSpecs =
        result?.response?.enriched?.especificacoesTecnicas
          ?.especificacoesTecnicas;

      if (techSpecs) {
        // Campos prioritários que sempre devem aparecer
        const priorityFields = [
          "nomeProduto", // Adicionar nomeProduto como prioritário
          "Referencia Encontrada",
          "Referência Encontrada",
          "referenciaEncontrada",
          "fabricante", // Manter fabricante das especificações técnicas
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

        // 3. Processar campos dinâmicos restantes
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

  // Atualizar equivalências modificadas quando os resultados chegam da API
  React.useEffect(() => {
    if (equivalenceState.results?.equivalencias && showEquivalenciasTable) {
      // Criar linha original com os dados da busca atual
      const selected = caracteristicas.filter((item) => item.checked);

      const nomeProdutoCaracteristica = selected.find(
        (item) =>
          item.id === "priority-nomeProduto" || item.id === "nome-produto"
      );
      const fabricanteCaracteristica = selected.find(
        (item) => item.id === "priority-fabricante"
      );
      const ncmCaracteristica = selected.find(
        (item) => item.id === "priority-Ncm" || item.id === "priority-N"
      );
      const unidadeMedidaCaracteristica = selected.find(
        (item) =>
          item.id === "priority-unidadeMedida" ||
          item.id === "priority-Unidade Medida"
      );

      // Recriar searchData baseado nas características selecionadas
      const nome =
        nomeProdutoCaracteristica?.value ||
        (selected.find(
          (item) =>
            item.label.toLowerCase().includes("referencia") ||
            item.label.toLowerCase().includes("referência")
        ) && fabricanteCaracteristica
          ? `${
              selected.find(
                (item) =>
                  item.label.toLowerCase().includes("referencia") ||
                  item.label.toLowerCase().includes("referência")
              )?.value
            } ${fabricanteCaracteristica.value}`.trim()
          : selected.find(
              (item) =>
                item.label.toLowerCase().includes("referencia") ||
                item.label.toLowerCase().includes("referência")
            )?.value ||
            fabricanteCaracteristica?.value ||
            "Produto não identificado");

      const searchData = {
        nome: nome,
        marcaFabricante: fabricanteCaracteristica?.value || "",
        categoria: state.result?.response?.enriched?.categoria || "",
        subcategoria: state.result?.response?.enriched?.subcategoria || "",
        especificacoesTecnicas:
          state.result?.response?.enriched?.especificacoesTecnicas
            ?.especificacoesTecnicas || {},
        aplicacao: "",
        unidadeMedida: unidadeMedidaCaracteristica?.value || "",
        breveDescricao:
          state.result?.response?.enriched?.especificacoesTecnicas?.resumoPDM ||
          "",
        normas: [],
        imagens: state.result?.response?.enriched?.imagens || [],
      };

      // Criar linha original com os dados da busca
      const linhaOriginal = {
        nome: nomeProdutoCaracteristica?.value || searchData.nome,
        fabricante:
          fabricanteCaracteristica?.value || searchData.marcaFabricante,
        NCM:
          ncmCaracteristica?.value ||
          String(searchData.especificacoesTecnicas?.ncm || ""),
        referencia: String(
          searchData.especificacoesTecnicas?.referenciaEncontrada || ""
        ),
        tipo_de_unidade:
          unidadeMedidaCaracteristica?.value ||
          String(searchData.especificacoesTecnicas?.unidadeMedida || ""),
        caracteristicas: [
          {
            ...Object.fromEntries(
              Object.entries(searchData.especificacoesTecnicas || {}).map(
                ([key, value]) => [key, String(value || "")]
              )
            ),
          },
        ],
        imagens: searchData.imagens || [],
        citacoes: [],
      };

      // Adicionar linha original no início dos resultados
      const resultadosComOriginal = {
        equivalencias: [
          linhaOriginal,
          ...equivalenceState.results.equivalencias,
        ],
      };

      setModifiedEquivalences(resultadosComOriginal);
    }
  }, [
    equivalenceState.results,
    showEquivalenciasTable,
    caracteristicas,
    state.result,
  ]);

  // Scroll para o fim da página quando qualquer loading terminar
  React.useEffect(() => {
    if (
      !state.isLoading &&
      !equivalenceState.isLoading &&
      showEquivalenciasTable
    ) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [state.isLoading, equivalenceState.isLoading, showEquivalenciasTable]);

  const handleSearch = async () => {
    // Limpar estados de equivalências antes de nova pesquisa
    setShowEquivalenciasTable(false);
    // Resetar características para nova pesquisa
    setCaracteristicas([]);
    // Resetar estado de equivalências
    equivalenceState.reset();
    // Limpar equivalências modificadas
    setModifiedEquivalences(null);

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
      (item) => item.id === "priority-nomeProduto" || item.id === "nome-produto"
    );
    const referenciaCaracteristica = selected.find(
      (item) =>
        item.label.toLowerCase().includes("referencia") ||
        item.label.toLowerCase().includes("referência")
    );
    const fabricanteCaracteristica = selected.find(
      (item) => item.id === "priority-fabricante" // Usar fabricante das especificações técnicas
    );
    const ncmCaracteristica = selected.find(
      (item) => item.id === "priority-Ncm" || item.id === "priority-N"
    );
    const unidadeMedidaCaracteristica = selected.find(
      (item) =>
        item.id === "priority-unidadeMedida" ||
        item.id === "priority-Unidade Medida"
    );

    const nome =
      nomeProdutoCaracteristica?.value ||
      (referenciaCaracteristica && fabricanteCaracteristica
        ? `${referenciaCaracteristica.value} ${fabricanteCaracteristica.value}`.trim()
        : referenciaCaracteristica?.value ||
          fabricanteCaracteristica?.value ||
          "Produto não identificado");

    const searchData: EquivalenceSearchData = {
      nome: nome,
      marcaFabricante:
        fabricanteCaracteristica?.value || // Usar fabricante das specs técnicas
        "",
      categoria: state.result?.response?.enriched?.categoria || "",
      subcategoria: state.result?.response?.enriched?.subcategoria || "",
      especificacoesTecnicas:
        state.result?.response?.enriched?.especificacoesTecnicas
          ?.especificacoesTecnicas || {},
      aplicacao: "",
      unidadeMedida: unidadeMedidaCaracteristica?.value || "",
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
          isLoading={false}
        />

        {/* Loading global para todas as operações */}
        {(state.isLoading || equivalenceState.isLoading) && (
          <GlobalLoading open={true} />
        )}

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
              onShowEquivalenciasTable={handleConfirmSelection}
            />

            {/* ERP Export Component */}
            <ERPExportContainer />

            {showEquivalenciasTable && (
              <EquivalenciasTableContainer
                equivalencias={modifiedEquivalences}
              />
            )}
          </>
        )}
      </Box>
    </Container>
  );
};
