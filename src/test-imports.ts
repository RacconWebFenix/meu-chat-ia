/**
 * Test import to validate PDMFlow structure
 */

import { PDMFlow } from "./components";
import { PDMStep, ProcessingStatus } from "./features/pdm";

// Test that imports work correctly
const testImports = () => {
  console.log("PDMFlow component:", PDMFlow);
  console.log("PDMStep enum:", PDMStep);
  console.log("ProcessingStatus enum:", ProcessingStatus);
};

export default testImports;
