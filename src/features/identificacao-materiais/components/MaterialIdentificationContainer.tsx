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
  EquivalenciasTableContainer,
} from "./index";
import { useMockMode } from "../contexts/MockModeContext";
import {
  N8NHttpClient,
  N8NMaterialIdentificationApiImpl,
} from "../services/n8n";
import { dynamicFieldParser } from "../../pdm/services";
import { mockEquivalenciasData } from "../mocks/mockEquivalenciasData";

interface CaracteristicaItem {
  id: string;
  label: string;
  value: string;
  checked: boolean;
}

export const MaterialIdentificationContainer: React.FC = () => {
  const { isMockMode } = useMockMode();

  // Create service based on mock mode
  const service = React.useMemo(() => {
    if (isMockMode) {
      return createMaterialIdentificationService(true);
    } else {
      // For now, still use mock but show message
      const httpClient = new N8NHttpClient(
        process.env.NEXT_PUBLIC_N8N_BASE_URL || "http://localhost:3001"
      );
      const n8nApi = new N8NMaterialIdentificationApiImpl(httpClient);
      return createMaterialIdentificationService(false, n8nApi);
    }
  }, [isMockMode]);

  const { state, updateSearchData, identifyMaterial } =
    useMaterialIdentification({ service });

  // Estado para características selecionáveis
  const [caracteristicas, setCaracteristicas] = useState<CaracteristicaItem[]>(
    []
  );

  // Estado para controlar a exibição da tabela de equivalências
  const [showEquivalenciasTable, setShowEquivalenciasTable] = useState(false);

  // Função para extrair características do resultado usando apenas especificacoesTecnicas
  const extractCaracteristicasFromResult = (
    result: MaterialIdentificationResult
  ): CaracteristicaItem[] => {
    const caracteristicasList: CaracteristicaItem[] = [];

    // Extrair apenas da chave especificacoesTecnicas
    if (
      result?.response?.enriched?.especificacoesTecnicas?.especificacoesTecnicas
    ) {
      const techSpecs =
        result.response.enriched.especificacoesTecnicas.especificacoesTecnicas;

      Object.entries(techSpecs).forEach(([key, value], index) => {
        if (value !== null && value !== undefined && value !== "") {
          // Usa o parser dinâmico para gerar o label amigável
          const parsedField = dynamicFieldParser.parseField(
            key,
            result.response?.enriched?.categoria
          );

          caracteristicasList.push({
            id: `tech-${index}`,
            label: parsedField.friendlyLabel,
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
