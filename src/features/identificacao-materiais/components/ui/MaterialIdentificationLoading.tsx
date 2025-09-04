/**
 * Loading component for Material Identification
 * Following Single Responsibility Principle
 */

import React from "react";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(4),
  minHeight: 200,
}));

const LoadingCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  maxWidth: 400,
  width: "100%",
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[2],
}));

interface MaterialIdentificationLoadingProps {
  message?: string;
}

export const MaterialIdentificationLoading: React.FC<
  MaterialIdentificationLoadingProps
> = ({ message = "Identificando material..." }) => {
  return (
    <LoadingContainer>
      <LoadingCard>
        <CircularProgress size={48} thickness={4} sx={{ mb: 2 }} />

        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          color="text.primary"
        >
          Identificação de Materiais
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </LoadingCard>
    </LoadingContainer>
  );
};
