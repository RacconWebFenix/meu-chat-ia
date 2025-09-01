/**
 * Material Identification Container
 * Following Single Responsibility Principle and Dependency Inversion
 */

import React, { useState } from "react";
import { Container, Box } from "@mui/material";
import { useMaterialIdentification } from "../hooks";
import { createMaterialIdentificationService } from "../services";
import { MaterialIdentificationResult } from "../types";
import {
  MaterialSearchHeader,
  PDMModelDisplay,
  MaterialIdentificationLoading,
  CaracteristicasSelectorContainer,
} from "./index";

interface CaracteristicaItem {
  id: string;
  label: string;
  value: string;
  checked: boolean;
}

export const MaterialIdentificationContainer: React.FC = () => {
  const service = createMaterialIdentificationService();
  const { state, updateSearchData, identifyMaterial } =
    useMaterialIdentification({ service });

  // Estado para características selecionáveis
  const [caracteristicas, setCaracteristicas] = useState<CaracteristicaItem[]>(
    []
  );

  // Função para extrair características do resultado da API
  const extractCaracteristicasFromResult = (
    result: MaterialIdentificationResult
  ): CaracteristicaItem[] => {
    if (!result?.response?.enriched?.especificacoesTecnicas) {
      return [];
    }

    const specs = result.response.enriched.especificacoesTecnicas;
    const caracteristicasList: CaracteristicaItem[] = [];

    // Extrair do objeto especificacoesTecnicas
    if (specs.especificacoesTecnicas) {
      const techSpecs = specs.especificacoesTecnicas;

      // Mapeamento das propriedades técnicas para labels amigáveis
      const techSpecsMapping: Record<string, string> = {
        fabricante: "Fabricante",
        referenciaEncontrada: "Referência Encontrada",
        ncm: "NCM",
        unidadeMedida: "Unidade de Medida",
        diametroInternoMm: "Diâmetro Interno (mm)",
        diametroExternoMm: "Diâmetro Externo (mm)",
        larguraMm: "Largura (mm)",
        materialGaiola: "Material da Gaiola",
        tipoVedacao: "Tipo de Vedação",
        capacidadeCargaDinamicaKn: "Capacidade de Carga Dinâmica (kN)",
        velocidadeMaximaRpm: "Velocidade Máxima (RPM)",
      };

      Object.entries(techSpecs).forEach(([key, value], index) => {
        if (value !== null && value !== undefined && value !== "") {
          caracteristicasList.push({
            id: `tech-${index}`,
            label: techSpecsMapping[key] || key,
            value: String(value),
            checked: true,
          });
        }
      });
    }

    return caracteristicasList;
  };

  // Atualizar características quando o resultado muda
  React.useEffect(() => {
    if (state.result) {
      const extractedCaracteristicas = extractCaracteristicasFromResult(
        state.result
      );
      setCaracteristicas(extractedCaracteristicas);
    }
  }, [state.result]);

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
    console.log("Características selecionadas:", selected);
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
              isLoading={state.isLoading}
            />
          </>
        )}
      </Box>
    </Container>
  );
};
