/**
 * EnrichmentResult component to display enriched product data.
 * Refatorado para corrigir erro de hidratação e aplicar tema "Aço Escovado".
 */

import React from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  Divider,
} from "@mui/material";
import { EnrichmentResponse } from "../types";

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
  const { original, enriched, metrics, suggestions, warnings } = result;

  const getConfidenceColor = (
    confidence: number
  ): "success" | "warning" | "default" => {
    if (confidence > 0.8) return "success";
    if (confidence > 0.6) return "warning";
    return "default";
  };

  return (
    <Stack gap={3}>
      <Typography variant="h5">Resultado do Enriquecimento</Typography>

      {warnings && warnings.length > 0 && (
        <Alert severity="warning">
          {warnings.map((warning, index) => (
            <div key={index}>{warning}</div>
          ))}
        </Alert>
      )}

      <Paper
        variant="outlined"
        sx={{ p: 2, display: "flex", gap: 2, alignItems: "center" }}
      >
        <Chip
          label={`Confiança: ${Math.round(metrics.confidence * 100)}%`}
          color={getConfidenceColor(metrics.confidence)}
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
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            p: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              INFORMAÇÃO ORIGINAL
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Nome" secondary={original.nome} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Referência"
                  secondary={original.referencia || "N/A"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Fabricante"
                  secondary={original.marcaFabricante || "N/A"}
                />
              </ListItem>
            </List>
          </Box>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 2, display: { xs: "none", md: "block" } }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="primary">
              INFORMAÇÃO ENRIQUECIDA
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Categoria"
                  secondary={enriched.categoria}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="PDM Padronizado"
                  secondary={enriched.pdmPadronizado}
                />
              </ListItem>
            </List>
          </Box>
        </Box>
      </Paper>

      {suggestions && suggestions.length > 0 && (
        <Paper variant="outlined">
          <Typography variant="h6" sx={{ p: 2 }}>
            💡 Sugestões de Melhoria
          </Typography>
          <Divider />
          <List>
            {suggestions.map((suggestion, index) => (
              <ListItem key={index} divider={index < suggestions.length - 1}>
                <ListItemText
                  primary={`Campo: ${suggestion.field}`}
                  // **AQUI ESTÁ A CORREÇÃO DO ERRO DE HIDRATAÇÃO**
                  // Esta prop instrui o MUI a usar uma <div> em vez de <p>,
                  // permitindo aninhar outros elementos de bloco.
                  secondaryTypographyProps={{ component: "div" }}
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2">
                        Valor sugerido:{" "}
                        <strong>{suggestion.suggestedValue}</strong>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {suggestion.reason} (Confiança:{" "}
                        {Math.round(suggestion.confidence * 100)}%)
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

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
          Continuar
        </Button>
      </Stack>
    </Stack>
  );
}
