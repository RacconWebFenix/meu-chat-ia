// src/features/pdm/components/EnrichmentResult.tsx

import React from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  Stack,
  Divider,
  Button,
} from "@mui/material";
import { EnrichmentResponse } from "../types";
import { formatTechnicalKey } from "@/Utils/formatUtils"; // Assumindo que criamos este utilitário

interface EnrichmentResultProps {
  readonly result: EnrichmentResponse;
  readonly onBack: () => void;
  readonly onContinue: () => void;
}

export default function EnrichmentResult({
  result,
  onBack,
  onContinue,
}: EnrichmentResultProps) {
  const { original, enriched, metrics } = result;

  return (
    <Stack gap={3}>
      {/* ... (código do cabeçalho do card, chips, etc. permanece o mesmo) ... */}
      <Typography variant="h5">Resultado do Enriquecimento</Typography>
      <Paper
        variant="outlined"
        sx={{ p: 2, display: "flex", gap: 2, alignItems: "center" }}
      >
        <Chip
          label={`Confiança: ${Math.round(metrics.confidence * 100)}%`}
          color={metrics.confidence > 0.8 ? "success" : "warning"}
        />
        <Chip
          label={`Fonte: ${metrics.source.replace(/_/g, " ")}`}
          variant="outlined"
        />
      </Paper>

      <Paper variant="outlined">
        <Typography variant="h6" sx={{ p: 2 }}>
          Dados Originais vs. Enriquecidos
        </Typography>
        <Divider />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            p: 2,
          }}
        >
          {/* Coluna Dados Originais */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Dados Fornecidos
            </Typography>
            <List dense>
              {Object.entries(original).map(([key, value]) =>
                value && typeof value === "string" ? (
                  <ListItem key={key}>
                    <ListItemText
                      primary={formatTechnicalKey(key)}
                      secondary={value}
                    />
                  </ListItem>
                ) : null
              )}
            </List>
          </Box>

          <Divider orientation="vertical" flexItem />

          {/* Coluna Dados Enriquecidos */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Dados Enriquecidos
            </Typography>
            <List dense>
              {Object.entries(enriched.especificacoesTecnicas).map(
                ([key, value]) => {
                  // GUARDA DE TIPO: Renderiza apenas se 'value' for string ou número
                  const isRenderable =
                    value &&
                    (typeof value === "string" || typeof value === "number");

                  return isRenderable ? (
                    <ListItem key={key}>
                      <ListItemText
                        primary={formatTechnicalKey(key)} // Usando a função para formatar a chave
                        secondary={value}
                      />
                    </ListItem>
                  ) : null;
                }
              )}
            </List>
          </Box>
        </Box>
      </Paper>
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
        <Button variant="outlined" color="secondary" onClick={onBack}>
          Voltar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onContinue}
          size="large"
        >
          Revisar e Ajustar
        </Button>
      </Stack>
    </Stack>
  );
}
