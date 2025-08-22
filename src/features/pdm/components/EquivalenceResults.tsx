/**
 * EquivalenceResults component to display equivalence search results
 * Following Single Responsibility Principle
 */

import React from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Alert,
  Card,
  CardContent,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { EquivalenceSearchResponse } from "../types";

interface EquivalenceResultsProps {
  readonly searchResult: EquivalenceSearchResponse;
  readonly onBack: () => void;
  readonly onExport: () => void;
  readonly isLoading?: boolean;
}

export default function EquivalenceResults({
  searchResult,
  onBack,
  onExport,
  isLoading = false,
}: EquivalenceResultsProps) {
  const { matches, totalFound, searchDuration, suggestions } = searchResult;

  // Calculate score color
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "success";
    if (score >= 0.6) return "warning";
    return "error";
  };

  // Format score percentage
  const formatScore = (score: number) => Math.round(score * 100);

  if (isLoading) {
    return (
      <Box sx={{ width: "100%" }}>
        <Typography variant="h6" gutterBottom>
          🔍 Buscando equivalências...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          🔍 Resultados da Busca de Equivalências
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Chip
            label={`${matches.length} de ${totalFound} resultados`}
            color="primary"
            variant="outlined"
          />
          <Chip label={`${searchDuration}ms`} size="small" />
        </Box>
      </Box>

      {/* No results message */}
      {matches.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Nenhuma equivalência encontrada
          </Typography>
          <Typography variant="body2">
            Tente ajustar os critérios de busca ou utilizar busca mais flexível.
          </Typography>
        </Alert>
      )}

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            💡 Sugestões:
          </Typography>
          {suggestions.map((suggestion, index) => (
            <Typography key={index} variant="body2">
              • {suggestion}
            </Typography>
          ))}
        </Alert>
      )}

      {/* Results */}
      {matches.length > 0 && (
        <Box sx={{ mb: 3 }}>
          {matches.map((match, index) => (
            <Card key={match.id} sx={{ mb: 2 }}>
              <CardContent>
                {/* Match Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    mb: 2,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {match.nome}
                    </Typography>
                    <Box
                      sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}
                    >
                      <Chip
                        label={match.referencia}
                        size="small"
                        color="primary"
                      />
                      <Chip label={match.marcaFabricante} size="small" />
                      <Chip
                        label={match.categoria}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Chip
                      label={`${formatScore(match.matchScore)}% match`}
                      color={getScoreColor(match.matchScore)}
                      size="small"
                    />
                  </Box>
                </Box>

                {/* Matched Fields */}
                {match.matchedFields.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Campos compatíveis:
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {match.matchedFields.map((field, fieldIndex) => (
                        <Chip
                          key={fieldIndex}
                          label={field}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Technical Specifications */}
                {match.especificacoesTecnicas && (
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="body2">
                        🔧 Ver Especificações Técnicas
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
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
                        {Object.entries(match.especificacoesTecnicas).map(
                          ([key, value]) => (
                            <Box key={key}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {key}:
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {value}
                              </Typography>
                            </Box>
                          )
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* PDM */}
                {match.pdmPadronizado && (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      📋 PDM Padronizado:
                    </Typography>
                    <Paper
                      sx={{
                        p: 1,
                        bgcolor: "grey.50",
                        fontFamily: "monospace",
                        fontSize: "0.85rem",
                      }}
                    >
                      {match.pdmPadronizado}
                    </Paper>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Search Summary */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
        <Typography variant="subtitle2" gutterBottom>
          📊 Resumo da Busca:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Critérios:{" "}
          {
            Object.values(searchResult.searchCriteria.selectedFields).filter(
              Boolean
            ).length
          }{" "}
          campos selecionados
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Modo: {searchResult.searchCriteria.searchMode}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Resultados: {matches.length} exibidos de {totalFound} encontrados
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Tempo: {searchDuration}ms
        </Typography>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button variant="outlined" onClick={onBack} size="large">
          ← Nova Busca
        </Button>
        <Button
          variant="contained"
          onClick={onExport}
          disabled={matches.length === 0}
          size="large"
        >
          Exportar Resultados →
        </Button>
      </Box>
    </Box>
  );
}
