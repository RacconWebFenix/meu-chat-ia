/**
 * Export Dialog component following Single Responsibility Principle
 * Responsibility: Provide export configuration and execution interface
 */

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Box,
  Typography,
  Divider,
  Alert,
  LinearProgress
} from "@mui/material";
import {
  GetApp as ExportIcon,
  Description as PDFIcon,
  TableChart as ExcelIcon,
  Code as CSVIcon
} from "@mui/icons-material";
import { EquivalenceMatch } from "../types";
import { useExport } from "../hooks";

interface ExportDialogProps {
  readonly open: boolean;
  readonly matches: readonly EquivalenceMatch[];
  readonly onClose: () => void;
}

type ExportFormat = 'csv' | 'excel' | 'pdf';

export function ExportDialog({
  open,
  matches,
  onClose
}: ExportDialogProps): React.JSX.Element {
  const [format, setFormat] = useState<ExportFormat>('excel');
  const [includeSpecs, setIncludeSpecs] = useState(true);
  const [includePDM, setIncludePDM] = useState(true);
  
  const { isExporting, exportToCSV, exportToExcel, exportToPDF } = useExport();

  const handleExport = async () => {
    const options = {
      includeSpecs,
      includePDM
    };

    try {
      switch (format) {
        case 'csv':
          await exportToCSV(matches, options);
          break;
        case 'excel':
          await exportToExcel(matches, options);
          break;
        case 'pdf':
          await exportToPDF(matches, options);
          break;
      }
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const getFormatIcon = (formatType: ExportFormat) => {
    switch (formatType) {
      case 'csv':
        return <CSVIcon />;
      case 'excel':
        return <ExcelIcon />;
      case 'pdf':
        return <PDFIcon />;
    }
  };

  const getFormatDescription = (formatType: ExportFormat) => {
    switch (formatType) {
      case 'csv':
        return 'Arquivo de valores separados por vírgula (.csv)';
      case 'excel':
        return 'Planilha do Excel (.xlsx)';
      case 'pdf':
        return 'Documento PDF (.pdf)';
    }
  };

  const getFileSize = () => {
    const baseSize = matches.length * 0.5; // Base estimate in KB
    const specsSize = includeSpecs ? matches.length * 0.3 : 0;
    const pdmSize = includePDM ? matches.length * 0.2 : 0;
    return Math.round(baseSize + specsSize + pdmSize);
  };

  return (
    <Dialog 
      open={open} 
      onClose={!isExporting ? onClose : undefined}
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ExportIcon />
        Exportar Equivalências
      </DialogTitle>
      
      <DialogContent>
        {isExporting && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Exportando {matches.length} equivalências...
            </Typography>
            <LinearProgress />
          </Box>
        )}

        <Alert severity="info" sx={{ mb: 3 }}>
          {matches.length} equivalência(s) selecionada(s) para exportação
        </Alert>

        {/* Format Selection */}
        <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
          <FormLabel component="legend">Formato de Exportação</FormLabel>
          <RadioGroup
            value={format}
            onChange={(e) => setFormat(e.target.value as ExportFormat)}
          >
            {(['excel', 'csv', 'pdf'] as const).map((formatOption) => (
              <FormControlLabel
                key={formatOption}
                value={formatOption}
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getFormatIcon(formatOption)}
                    <Box>
                      <Typography variant="body1" sx={{ textTransform: 'uppercase' }}>
                        {formatOption}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getFormatDescription(formatOption)}
                      </Typography>
                    </Box>
                  </Box>
                }
                disabled={isExporting}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <Divider sx={{ my: 2 }} />

        {/* Content Options */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Conteúdo a Incluir
          </Typography>
          
          <FormControlLabel
            control={
              <Checkbox
                checked={includeSpecs}
                onChange={(e) => setIncludeSpecs(e.target.checked)}
                disabled={isExporting}
              />
            }
            label="Especificações Técnicas"
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={includePDM}
                onChange={(e) => setIncludePDM(e.target.checked)}
                disabled={isExporting}
              />
            }
            label="PDM Padronizado"
          />
        </Box>

        {/* File Info */}
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Estimativa do arquivo:</strong> ~{getFileSize()} KB
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Incluirá:</strong> Nome, Fabricante, Categoria, Score
            {includePDM && ', PDM Padronizado'}
            {includeSpecs && ', Especificações Técnicas'}
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={onClose} 
          disabled={isExporting}
        >
          Cancelar
        </Button>
        
        <Button
          onClick={handleExport}
          variant="contained"
          disabled={isExporting || matches.length === 0}
          startIcon={<ExportIcon />}
        >
          {isExporting ? 'Exportando...' : 'Exportar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
