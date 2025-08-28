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

  // Dividir valores por vírgula e criar tags
  const values = value.split(",").map((v) => v.trim()).filter(Boolean);
  const displayValues = values.slice(0, 2); // Mostrar no máximo 2 tags
  const remainingCount = values.length - 2;

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
          bgcolor: checked ? "primary.50" : "background.paper",
          border: checked ? "1px solid" : "1px solid",
          borderColor: checked ? "primary.main" : "grey.300",
          "&:hover": {
            bgcolor: checked ? "primary.100" : "grey.50",
            borderColor: checked ? "primary.dark" : "grey.400",
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
                fontSize: "0.55rem",
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

            {/* Tags de Valores */}
            <Box
              sx={{
                display: "flex",
                gap: 0.1,
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              {displayValues.map((val, index) => (
                <Chip
                  key={index}
                  label={val}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: "14px",
                    fontSize: "0.45rem",
                    "& .MuiChip-label": {
                      px: 0.3,
                      py: 0,
                    },
                    maxWidth: "50px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                />
              ))}
              {remainingCount > 0 && (
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.4rem",
                    color: "primary.main",
                    fontWeight: 600,
                  }}
                >
                  +{remainingCount}
                </Typography>
              )}
            </Box>
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
            label="Valores (separados por vírgula)"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder="Ex: SKF, 25mm, Aço inoxidável"
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
