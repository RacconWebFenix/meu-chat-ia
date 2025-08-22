import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  Alert,
  Card,
  CardContent,
  LinearProgress,
  ButtonGroup,
} from "@mui/material";
import {
  Tune as TuneIcon,
  ViewList as ViewListIcon,
  GetApp as ExportIcon,
} from "@mui/icons-material";
import { EquivalenceSearchResponse, EquivalenceMatch } from "../types";
import { AdvancedEquivalenceInterface } from "./AdvancedEquivalenceInterface";
import { ExportDialog } from "./ExportDialog";

interface EquivalenceResultsProps {
  readonly searchResult: EquivalenceSearchResponse;
  readonly onBack: () => void;
  readonly onExport: () => void;
  readonly isLoading?: boolean;
}

function EquivalenceResults({
  searchResult,
  onBack,
  onExport,
  isLoading = false,
}: EquivalenceResultsProps) {
  const { matches, totalFound, searchDuration, suggestions } = searchResult;
  const [showAdvancedInterface, setShowAdvancedInterface] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [selectedMatches, setSelectedMatches] = useState(matches);

  const handleExportSelected = (
    matchesToExport: readonly EquivalenceMatch[]
  ) => {
    setSelectedMatches(matchesToExport);
    setShowExportDialog(true);
  };

  const handleCompareSelected = (
    matchesToCompare: readonly EquivalenceMatch[]
  ) => {
    console.log("Compare matches:", matchesToCompare);
  };

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
            justifyContent: "space-between",
          }}
        >
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

          <Box sx={{ display: "flex", gap: 1 }}>
            <ButtonGroup size="small">
              <Button
                variant={!showAdvancedInterface ? "contained" : "outlined"}
                onClick={() => setShowAdvancedInterface(false)}
                startIcon={<ViewListIcon />}
              >
                Simples
              </Button>
              <Button
                variant={showAdvancedInterface ? "contained" : "outlined"}
                onClick={() => setShowAdvancedInterface(true)}
                startIcon={<TuneIcon />}
              >
                Avançado
              </Button>
            </ButtonGroup>

            <Button
              variant="outlined"
              onClick={() => setShowExportDialog(true)}
              startIcon={<ExportIcon />}
              disabled={matches.length === 0}
            >
              Exportar
            </Button>

            <Button variant="outlined" onClick={onBack}>
              Voltar
            </Button>
          </Box>
        </Box>
      </Box>

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

      {matches.length > 0 && (
        <>
          {showAdvancedInterface ? (
            <AdvancedEquivalenceInterface
              matches={matches}
              onExportSelected={handleExportSelected}
              onCompareSelected={handleCompareSelected}
            />
          ) : (
            <SimpleResultsDisplay matches={matches} />
          )}
        </>
      )}

      <ExportDialog
        open={showExportDialog}
        matches={selectedMatches}
        onClose={() => setShowExportDialog(false)}
      />

      {!showAdvancedInterface && matches.length > 0 && (
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 3 }}>
          <Button variant="outlined" onClick={onBack}>
            🔙 Nova Busca
          </Button>
          <Button variant="contained" onClick={onExport}>
            📊 Exportar Resultados
          </Button>
        </Box>
      )}
    </Box>
  );
}

function SimpleResultsDisplay({
  matches,
}: {
  readonly matches: readonly EquivalenceMatch[];
}) {
  const formatScore = (score: number) => Math.round(score * 100);
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "success";
    if (score >= 0.6) return "warning";
    return "error";
  };

  return (
    <Box sx={{ mb: 3 }}>
      {matches.map((match) => (
        <Card key={match.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h6" gutterBottom>
                  {match.nome}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip label={match.referencia} size="small" color="primary" />
                  {match.marcaFabricante && (
                    <Chip label={match.marcaFabricante} size="small" />
                  )}
                  <Chip
                    label={match.categoria}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
              <Chip
                label={`${formatScore(match.matchScore)}%`}
                color={getScoreColor(match.matchScore)}
                size="small"
              />
            </Box>

            {match.pdmPadronizado && (
              <Box sx={{ mt: 2, p: 1, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  📋 PDM:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                  {match.pdmPadronizado}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default EquivalenceResults;
