// src/features/pdm/components/AddNewSpecDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";

interface AddNewSpecDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (key: string, value: string) => void;
}

export default function AddNewSpecDialog({
  open,
  onClose,
  onAdd,
}: AddNewSpecDialogProps) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (key.trim() && value.trim()) {
      onAdd(key.trim(), value.trim());
      setKey("");
      setValue("");
      onClose();
    }
  };

  const handleClose = () => {
    setKey("");
    setValue("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontSize: "1rem", pb: 1 }}>
        Adicionar Nova Especificação
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Nome da Característica"
            fullWidth
            variant="outlined"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Ex: Marca, Diâmetro, Material..."
          />
          <TextField
            label="Valor"
            fullWidth
            variant="outlined"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ex: SKF, 25mm, Aço..."
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="secondary">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!key.trim() || !value.trim()}
        >
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
