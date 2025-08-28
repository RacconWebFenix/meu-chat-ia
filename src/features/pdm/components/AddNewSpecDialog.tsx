import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon, Add as AddIcon } from "@mui/icons-material";

interface AddNewSpecDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onAdd: (key: string, value: string) => void;
}

export default function AddNewSpecDialog({
  open,
  onClose,
  onAdd,
}: AddNewSpecDialogProps) {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleAdd = () => {
    if (newKey.trim() && newValue.trim()) {
      onAdd(newKey.trim(), newValue.trim());
      setNewKey("");
      setNewValue("");
      onClose();
    }
  };

  const handleClose = () => {
    setNewKey("");
    setNewValue("");
    onClose();
  };

  const canAdd = newKey.trim() && newValue.trim();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Adicionar Nova Característica
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Nome da Característica"
            placeholder="Ex: Peso, Cor, Dimensão..."
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            fullWidth
            autoFocus
          />

          <TextField
            label="Valor"
            placeholder="Ex: 2.5kg, Azul, 100mm..."
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} color="secondary">
          Cancelar
        </Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          disabled={!canAdd}
          startIcon={<AddIcon />}
        >
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
