/**
 * ERP Export Input Component
 * Following Single Responsibility Principle
 */

import React, { useState, useCallback } from "react";
import { TextField } from "@mui/material";

interface ERPExportInputProps {
  onInputChange: (value: string) => void;
  error: string | null;
  value?: string;
}

export const ERPExportInput: React.FC<ERPExportInputProps> = ({
  onInputChange,
  error,
  value = "",
}) => {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setLocalValue(newValue);
      onInputChange(newValue);
    },
    [onInputChange]
  );

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      const pastedText = event.clipboardData.getData("text");
      const currentValue = localValue;

      // Adiciona ";" no final do texto colado se não houver
      const processedPastedText = pastedText.trim().endsWith(";")
        ? pastedText.trim()
        : `${pastedText.trim()};`;

      const newValue = currentValue
        ? `${currentValue}; ${processedPastedText}`
        : processedPastedText;

      setLocalValue(newValue);
      onInputChange(newValue);
    },
    [localValue, onInputChange]
  );

  return (
    <TextField
      fullWidth
      label="Atributos para ERP"
      placeholder="Ex: Nome: Filtro Óleo; Marca: MANN; Referência: HU931"
      value={localValue}
      onChange={handleChange}
      onPaste={handlePaste}
      error={!!error}
      helperText={error}
      multiline
      rows={2}
      variant="outlined"
    />
  );
};
