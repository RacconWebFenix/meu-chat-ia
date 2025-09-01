/**
 * Material Identification Service
 * Following Dependency Inversion Principle
 */

import {
  MaterialIdentificationService,
  MaterialIdentificationResult,
  MaterialSearchData,
} from "../types";
import { mockMaterialIdentificationData } from "@/mocks/material-identification";

export class MockMaterialIdentificationService
  implements MaterialIdentificationService
{
  async identifyMaterial(
    searchData: MaterialSearchData
  ): Promise<MaterialIdentificationResult> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Validate input
    if (
      !searchData.nome &&
      !searchData.caracteristicas &&
      !searchData.fabricanteMarca &&
      !searchData.referencia
    ) {
      throw new Error(
        "Pelo menos um campo deve ser preenchido para identificação"
      );
    }

    // Return mock data
    return mockMaterialIdentificationData;
  }
}

// Factory function following Dependency Inversion
export const createMaterialIdentificationService =
  (): MaterialIdentificationService => {
    return new MockMaterialIdentificationService();
  };
