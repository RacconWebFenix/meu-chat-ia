/**
 * Interface para filtros avançados e visualização de resultados.
 * Refatorado para corrigir erros de tipo e remover 'any'.
 */
import React from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Button,
  ButtonGroup,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { EquivalenceMatch, SortCriteria } from "../types";
import { useAdvancedEquivalence } from "../hooks";

// CORREÇÃO: Props do sub-componente fortemente tipadas (sem 'any')
interface EquivalenceListProps {
  items: readonly EquivalenceMatch[];
  selectedItems: readonly string[];
  onToggleItem: (id: string) => void;
}

function EquivalenceList({
  items,
  selectedItems,
  onToggleItem,
}: EquivalenceListProps) {
  return (
    <List sx={{ bgcolor: "background.default", borderRadius: 1 }}>
      {items.map((match) => (
        <ListItem
          key={match.id}
          divider
          secondaryAction={
            <Checkbox
              edge="end"
              checked={selectedItems.includes(match.id)}
              onChange={() => onToggleItem(match.id)}
            />
          }
          sx={{ py: 2 }}
        >
          <ListItemText
            primaryTypographyProps={{ component: "div" }}
            secondaryTypographyProps={{ component: "div" }}
            primary={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="subtitle1"
                  component="span"
                  sx={{ fontWeight: "bold" }}
                >
                  {match.nome}
                </Typography>
                <Chip
                  label={`${Math.round(match.matchScore * 100)}%`}
                  size="small"
                  color={
                    match.matchScore >= 0.8
                      ? "success"
                      : match.matchScore >= 0.6
                      ? "warning"
                      : "default"
                  }
                />
              </Box>
            }
            secondary={
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {match.marcaFabricante &&
                    `Fabricante: ${match.marcaFabricante}`}
                  {match.categoria && ` | Categoria: ${match.categoria}`}
                </Typography>
                {match.pdmPadronizado && (
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "monospace", mt: 0.5 }}
                  >
                    PDM: {match.pdmPadronizado}
                  </Typography>
                )}
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}

interface AdvancedEquivalenceInterfaceProps {
  readonly matches: readonly EquivalenceMatch[];
}

export function AdvancedEquivalenceInterface({
  matches,
}: AdvancedEquivalenceInterfaceProps) {
  const {
    state,
    filteredMatches,
    updateFilters,
    setSortBy,
    toggleItemSelection,
    selectAll,
    clearSelection,
    getSelectedMatches,
  } = useAdvancedEquivalence(matches);

  return (
    <Paper variant="outlined" sx={{ p: 2, mt: -2 }}>
      <Accordion
        defaultExpanded
        sx={{ boxShadow: "none", "&:before": { display: "none" } }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <FilterIcon sx={{ mr: 1, color: "text.secondary" }} />
          <Typography>Filtros e Seleção</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <TextField
              label="Filtrar por nome..."
              size="small"
              fullWidth
              onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            />
            <FormControl size="small" fullWidth>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={state.sortBy}
                label="Ordenar por"
                onChange={(e) => setSortBy(e.target.value as SortCriteria)}
              >
                <MenuItem value={SortCriteria.SCORE_DESC}>Maior Score</MenuItem>
                <MenuItem value={SortCriteria.NAME_ASC}>Nome (A-Z)</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Typography gutterBottom>Score de Similaridade (%)</Typography>
              <Slider
                value={[
                  state.filters.scoreRange.min,
                  state.filters.scoreRange.max,
                ]}
                onChange={(_, value) => {
                  const [min, max] = value as number[];
                  updateFilters({ scoreRange: { min, max } });
                }}
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Divider sx={{ my: 2 }} />
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={
                state.selectedItems.length === filteredMatches.length &&
                filteredMatches.length > 0
              }
              indeterminate={
                state.selectedItems.length > 0 &&
                state.selectedItems.length < filteredMatches.length
              }
              onChange={selectAll}
            />
          }
          label={`${state.selectedItems.length} de ${filteredMatches.length} selecionado(s)`}
        />
        <ButtonGroup variant="outlined" size="small">
          <Button disabled={state.selectedItems.length === 0}>Exportar</Button>
          <Button
            onClick={clearSelection}
            disabled={state.selectedItems.length === 0}
          >
            Limpar
          </Button>
        </ButtonGroup>
      </Box>
      <EquivalenceList
        items={filteredMatches}
        selectedItems={state.selectedItems}
        onToggleItem={toggleItemSelection}
      />
    </Paper>
  );
}
