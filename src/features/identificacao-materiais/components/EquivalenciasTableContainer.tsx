/**
 * Equivalencias Table Container Component
 * Following Single Responsibility Principle and Open/Closed Principle
 */

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Typography,
  Box,
  Link,
  Checkbox,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import {
  EquivalenciasData,
  EquivalenciaItem,
  CaracteristicaItem,
  ImagemItem,
  CitacaoItem,
} from "../mocks/mockEquivalenciasData";

interface EquivalenciasTableContainerProps {
  equivalencias: EquivalenciasData[];
  isLoading?: boolean;
}

interface CaracteristicasSubRowProps {
  caracteristicas: CaracteristicaItem[];
}

interface ImagensSubRowProps {
  imagens: ImagemItem[];
}

interface CitacoesSubRowProps {
  citacoes: CitacaoItem[];
}

const CaracteristicasSubRow: React.FC<CaracteristicasSubRowProps> = ({
  caracteristicas,
}) => (
  <Box sx={{ p: 2, bgcolor: "grey.50" }}>
    <Typography variant="subtitle2" gutterBottom>
      Características Técnicas:
    </Typography>
    {caracteristicas.map((carac, index) => (
      <Box key={index} sx={{ mb: 1 }}>
        {Object.entries(carac).map(([key, value]) => (
          <Typography key={key} variant="body2">
            <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong> {value}
          </Typography>
        ))}
      </Box>
    ))}
  </Box>
);

const ImagensSubRow: React.FC<ImagensSubRowProps> = ({ imagens }) => (
  <Box sx={{ p: 2, bgcolor: "grey.100" }}>
    <Typography variant="subtitle2" gutterBottom>
      Imagens:
    </Typography>
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
      {imagens.map((img, index) => (
        <Box key={index}>
          <img
            src={img.image_url}
            alt={`Imagem ${index + 1}`}
            style={{ width: 100, height: 100, objectFit: "cover" }}
          />
          <Link href={img.origin_url} target="_blank" rel="noopener">
            Ver original
          </Link>
        </Box>
      ))}
    </Box>
  </Box>
);

const CitacoesSubRow: React.FC<CitacoesSubRowProps> = ({ citacoes }) => (
  <Box sx={{ p: 2, bgcolor: "grey.50" }}>
    <Typography variant="subtitle2" gutterBottom>
      Citações:
    </Typography>
    {citacoes.map((cit, index) => (
      <Box key={index} sx={{ mb: 2 }}>
        <Typography variant="body2" component="div">
          <strong>{cit.title}</strong>
        </Typography>
        <Link href={cit.url} target="_blank" rel="noopener">
          {cit.url}
        </Link>
        <Typography variant="caption" display="block">
          Data: {cit.date || "N/A"} | Última atualização:{" "}
          {cit.last_updated || "N/A"}
        </Typography>
        <Typography variant="body2">{cit.snippet}</Typography>
      </Box>
    ))}
  </Box>
);

export const EquivalenciasTableContainer: React.FC<
  EquivalenciasTableContainerProps
> = ({ equivalencias, isLoading = false }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleRowToggle = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleRowSelect = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = equivalencias.flatMap((data) =>
        data.equivalencias.map((equiv) => `${equiv.nome}-${equiv.fabricante}`)
      );
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  };

  if (isLoading) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography>Carregando equivalências...</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                checked={
                  selectedRows.size ===
                    equivalencias.flatMap((d) => d.equivalencias).length &&
                  equivalencias.flatMap((d) => d.equivalencias).length > 0
                }
                indeterminate={
                  selectedRows.size > 0 &&
                  selectedRows.size <
                    equivalencias.flatMap((d) => d.equivalencias).length
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
                aria-label="Selecionar todas as linhas"
              />
            </TableCell>
            <TableCell />
            <TableCell>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                Nome
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                Fabricante
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                NCM
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                Referência
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                Tipo de Unidade
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {equivalencias.flatMap((data) =>
            data.equivalencias.map((equiv) => {
              const rowId = `${equiv.nome}-${equiv.fabricante}`;
              const isExpanded = expandedRows.has(rowId);
              return (
                <React.Fragment key={rowId}>
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(rowId)}
                        onChange={(e) =>
                          handleRowSelect(rowId, e.target.checked)
                        }
                        aria-label={`Selecionar ${equiv.nome}`}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-expanded={isExpanded}
                        aria-label={`Expandir ${equiv.nome}`}
                        onClick={() => handleRowToggle(rowId)}
                        size="small"
                      >
                        {isExpanded ? (
                          <KeyboardArrowDown />
                        ) : (
                          <KeyboardArrowRight />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Typography>{equiv.nome}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{equiv.fabricante}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{equiv.NCM}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{equiv.referencia}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{equiv.tipo_de_unidade}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={7} sx={{ p: 0 }}>
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <CaracteristicasSubRow
                          caracteristicas={equiv.caracteristicas}
                        />
                        <ImagensSubRow imagens={equiv.imagens} />
                        <CitacoesSubRow citacoes={equiv.citacoes} />
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
