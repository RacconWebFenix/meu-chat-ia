/**
 * Componente para exibir resultados de equivalências do N8N
 * Usa Material-UI com o theme corporativo definido
 */

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Alert,
  Stack,
  LinearProgress,
  Checkbox,
  FormControlLabel,
  Grid,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ShoppingCart as ShoppingCartIcon,
  Compare as CompareIcon,
  Image as ImageIcon,
  Launch as LaunchIcon,
} from "@mui/icons-material";
import {
  N8NEquivalenceResponse,
  N8NEquivalence,
  N8NEquivalenceState,
} from "../types/n8n.types";

interface N8NEquivalenceResultsProps {
  readonly searchResult: N8NEquivalenceResponse;
  readonly onBack: () => void;
  readonly isLoading?: boolean;
  readonly originalProduct?: {
    readonly nome: string;
    readonly especificacoesTecnicas: Record<string, unknown>;
    readonly precoEstimado?: {
      readonly valor: number;
      readonly moeda: string;
    };
  };
}

export default function N8NEquivalenceResults({
  searchResult,
  onBack,
  isLoading = false,
  originalProduct,
}: N8NEquivalenceResultsProps) {
  const { equivalencias, metadata } = searchResult;

  console.log("N8NEquivalenceResults - isLoading:", isLoading);
  console.log("N8NEquivalenceResults - equivalencias:", equivalencias?.length || 0);

  const [state, setState] = useState<N8NEquivalenceState>({
    selectedIds: [],
    comparisonMode: false,
    viewMode: "cards",
    sortBy: "similarity",
    sortOrder: "desc",
  });

  const [comparisonOpen, setComparisonOpen] = useState(false);

  // Filtra e ordena equivalências
  const sortedEquivalencias = useMemo(() => {
    let sorted = [...equivalencias];

    sorted.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (state.sortBy) {
        case "similarity":
          aValue = a.grauSimilaridade;
          bValue = b.grauSimilaridade;
          break;
        case "price":
          aValue = a.precoEstimado?.valor || 0;
          bValue = b.precoEstimado?.valor || 0;
          break;
        case "name":
          aValue = a.nome.toLowerCase();
          bValue = b.nome.toLowerCase();
          break;
        default:
          return 0;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return state.sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return state.sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    return sorted;
  }, [equivalencias, state.sortBy, state.sortOrder]);

  const selectedEquivalencias = useMemo(
    () => sortedEquivalencias.filter((eq) => state.selectedIds.includes(eq.id)),
    [sortedEquivalencias, state.selectedIds]
  );

  const handleToggleSelection = (id: string) => {
    setState((prev) => ({
      ...prev,
      selectedIds: prev.selectedIds.includes(id)
        ? prev.selectedIds.filter((selectedId) => selectedId !== id)
        : [...prev.selectedIds, id],
    }));
  };

  const handleToggleAll = () => {
    setState((prev) => ({
      ...prev,
      selectedIds:
        prev.selectedIds.length === sortedEquivalencias.length
          ? []
          : sortedEquivalencias.map((eq) => eq.id),
    }));
  };

  const handleCompare = () => {
    if (selectedEquivalencias.length > 0) {
      setComparisonOpen(true);
    }
  };

  if (isLoading) {
    console.log("N8NEquivalenceResults - RENDERIZANDO LOADING");
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Buscando equivalências...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (equivalencias.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          Nenhuma equivalência encontrada para o produto especificado.
        </Alert>
        <Button
          startIcon={<span>←</span>}
          onClick={onBack}
          sx={{ mt: 2 }}
          variant="outlined"
        >
          Voltar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Equivalências Encontradas ({equivalencias.length})
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {metadata.observacoesGerais}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Processado em {metadata.tempoProcessamento}s • Fonte:{" "}
          {metadata.fonteDados}
        </Typography>
      </Box>

      {/* Controles */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={state.selectedIds.length === sortedEquivalencias.length}
              indeterminate={
                state.selectedIds.length > 0 &&
                state.selectedIds.length < sortedEquivalencias.length
              }
              onChange={handleToggleAll}
            />
          }
          label={`Selecionar todos (${state.selectedIds.length}/${sortedEquivalencias.length})`}
        />

        {selectedEquivalencias.length > 0 && (
          <Button
            variant="contained"
            startIcon={<CompareIcon />}
            onClick={handleCompare}
          >
            Comparar ({selectedEquivalencias.length})
          </Button>
        )}
      </Stack>

      {/* Lista de Equivalências */}
      <Grid container spacing={3}>
        {sortedEquivalencias.map((equivalencia) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={equivalencia.id}>
            <EquivalenceCard
              equivalencia={equivalencia}
              isSelected={state.selectedIds.includes(equivalencia.id)}
              onToggleSelection={() => handleToggleSelection(equivalencia.id)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Modal de Comparação */}
      <ComparisonModal
        open={comparisonOpen}
        onClose={() => setComparisonOpen(false)}
        selectedEquivalencias={selectedEquivalencias}
        originalProduct={originalProduct}
      />

      {/* Botão Voltar */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          startIcon={<span>←</span>}
          onClick={onBack}
          variant="outlined"
          size="large"
        >
          Voltar para Revisão
        </Button>
      </Box>
    </Box>
  );
}

// Componente para card individual de equivalência
interface EquivalenceCardProps {
  readonly equivalencia: N8NEquivalence;
  readonly isSelected: boolean;
  readonly onToggleSelection: () => void;
}

function EquivalenceCard({
  equivalencia,
  isSelected,
  onToggleSelection,
}: EquivalenceCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: isSelected ? "2px solid #00529B" : "1px solid #E9ECEF",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 3,
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ p: 2, pb: 0 }}>
        <Stack direction="row" alignItems="flex-start" spacing={1}>
          <Checkbox
            checked={isSelected}
            onChange={onToggleSelection}
            size="small"
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {equivalencia.nome}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {equivalencia.marcaFabricante}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {equivalencia.images.length > 0 && (
        <CardMedia
          component="img"
          height="140"
          image={equivalencia.images[0].image_url}
          alt={equivalencia.nome}
          sx={{ objectFit: "contain", bgcolor: "#F8F9FA" }}
        />
      )}

      <CardContent sx={{ flex: 1, pt: 1 }}>
        <Stack spacing={1}>
          <Box>
            <Chip
              label={`${equivalencia.grauSimilaridade}% similar`}
              color={
                equivalencia.grauSimilaridade >= 90
                  ? "success"
                  : equivalencia.grauSimilaridade >= 80
                  ? "warning"
                  : "error"
              }
              size="small"
              variant="outlined"
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            {equivalencia.aplicacao}
          </Typography>

          <Accordion
            expanded={expanded}
            onChange={() => setExpanded(!expanded)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body2">Detalhes Técnicos</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Especificações:
                  </Typography>
                  {Object.entries(equivalencia.especificacoesTecnicas).map(
                    ([key, value]) => (
                      <Typography key={key} variant="caption" display="block">
                        {key}: {String(value)}
                      </Typography>
                    )
                  )}
                </Box>

                {equivalencia.camposEspecificos &&
                  Object.keys(equivalencia.camposEspecificos).length > 0 && (
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        Características Específicas:
                      </Typography>
                      {Object.entries(equivalencia.camposEspecificos).map(
                        ([key, value]) => (
                          <Typography
                            key={key}
                            variant="caption"
                            display="block"
                          >
                            {key}: {String(value)}
                          </Typography>
                        )
                      )}
                    </Box>
                  )}

                <Divider />

                <Typography variant="body2">
                  <strong>Justificativa:</strong> {equivalencia.justificativa}
                </Typography>

                {equivalencia.searchResults.length > 0 && (
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      Referências encontradas:
                    </Typography>
                    {equivalencia.searchResults
                      .slice(0, 2)
                      .map((result, index) => (
                        <Link
                          key={index}
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="caption"
                          display="block"
                          sx={{ mb: 0.5 }}
                        >
                          {result.title} <LaunchIcon sx={{ fontSize: 12 }} />
                        </Link>
                      ))}
                  </Box>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </CardContent>
    </Card>
  );
}

// Modal de Comparação
interface ComparisonModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly selectedEquivalencias: readonly N8NEquivalence[];
  readonly originalProduct?: {
    readonly nome: string;
    readonly especificacoesTecnicas: Record<string, unknown>;
    readonly precoEstimado?: {
      readonly valor: number;
      readonly moeda: string;
    };
  };
}

function ComparisonModal({
  open,
  onClose,
  selectedEquivalencias,
  originalProduct,
}: ComparisonModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>
        Comparação de Equivalências
        {originalProduct && (
          <Typography variant="body2" color="text.secondary">
            Comparando com: {originalProduct.nome}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Produto</TableCell>
                <TableCell>Marca</TableCell>
                <TableCell>Similaridade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {originalProduct && (
                <TableRow sx={{ bgcolor: "#F8F9FA" }}>
                  <TableCell>
                    <strong>{originalProduct.nome}</strong>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>100%</TableCell>
                </TableRow>
              )}
              {selectedEquivalencias.map((eq) => (
                <TableRow key={eq.id}>
                  <TableCell>{eq.nome}</TableCell>
                  <TableCell>{eq.marcaFabricante}</TableCell>
                  <TableCell>{eq.grauSimilaridade}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}
