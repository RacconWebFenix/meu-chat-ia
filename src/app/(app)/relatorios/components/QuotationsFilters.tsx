// src/app/(app)/relatorios/components/QuotationsFilters.tsx
"use client";

import React from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { QuotationFilters } from "@/features/reports/types";

interface QuotationsFiltersProps {
  filters: QuotationFilters;
  onFilterChange: <K extends keyof QuotationFilters>(
    field: K,
    value: QuotationFilters[K]
  ) => void;
  onApplyFilters: () => void;
  loading: boolean;
}

export default function QuotationsFilters({
  filters,
  onFilterChange,
  onApplyFilters,
  loading,
}: QuotationsFiltersProps) {
  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        onApplyFilters();
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        flexWrap: "wrap",
        mb: 3,
      }}
    >
      <TextField
        label="Data Início"
        type="date"
        value={filters.startDate}
        onChange={(e) => onFilterChange("startDate", e.target.value)}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label="Data Fim"
        type="date"
        value={filters.endDate}
        onChange={(e) => onFilterChange("endDate", e.target.value)}
        InputLabelProps={{ shrink: true }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{ height: "56px" }}
      >
        Filtrar
      </Button>
    </Box>
  );
}
