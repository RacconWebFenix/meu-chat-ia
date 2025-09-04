/**
 * Export barrel for Material Identification services
 */

export {
  ApiMaterialIdentificationService,
  createMaterialIdentificationService,
} from "./materialIdentificationService";

export {
  MockMaterialIdentificationService,
  createMockMaterialIdentificationService,
} from "./mockMaterialIdentificationService";

export type { MaterialIdentificationService } from "../types";

export {
  ApiEquivalenceSearchService,
  createEquivalenceSearchService,
} from "./equivalenceSearchService";

export {
  MockEquivalenceSearchService,
  createMockEquivalenceSearchService,
} from "./mockEquivalenceSearchService";

export type { EquivalenceSearchService } from "../types";
