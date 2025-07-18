import React from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  useTheme,
} from "@mui/material";

interface TabsSwitcherProps {
  tab: "pdm" | "equivalencia";
  setTab: (tab: "pdm" | "equivalencia") => void;
}

export default function TabsSwitcher({ tab, setTab }: TabsSwitcherProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
        mb: 1,
      }}
    >
      <ToggleButtonGroup
        value={tab}
        exclusive
        onChange={handleChange}
        orientation={isMobile ? "vertical" : "horizontal"}
        aria-label="tipo de pesquisa"
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 2,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          width: { xs: "100%", sm: "auto" },
          "& .MuiToggleButton-root": {
            border: "none",
            borderRadius: "8px !important",
            px: 3,
            py: 1.5,
            mx: { xs: 0, sm: 0.5 },
            my: { xs: 0.5, sm: 0 },
            fontWeight: 600,
            textTransform: "none",
            color: "primary.main",
            backgroundColor: "transparent",
            flex: 1,
            minWidth: { xs: "100%", sm: "180px" },
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
