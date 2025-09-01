/**
 * Material Identification Container
 * Following Single Responsibility Principle and Dependency Inversion
 */

import React from "react";
import { Container, Box } from "@mui/material";
import { useMaterialIdentification } from "../hooks";
import { createMaterialIdentificationService } from "../services";
import {
  MaterialSearchHeader,
  PDMModelDisplay,
  MaterialIdentificationLoading,
} from "./index";

export const MaterialIdentificationContainer: React.FC = () => {
  const service = createMaterialIdentificationService();
  const { state, updateSearchData, identifyMaterial } =
    useMaterialIdentification({ service });

  const handleSearch = async () => {
    await identifyMaterial();
  };

  return (
    <Container maxWidth="xl" disableGutters>
      <Box sx={{ width: "100%", p: 2 }}>
        <MaterialSearchHeader
          searchData={state.searchData}
          onSearchDataChange={updateSearchData}
          onSearch={handleSearch}
          isLoading={state.isLoading}
        />

        {state.isLoading && <MaterialIdentificationLoading />}

        {!state.isLoading && (
          <PDMModelDisplay result={state.result} error={state.error} />
        )}
      </Box>
    </Container>
  );
};
