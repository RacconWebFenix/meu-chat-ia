/**
 * Características Selector Container Component
 * Following Single Responsibility Principle
 */

import React, { useState } from "react";
import { Paper, Typography, Box, Button, Grid } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { CheckboxSpecCard } from "../../pdm";
import AddNewSpecDialog from "../../pdm/components/AddNewSpecDialog";
import { SelectedSpecificationsSummary } from "./SelectedSpecificationsSummary";
import { MaterialIdentificationResult } from "../types";

interface CaracteristicaItem {
  id: string;
  label: string;
  value: string;
  checked: boolean;
}

interface CaracteristicasSelectorContainerProps {
  caracteristicas: CaracteristicaItem[];
  onCaracteristicaChange: (id: string, checked: boolean) => void;
  onCaracteristicaValueChange: (id: string, newValue: string) => void;
  onCaracteristicaLabelChange: (id: string, newLabel: string) => void;
  onConfirmSelection: () => void;
  onAddCaracteristica: (key: string, value: string) => void;
  result: MaterialIdentificationResult;
  isLoading?: boolean;
  onShowEquivalenciasTable?: () => void;
}

export const CaracteristicasSelectorContainer: React.FC<
  CaracteristicasSelectorContainerProps
> = ({
  caracteristicas,
  onCaracteristicaChange,
  onCaracteristicaValueChange,
  onCaracteristicaLabelChange,
  onConfirmSelection,
  onAddCaracteristica,
  result,
  isLoading = false,
  onShowEquivalenciasTable,
}) => {
  // Estado para controlar o dialog de adicionar
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Ordenar características para que campos prioritários apareçam sempre em primeiro lugar
  const sortedCaracteristicas = React.useMemo(() => {
    const priorityOrder = [
      "priority-nomeProduto",
      "priority-fabricante",
      "priority-Ncm",
      "priority-N",
      "priority-unidadeMedida",
      "priority-Unidade Medida",
    ];

    // Separar itens prioritários e não prioritários
    const priorityItems: CaracteristicaItem[] = [];
    const otherItems: CaracteristicaItem[] = [];

    caracteristicas.forEach((item) => {
      if (priorityOrder.includes(item.id)) {
        priorityItems.push(item);
      } else {
        otherItems.push(item);
      }
    });

    // Ordenar itens prioritários pela ordem definida
    const sortedPriorityItems = priorityItems.sort((a, b) => {
      const indexA = priorityOrder.indexOf(a.id);
      const indexB = priorityOrder.indexOf(b.id);
      return indexA - indexB;
    });

    return [...sortedPriorityItems, ...otherItems];
  }, [caracteristicas]);

  const selectedCount = sortedCaracteristicas.filter(
    (item) => item.checked
  ).length;

  // Função para adicionar nova característica
  const handleAddCaracteristica = (key: string, value: string) => {
    onAddCaracteristica(key, value);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mt: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Selecione as características que deseja incluir no produto
          {selectedCount > 0 && ` (${selectedCount} selecionadas)`}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setIsDialogOpen(true)}
          startIcon={<AddIcon />}
          disabled={isLoading}
          sx={{
            height: 32,
            fontSize: "0.7rem",
          }}
        >
          Adicionar
        </Button>
      </Box>

      <Grid container spacing={1} sx={{ mb: 2 }}>
        {sortedCaracteristicas.map((item) => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
            <CheckboxSpecCard
              id={item.id}
              checked={item.checked}
              label={item.label}
              value={item.value}
              onCheck={onCaracteristicaChange}
              onValueChange={onCaracteristicaValueChange}
              onLabelChange={onCaracteristicaLabelChange}
              editable={true}
            />
          </Grid>
        ))}
      </Grid>

      <SelectedSpecificationsSummary
        caracteristicas={sortedCaracteristicas}
        result={result}
        onShowEquivalenciasTable={onShowEquivalenciasTable}
      />

      {/* Dialog para adicionar novas características */}
      <AddNewSpecDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAdd={handleAddCaracteristica}
      />
    </Paper>
  );
};
