/**
 * Export barrel for Material Identification components
 * Following Dependency Inversion Principle
 */

// Containers - High-level business logic components
export { MaterialIdentificationContainer } from "./containers/MaterialIdentificationContainer";
export { CaracteristicasSelectorContainer } from "./containers/CaracteristicasSelectorContainer";
export { EquivalenciasTableContainer } from "./containers/EquivalenciasTableContainer";

// UI Components - Presentation components
export { MaterialSearchHeader } from "./ui/MaterialSearchHeader";
export { PDMModelDisplay } from "./ui/PDMModelDisplay";
export { MaterialIdentificationLoading } from "./ui/MaterialIdentificationLoading";
export { SelectedSpecificationsSummary } from "./ui/SelectedSpecificationsSummary";

// ERP Export Feature - Complete feature components
export * from "./erp-export";
