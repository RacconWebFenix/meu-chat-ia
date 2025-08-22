/**
 * Advanced Equivalence Interface component following Single Responsibility Principle
 * Responsibility: Provide advanced filtering, sorting, and comparison interface for equivalence matches
 */

import React from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Slider,
  Button,
  ButtonGroup,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  TableChart as TableChartIcon,
  Compare as CompareIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Star as StarIcon,
  Info as InfoIcon
} from "@mui/icons-material";
import { EquivalenceMatch, SortCriteria } from "../types";
import { useAdvancedEquivalence } from "../hooks";

interface AdvancedEquivalenceInterfaceProps {
  readonly matches: readonly EquivalenceMatch[];
  readonly onExportSelected: (matches: readonly EquivalenceMatch[]) => void;
  readonly onCompareSelected: (matches: readonly EquivalenceMatch[]) => void;
}

export function AdvancedEquivalenceInterface({
  matches,
  onExportSelected,
  onCompareSelected
}: AdvancedEquivalenceInterfaceProps): React.JSX.Element {
  const {
    state,
    filteredMatches,
    comparisonItems,
    updateFilters,
    setSortBy,
    toggleItemSelection,
    selectAll,
    clearSelection,
    toggleComparisonMode,
    setViewMode,
    getSelectedMatches
  } = useAdvancedEquivalence(matches);

  // Get unique manufacturers and categories for filter options
  const uniqueManufacturers = React.useMemo(() => {
    const manufacturers = new Set<string>();
    matches.forEach(match => {
      if (match.marcaFabricante) {
        manufacturers.add(match.marcaFabricante);
      }
    });
    return Array.from(manufacturers).sort();
  }, [matches]);

  const uniqueCategories = React.useMemo(() => {
    const categories = new Set<string>();
    matches.forEach(match => {
      if (match.categoria) {
        categories.add(match.categoria);
      }
    });
    return Array.from(categories).sort();
  }, [matches]);

  const handleScoreRangeChange = (event: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    updateFilters({
      scoreRange: { min, max }
    });
  };

  const handleManufacturerToggle = (manufacturer: string) => {
    const currentManufacturers = state.filters.manufacturers;
    const newManufacturers = currentManufacturers.includes(manufacturer)
      ? currentManufacturers.filter(m => m !== manufacturer)
      : [...currentManufacturers, manufacturer];
    
    updateFilters({ manufacturers: newManufacturers });
  };

  const handleCategoryToggle = (category: string) => {
    const currentCategories = state.filters.categories;
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    
    updateFilters({ categories: newCategories });
  };

  const handleExportSelected = () => {
    const selectedMatches = getSelectedMatches();
    if (selectedMatches.length > 0) {
      onExportSelected(selectedMatches);
    }
  };

  const handleCompareSelected = () => {
    const selectedMatches = getSelectedMatches();
    if (selectedMatches.length > 0) {
      onCompareSelected(selectedMatches);
    }
  };

  const selectedCount = state.selectedItems.length;
  const filteredCount = filteredMatches.length;
  const totalCount = matches.length;

  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardHeader
          title="Equivalências Encontradas - Interface Avançada"
          subheader={`${filteredCount} de ${totalCount} equivalências | ${selectedCount} selecionadas`}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <ButtonGroup size="small">
                <Button
                  onClick={() => setViewMode('list')}
                  variant={state.viewMode === 'list' ? 'contained' : 'outlined'}
                >
                  <ViewListIcon />
                </Button>
                <Button
                  onClick={() => setViewMode('grid')}
                  variant={state.viewMode === 'grid' ? 'contained' : 'outlined'}
                >
                  <ViewModuleIcon />
                </Button>
                <Button
                  onClick={() => setViewMode('table')}
                  variant={state.viewMode === 'table' ? 'contained' : 'outlined'}
                >
                  <TableChartIcon />
                </Button>
              </ButtonGroup>
              
              <Button
                onClick={toggleComparisonMode}
                variant={state.comparisonMode ? 'contained' : 'outlined'}
                startIcon={<CompareIcon />}
              >
                Comparação
              </Button>
            </Box>
          }
        />
        
        <CardContent>
          {/* Filters Section */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterIcon />
                Filtros Avançados
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Score Range Filter */}
                <Box>
                  <Typography gutterBottom>
                    Faixa de Score: {state.filters.scoreRange.min}% - {state.filters.scoreRange.max}%
                  </Typography>
                  <Slider
                    value={[state.filters.scoreRange.min, state.filters.scoreRange.max]}
                    onChange={handleScoreRangeChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={100}
                    marks={[
                      { value: 0, label: '0%' },
                      { value: 50, label: '50%' },
                      { value: 100, label: '100%' }
                    ]}
                  />
                </Box>

                {/* Sort Control */}
                <FormControl fullWidth>
                  <InputLabel>Ordenar por</InputLabel>
                  <Select
                    value={state.sortBy}
                    label="Ordenar por"
                    onChange={(e) => setSortBy(e.target.value as SortCriteria)}
                  >
                    <MenuItem value={SortCriteria.SCORE_DESC}>Score (Maior → Menor)</MenuItem>
                    <MenuItem value={SortCriteria.SCORE_ASC}>Score (Menor → Maior)</MenuItem>
                    <MenuItem value={SortCriteria.NAME_ASC}>Nome (A → Z)</MenuItem>
                    <MenuItem value={SortCriteria.NAME_DESC}>Nome (Z → A)</MenuItem>
                    <MenuItem value={SortCriteria.MANUFACTURER_ASC}>Fabricante (A → Z)</MenuItem>
                    <MenuItem value={SortCriteria.MANUFACTURER_DESC}>Fabricante (Z → A)</MenuItem>
                    <MenuItem value={SortCriteria.CATEGORY_ASC}>Categoria (A → Z)</MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  {/* Quality Filters */}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={state.filters.hasSpecifications}
                        onChange={(e) => updateFilters({ hasSpecifications: e.target.checked })}
                      />
                    }
                    label="Com Especificações"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={state.filters.hasPDM}
                        onChange={(e) => updateFilters({ hasPDM: e.target.checked })}
                      />
                    }
                    label="Com PDM Padronizado"
                  />
                </Box>

                {/* Manufacturer Filter */}
                {uniqueManufacturers.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Fabricantes ({state.filters.manufacturers.length} selecionados)
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxHeight: 120, overflow: 'auto' }}>
                      {uniqueManufacturers.map((manufacturer) => (
                        <Chip
                          key={manufacturer}
                          label={manufacturer}
                          onClick={() => handleManufacturerToggle(manufacturer)}
                          variant={state.filters.manufacturers.includes(manufacturer) ? 'filled' : 'outlined'}
                          color={state.filters.manufacturers.includes(manufacturer) ? 'primary' : 'default'}
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Category Filter */}
                {uniqueCategories.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Categorias ({state.filters.categories.length} selecionadas)
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxHeight: 120, overflow: 'auto' }}>
                      {uniqueCategories.map((category) => (
                        <Chip
                          key={category}
                          label={category}
                          onClick={() => handleCategoryToggle(category)}
                          variant={state.filters.categories.includes(category) ? 'filled' : 'outlined'}
                          color={state.filters.categories.includes(category) ? 'primary' : 'default'}
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>

          <Divider sx={{ my: 2 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              onClick={selectAll}
              disabled={filteredMatches.length === 0}
            >
              Selecionar Todos
            </Button>
            
            <Button
              onClick={clearSelection}
              disabled={selectedCount === 0}
            >
              Limpar Seleção
            </Button>
            
            <Button
              onClick={handleCompareSelected}
              disabled={selectedCount < 2}
              startIcon={<CompareIcon />}
            >
              Comparar Selecionados ({selectedCount})
            </Button>
            
            <Button
              onClick={handleExportSelected}
              disabled={selectedCount === 0}
              variant="contained"
            >
              Exportar Selecionados ({selectedCount})
            </Button>
          </Box>

          {/* Results Display */}
          {state.viewMode === 'list' && (
            <EquivalenceList
              items={comparisonItems}
              comparisonMode={state.comparisonMode}
              onToggleSelection={toggleItemSelection}
            />
          )}

          {/* Summary */}
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Exibindo {filteredCount} de {totalCount} equivalências encontradas.
              {selectedCount > 0 && ` ${selectedCount} itens selecionados.`}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

// Sub-component for list view
interface EquivalenceListProps {
  readonly items: readonly { match: EquivalenceMatch; selected: boolean }[];
  readonly comparisonMode: boolean;
  readonly onToggleSelection: (id: string) => void;
}

function EquivalenceList({
  items,
  comparisonMode,
  onToggleSelection
}: EquivalenceListProps): React.JSX.Element {
  return (
    <List>
      {items.map(({ match, selected }) => (
        <ListItem key={match.id} divider>
          {comparisonMode && (
            <ListItemIcon>
              <Checkbox
                checked={selected}
                onChange={() => onToggleSelection(match.id)}
                icon={<CheckBoxOutlineBlankIcon />}
                checkedIcon={<CheckBoxIcon />}
              />
            </ListItemIcon>
          )}
          
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1">{match.nome}</Typography>
                <Chip 
                  label={`${Math.round(match.matchScore * 100)}%`}
                  size="small"
                  color={match.matchScore >= 0.8 ? 'success' : match.matchScore >= 0.6 ? 'warning' : 'default'}
                />
              </Box>
            }
            secondary={
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {match.marcaFabricante && `Fabricante: ${match.marcaFabricante}`}
                  {match.categoria && ` | Categoria: ${match.categoria}`}
                </Typography>
                {match.pdmPadronizado && (
                  <Typography variant="body2" color="primary">
                    PDM: {match.pdmPadronizado}
                  </Typography>
                )}
              </Box>
            }
          />
          
          <ListItemSecondaryAction>
            <IconButton size="small">
              <InfoIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
      
      {items.length === 0 && (
        <ListItem>
          <ListItemText
            primary="Nenhuma equivalência encontrada"
            secondary="Tente ajustar os filtros para ver mais resultados"
          />
        </ListItem>
      )}
    </List>
  );
}
