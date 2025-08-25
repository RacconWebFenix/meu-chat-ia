/**
 * Componente para exibir os resultados da busca de equivalência.
 * Adicionada funcionalidade de seleção com checkboxes.
 */

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  Alert,
  Paper,
  Stack,
  LinearProgress,
  Divider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  GetApp as ExportIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";
import { EquivalenceSearchResponse, EquivalenceMatch } from "../types";
import { ExportDialog } from "./ExportDialog";

interface EquivalenceResultsProps {
  readonly searchResult: EquivalenceSearchResponse;
  readonly onBack: () => void;
  readonly isLoading?: boolean;
}

export default function EquivalenceResults({
  searchResult,
  onBack,
  isLoading = false,
}: EquivalenceResultsProps) {
  const { matches, totalFound, searchDuration, suggestions } = searchResult;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Memoiza a lista de itens selecionados para passar ao diálogo de exportação
  const selectedMatches = useMemo(
    () => matches.filter((match) => selectedIds.includes(match.id)),
    [matches, selectedIds]
  );

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(matches.map((match) => match.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getScoreColor = (score: number): "success" | "warning" | "default" => {
    if (score >= 0.8) return "success";
    if (score >= 0.6) return "warning";
    return "default";
  };

  if (isLoading) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          Buscando equivalências...
        </Typography>
        <LinearProgress />
      </Paper>
    );
  }

  return (
    <Stack gap={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box>
          <Typography variant="h5">Resultados da Busca</Typography>
          <Typography variant="body2" color="text.secondary">
            {totalFound} equivalências encontradas em {searchDuration}ms.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ExportIcon />}
          onClick={() => setShowExportDialog(true)}
          disabled={selectedIds.length === 0}
        >
          Exportar ({selectedIds.length})
        </Button>
      </Stack>

      {suggestions && suggestions.length > 0 && (
        <Alert severity="info">{suggestions.join(", ")}</Alert>
      )}

      {/* Cabeçalho da Lista com "Selecionar Todos" */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={
                matches.length > 0 && selectedIds.length === matches.length
              }
              indeterminate={
                selectedIds.length > 0 && selectedIds.length < matches.length
              }
              onChange={handleToggleAll}
            />
          }
          label={`Selecionar Todos (${selectedIds.length} / ${matches.length} selecionados)`}
        />
      </Paper>

      {/* Lista de Resultados com Checkbox individual */}
      <Stack gap={2}>
        {matches.map((match) => (
          <Paper
            key={match.id}
            variant="outlined"
            onClick={() => handleToggleOne(match.id)}
            sx={{
              p: 2,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Checkbox
              checked={selectedIds.includes(match.id)}
              onChange={(e) => {
                e.stopPropagation(); // Impede que o clique no checkbox acione o clique no Paper
                handleToggleOne(match.id);
              }}
            />
            <Stack flexGrow={1}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems="flex-start"
                gap={1}
              >
                <Box>
                  <Typography variant="h6">{match.nome}</Typography>
                  <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 1 }}>
                    <Chip
                      label={match.referencia}
                      size="small"
                      variant="outlined"
                    />
                    {match.marcaFabricante && (
                      <Chip
                        label={match.marcaFabricante}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </Box>
                <Chip
                  label={`Score: ${Math.round(match.matchScore * 100)}%`}
                  color={getScoreColor(match.matchScore)}
                  sx={{ fontWeight: "bold" }}
                />
              </Stack>

              {match.pdmPadronizado && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>PDM:</strong>
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{
                        fontFamily: "monospace",
                        ml: 1,
                        color: "text.primary",
                      }}
                    >
                      {match.pdmPadronizado}
                    </Typography>
                  </Typography>
                </>
              )}
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onBack}
          startIcon={<BackIcon />}
        >
          Voltar
        </Button>
      </Stack>

      <ExportDialog
        open={showExportDialog}
        matches={selectedMatches} // Passando apenas os itens selecionados
        onClose={() => setShowExportDialog(false)}
      />
    </Stack>
  );
}
