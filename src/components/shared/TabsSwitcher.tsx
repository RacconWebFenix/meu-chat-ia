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
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        mb: 0.5,
      }}
    >
      <ToggleButtonGroup
        value={tab}
        exclusive
        onChange={handleChange}
        orientation="horizontal"
        aria-label="tipo de pesquisa"
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 1,
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          width: { xs: "100%", sm: "auto" },
          height: "32px",
          "& .MuiToggleButton-root": {
            border: "none",
            borderRadius: "4px !important",
            px: 1.5,
            py: 0.2,
            mx: 0.1,
            fontWeight: 500,
            textTransform: "none",
            color: "primary.main",
            backgroundColor: "transparent",
            flex: 1,
            fontSize: "0.7rem",
            minHeight: "28px",
            minWidth: { xs: "auto", sm: "120px" },
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
          Equivalência
        </ToggleButton>
        <ToggleButton value="pdm" aria-label="pesquisa pdm">
          PDM
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
