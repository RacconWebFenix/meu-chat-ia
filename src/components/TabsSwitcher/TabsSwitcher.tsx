import React from "react";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";

interface TabsSwitcherProps {
  tab: "pdm" | "equivalencia";
  setTab: (tab: "pdm" | "equivalencia") => void;
}

export default function TabsSwitcher({ tab, setTab }: TabsSwitcherProps) {
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newTab: "pdm" | "equivalencia"
  ) => {
    if (newTab !== null) {
      setTab(newTab);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mb: 3,
      }}
    >
      <ToggleButtonGroup
        value={tab}
        exclusive
        onChange={handleChange}
        aria-label="tipo de pesquisa"
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 2,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          "& .MuiToggleButton-root": {
            border: "none",
            borderRadius: "8px !important",
            px: 3,
            py: 1.5,
            mx: 0.5,
            fontWeight: 600,
            textTransform: "none",
            color: "primary.main",
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "primary.light",
              color: "primary.dark",
            },
            "&.Mui-selected": {
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            },
          },
        }}
      >
        <ToggleButton
          value="equivalencia"
          aria-label="pesquisa de equivalência"
        >
          Pesquisa de Equivalência
        </ToggleButton>
        <ToggleButton value="pdm" aria-label="pesquisa pdm">
          Pesquisa PDM
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
