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
import { Container, Box } from "@mui/material";
import { useMaterialIdentification } from "../hooks";
import { createMaterialIdentificationService } from "../services";
import { MaterialIdentificationResult } from "../types";
import {
  MaterialSearchHeader,
  PDMModelDisplay,
  MaterialIdentificationLoading,
  CaracteristicasSelectorContainer,
  EquivalenciasTableContainer,
} from "./index";
import { mockEquivalenciasData } from "../mocks/mockEquivalenciasData";

interface CaracteristicaItem {
  id: string;
  label: string;
  value: string;
  checked: boolean;
}

export const MaterialIdentificationContainer: React.FC = () => {
  // Create service
  const service = React.useMemo(() => {
    return createMaterialIdentificationService();
  }, []);

  const { state, updateSearchData, identifyMaterial } =
    useMaterialIdentification({ service });

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

      // 1. Adicionar nomeProdutoEncontrado se existir
      if (result?.response?.enriched?.nomeProdutoEncontrado) {
        caracteristicasList.push({
          id: "nome-produto-encontrado",
          label: "Nome do Produto Encontrado",
          value: result.response.enriched.nomeProdutoEncontrado,
          checked: true,
        });
      }

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

      // 3. Processar campos de especificacoesTecnicas
      const techSpecs =
        result?.response?.enriched?.especificacoesTecnicas
          ?.especificacoesTecnicas;

      if (techSpecs) {
        Object.entries(techSpecs).forEach(([key, value]) => {
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

  const handleConfirmSelection = () => {
    const selected = caracteristicas.filter((item) => item.checked);
    // Aqui você pode implementar a lógica para processar as características selecionadas
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
              onShowEquivalenciasTable={() => setShowEquivalenciasTable(true)}
            />

            {showEquivalenciasTable && (
              <EquivalenciasTableContainer
                equivalencias={mockEquivalenciasData}
                isLoading={state.isLoading}
              />
            )}
          </>
        )}
      </Box>
    </Container>
  );
};
