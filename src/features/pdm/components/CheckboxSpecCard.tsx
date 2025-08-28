import React, { useState, useCallback } from "react";
import {
  Box,
  Chip,
  TextField,
  Typography,
  Paper,
  IconButton,
  Stack,
} from "@mui/material";
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { formatTechnicalKey } from "@/Utils/formatUtils";

interface CheckboxSpecCardProps {
  readonly id: string;
  readonly checked: boolean;
  readonly label: string;
  readonly value: string;
  readonly onCheck: (id: string, checked: boolean) => void;
  readonly onValueChange: (id: string, newValue: string) => void;
  readonly onLabelChange?: (id: string, newLabel: string) => void;
  readonly editable?: boolean;
}

export default function CheckboxSpecCard({
  id,
  checked,
  label,
  value,
  onCheck,
  onValueChange,
  onLabelChange,
  editable = true,
}: CheckboxSpecCardProps) {
  const [isEditingValue, setIsEditingValue] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  // Parse values into array of tags (split by comma, semicolon, or line break)
  const valueTags = value
    .split(/[,;\n]/)
    .map((v) => v.trim())
    .filter((v) => v.length > 0);

  const handleToggleSelection = useCallback(() => {
    onCheck(id, !checked);
  }, [id, checked, onCheck]);
  const handleValueEdit = useCallback(() => {
    if (!editable) return;
    setTempValue(value);
    setIsEditingValue(true);
  }, [editable, value]);

  const handleValueSave = useCallback(() => {
    onValueChange(id, tempValue);
    setIsEditingValue(false);
  }, [id, tempValue, onValueChange]);

  const handleValueCancel = useCallback(() => {
    setTempValue(value);
    setIsEditingValue(false);
  }, [value]);

  const handleTagDelete = useCallback(
    (tagToDelete: string) => {
      const newTags = valueTags.filter((tag) => tag !== tagToDelete);
      onValueChange(id, newTags.join(", "));
    },
    [id, valueTags, onValueChange]
  );

  return (
    <Paper
      variant="outlined"
      onClick={handleToggleSelection}
      sx={{
        p: 0.8,
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        bgcolor: checked ? "primary.50" : "background.paper",
        border: checked ? 2 : 1,
        borderColor: checked ? "primary.main" : "divider",
        "&:hover": {
          bgcolor: checked ? "primary.100" : "grey.50",
          borderColor: checked ? "primary.dark" : "primary.light",
        },
        minHeight: 50,
        maxHeight: 50,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Label da característica - Não editável */}
      <Typography
        variant="subtitle2"
        fontWeight="600"
        color="text.primary"
        sx={{
          mb: 0.4,
          fontSize: "0.65rem",
          lineHeight: 1.0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
        title={formatTechnicalKey(label)}
      >
        {formatTechnicalKey(label)}
      </Typography>

      {/* Tags de valores em uma linha */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "flex-start",
          minHeight: 0,
        }}
      >
        {isEditingValue ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.3,
              width: "100%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <TextField
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              size="small"
              variant="outlined"
              fullWidth
              placeholder="Valores..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleValueSave();
                }
                if (e.key === "Escape") handleValueCancel();
              }}
              sx={{
                "& .MuiInputBase-root": {
                  fontSize: "0.65rem",
                  height: "24px",
                },
                "& .MuiInputBase-input": {
                  py: 0.2,
                  px: 0.5,
                },
              }}
            />
            <IconButton
              size="small"
              onClick={handleValueSave}
              color="primary"
              sx={{ p: 0.2 }}
            >
              <CheckIcon sx={{ fontSize: 12 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleValueCancel}
              sx={{ p: 0.2 }}
            >
              <CloseIcon sx={{ fontSize: 12 }} />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ width: "100%", overflow: "hidden" }}>
            <Stack
              direction="row"
              spacing={0.2}
              sx={{
                flexWrap: "wrap",
                gap: 0.2,
                alignItems: "flex-start",
              }}
            >
              {valueTags.slice(0, 1).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag.length > 8 ? tag.substring(0, 8) + "..." : tag}
                  size="small"
                  variant={checked ? "filled" : "outlined"}
                  color={checked ? "primary" : "default"}
                  onDelete={editable ? () => handleTagDelete(tag) : undefined}
                  onClick={(e) => e.stopPropagation()}
                  title={tag}
                  sx={{
                    fontSize: "0.55rem",
                    height: 14,
                    maxWidth: "50px",
                    "& .MuiChip-deleteIcon": {
                      fontSize: 8,
                      margin: "0 1px 0 -1px",
                    },
                    "& .MuiChip-label": {
                      px: 0.2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                />
              ))}
              {valueTags.length > 1 && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontSize: "0.55rem",
                    lineHeight: "14px",
                    alignSelf: "center",
                  }}
                  title={`${valueTags.length - 1} mais valores: ${valueTags
                    .slice(1)
                    .join(", ")}`}
                >
                  +{valueTags.length - 1}
                </Typography>
              )}
              {editable && (
                <Chip
                  icon={<AddIcon sx={{ fontSize: 10 }} />}
                  label=""
                  size="small"
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleValueEdit();
                  }}
                  sx={{
                    fontSize: "0.55rem",
                    height: 14,
                    minWidth: 16,
                    width: 16,
                    borderStyle: "dashed",
                    "& .MuiChip-label": {
                      display: "none",
                    },
                    "& .MuiChip-icon": {
                      margin: 0,
                    },
                    "&:hover": {
                      backgroundColor: "primary.50",
                    },
                  }}
                />
              )}
            </Stack>
            {valueTags.length === 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontStyle: "italic",
                  fontSize: "0.55rem",
                  cursor: "pointer",
                  lineHeight: 1.0,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleValueEdit();
                }}
              >
                Clique +
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
}
