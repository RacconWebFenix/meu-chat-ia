// src/features/pdm/components/CheckboxSpecCard.tsx
// Ultra-compact 60px cards with tag editing - Updated: 2025-08-28
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Checkbox,
  Typography,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { Edit as EditIcon, Add as AddIcon } from "@mui/icons-material";

interface CheckboxSpecCardProps {
  id: string;
  checked: boolean;
  label: string;
  value: string;
  onCheck: (id: string, checked: boolean) => void;
  onValueChange: (id: string, newValue: string) => void;
  onLabelChange: (id: string, newLabel: string) => void;
  editable?: boolean;
}

export default function CheckboxSpecCard({
  id,
  checked,
  label,
  value,
  onCheck,
  onValueChange,
  onLabelChange,
  editable = false,
}: CheckboxSpecCardProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [tempLabel, setTempLabel] = useState(label);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onLabelChange(id, tempLabel);
    onValueChange(id, tempValue);
    setEditDialogOpen(false);
  };

  const handleClose = () => {
    setTempLabel(label);
    setTempValue(value);
    setEditDialogOpen(false);
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          height: "50px",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          bgcolor: checked ? "primary.50" : "grey.50",
          border: checked ? "1px solid" : "1px solid",
          borderColor: checked ? "primary.main" : "grey.300",
          opacity: checked ? 1 : 0.7,
          "&:hover": {
            bgcolor: checked ? "primary.100" : "grey.100",
            borderColor: checked ? "primary.dark" : "grey.400",
            opacity: 1,
          },
          transition: "all 0.2s ease-in-out",
        }}
        onClick={() => onCheck(id, !checked)}
      >
        <CardContent
          sx={{
            p: 0.6,
            "&:last-child": { pb: 0.6 },
            display: "flex",
            alignItems: "center",
            gap: 0.6,
            width: "100%",
            minHeight: 0,
          }}
        >
          {/* Checkbox */}
          <Checkbox
            checked={checked}
            onChange={(e) => {
              e.stopPropagation();
              onCheck(id, e.target.checked);
            }}
            size="small"
            sx={{ p: 0 }}
          />

          {/* Conteúdo */}
          <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
            {/* Label */}
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.85rem", // Aumentado de 0.55rem para 0.85rem (+0.3rem)
                fontWeight: 600,
                color: "text.secondary",
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                lineHeight: 1,
                mb: 0.1,
              }}
              title={label}
            >
              {label}
            </Typography>

            {/* Valor Simples */}
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.75rem", // Aumentado de 0.45rem para 0.75rem (+0.3rem)
                color: "text.primary",
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                lineHeight: 1.2,
              }}
              title={value}
            >
              {value || "Sem valor"}
            </Typography>
          </Box>

          {/* Botão de Edição */}
          {editable && (
            <EditIcon
              sx={{
                fontSize: "12px",
                color: "action.secondary",
                cursor: "pointer",
                "&:hover": { color: "primary.main" },
              }}
              onClick={(e) => {
                e.stopPropagation();
                setEditDialogOpen(true);
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialog de Edição */}
      <Dialog
        open={editDialogOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontSize: "1rem", pb: 1 }}>
          Editar Especificação
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            margin="dense"
            label="Nome da Característica"
            fullWidth
            variant="outlined"
            value={tempLabel}
            onChange={(e) => setTempLabel(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Valor da Característica"
            fullWidth
            variant="outlined"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder="Ex: β15μm > 200 absolutos"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
