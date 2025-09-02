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
import Image from "next/image";
import {
  EquivalenciasData,
  EquivalenciaItem,
  CaracteristicaItem,
  ImagemItem,
  CitacaoItem,
} from "../mocks/mockEquivalenciasData";
import { formatTechnicalKey } from "@/Utils/formatUtils";

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
  <Box sx={{ p: 2, bgcolor: "grey.50", flex: 1 }}>
    <Typography variant="subtitle2" gutterBottom>
      Características Técnicas:
    </Typography>
    {caracteristicas.map((carac, index) => (
      <Box
        key={index}
        sx={{
          mb: 2,
          p: 1,
          border: 1,
          borderColor: "grey.300",
          borderRadius: 1,
        }}
      >
        {Object.entries(carac).map(([key, value]) => (
          <Typography key={key} variant="body2" sx={{ mb: 0.5 }}>
            <strong>{formatTechnicalKey(key)}:</strong> {value}
          </Typography>
        ))}
      </Box>
    ))}
  </Box>
);

const ImagensSubRow: React.FC<ImagensSubRowProps> = ({ imagens }) => (
  <Box sx={{ p: 2, bgcolor: "grey.100", flex: 1 }}>
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {imagens.map((img, index) => (
        <Box key={index} sx={{ textAlign: "center" }}>
          <Box
            onClick={() => window.open(img.origin_url, "_blank")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                window.open(img.origin_url, "_blank");
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`Abrir imagem ${index + 1} em nova aba`}
            sx={{
              cursor: "pointer",
              borderRadius: 1,
              "&:hover": { opacity: 0.8 },
              "&:focus": { outline: "2px solid #1976d2" },
            }}
          >
            <Image
              src={img.image_url}
              alt={`Imagem ${index + 1}`}
              width={120}
              height={120}
              style={{
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
);

const CitacoesSubRow: React.FC<CitacoesSubRowProps> = ({ citacoes }) => (
  <Box sx={{ p: 2, bgcolor: "grey.50", flex: 1 }}>
    <Typography variant="subtitle2" gutterBottom>
      Citações:
    </Typography>
    {citacoes.map((cit, index) => (
      <Box key={index} sx={{ mb: 1 }}>
        <Typography
          variant="body2"
          component="div"
          sx={{ mb: 0.5, fontWeight: "bold" }}
        >
          {cit.title}
        </Typography>
        <Link
          href={cit.url}
          target="_blank"
          rel="noopener"
          sx={{ fontSize: "0.875rem" }}
        >
          {cit.url}
        </Link>
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
                Unidade
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
                        <Box sx={{ display: "flex", gap: 2, p: 2 }}>
                          <CaracteristicasSubRow
                            caracteristicas={equiv.caracteristicas}
                          />
                          <ImagensSubRow imagens={equiv.imagens} />
                          <CitacoesSubRow citacoes={equiv.citacoes} />
                        </Box>
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
