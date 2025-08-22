/**
 * EnrichmentResult component to display enriched product data
 * Following Single Responsibility Principle
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

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          📋 Resultado do Enriquecimento
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Dados enriquecidos com base em catálogos e algoritmos de IA
        </Typography>
      </Box>

      {/* Confidence and Source */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Chip
            label={`Confiança: ${Math.round(metrics.confidence * 100)}%`}
            color={
              metrics.confidence > 0.8
                ? "success"
                : metrics.confidence > 0.6
                ? "warning"
                : "error"
            }
            variant="outlined"
          />
          <Chip
            label={`Fonte: ${metrics.source}`}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Paper>

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Avisos importantes:
          </Typography>
          <List dense>
            {warnings.map((warning, index) => (
              <ListItem key={index} sx={{ py: 0 }}>
                <ListItemText primary={warning} />
              </ListItem>
            ))}
          </List>
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          mb: 3,
        }}
      >
        {/* Original Data */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 2, height: "fit-content" }}>
            <Typography variant="h6" gutterBottom color="text.secondary">
              📝 Dados Originais
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Nome:
              </Typography>
              <Typography variant="body1">{original.nome}</Typography>
            </Box>
            {original.referencia && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Referência:
                </Typography>
                <Typography variant="body1">{original.referencia}</Typography>
              </Box>
            )}
            {original.marcaFabricante && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Fabricante:
                </Typography>
                <Typography variant="body1">
                  {original.marcaFabricante}
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Enriched Data */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              ✨ Dados Enriquecidos
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Categoria:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {enriched.categoria}
              </Typography>
            </Box>

            {enriched.subcategoria && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Subcategoria:
                </Typography>
                <Typography variant="body1">{enriched.subcategoria}</Typography>
              </Box>
            )}

            {enriched.aplicacao && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Aplicação:
                </Typography>
                <Typography variant="body1">{enriched.aplicacao}</Typography>
              </Box>
            )}

            {enriched.normas && enriched.normas.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Normas:
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {enriched.normas.map((norma, index) => (
                    <Chip
                      key={index}
                      label={norma}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Technical Specifications */}
      {enriched.especificacoesTecnicas && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            🔧 Especificações Técnicas
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr",
              },
              gap: 2,
            }}
          >
            {Object.entries(enriched.especificacoesTecnicas).map(
              ([key, value]) => (
                <Box key={key}>
                  <Typography variant="body2" color="text.secondary">
                    {key}:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {value}
                  </Typography>
                </Box>
              )
            )}
          </Box>
        </Paper>
      )}

      {/* PDM Generated */}
      {enriched.pdmPadronizado && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            📋 PDM Padronizado
          </Typography>
          <Paper
            sx={{
              p: 2,
              bgcolor: "grey.50",
              border: "1px solid",
              borderColor: "grey.300",
              fontFamily: "monospace",
            }}
          >
            <Typography
              variant="body1"
              sx={{ wordBreak: "break-word", fontFamily: "inherit" }}
            >
              {enriched.pdmPadronizado}
            </Typography>
          </Paper>
        </Paper>
      )}

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            💡 Sugestões de Melhoria
          </Typography>
          <List>
            {suggestions.map((suggestion, index) => (
              <ListItem key={index} divider={index < suggestions.length - 1}>
                <ListItemText
                  primary={`Campo: ${suggestion.field}`}
                  secondary={
                    <Box>
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

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button variant="outlined" onClick={onBack} size="large">
          ← Voltar
        </Button>
        <Button variant="contained" onClick={onContinue} size="large">
          Continuar →
        </Button>
      </Box>
    </Box>
  );
}
