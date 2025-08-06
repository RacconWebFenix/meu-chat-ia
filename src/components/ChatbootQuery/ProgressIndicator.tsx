// src/components/ChatbootQuery/ProgressIndicator.tsx
import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

interface ProgressIndicatorProps {
  currentStep: number;
}

const steps = [
  "Interpretando a pergunta e gerando a consulta SQL...",
  "Buscando e coletando os dados no banco...",
  "Analisando os resultados com a IA...",
  "Quase pronto, finalizando a resposta...",
];

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
}) => {
  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="body2" sx={{ mb: 1.5, fontWeight: "bold" }}>
        Analisando sua solicitação:
      </Typography>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        let icon;
        if (currentStep > stepNumber) {
          icon = "✅"; // Concluído
        } else if (currentStep === stepNumber) {
          icon = <CircularProgress size={16} sx={{ mr: 0.5 }} />; // Em andamento
        } else {
          icon = "⚪️"; // Pendente
        }

        return (
          <Box
            key={step}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              opacity: currentStep >= stepNumber ? 1 : 0.5,
              transition: "opacity 0.3s ease-in-out",
            }}
          >
            <Box sx={{ width: "24px", textAlign: "center", mr: 1 }}>{icon}</Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: currentStep === stepNumber ? "bold" : "normal",
              }}
            >
              {step}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};
