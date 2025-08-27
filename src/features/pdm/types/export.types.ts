/**
 * Tipos relacionados à funcionalidade de exportação de dados.
 */

import { EquivalenceMatch, EquivalenceSearchCriteria } from "./";

/**
 * Define a estrutura dos dados que serão enviados para o serviço de exportação.
 */
export interface ExportData {
  readonly selectedMatches: readonly EquivalenceMatch[];
  readonly searchCriteria?: EquivalenceSearchCriteria;
  readonly exportFormat: "excel" | "csv" | "pdf";
  readonly includeSpecs: boolean;
  readonly includePDM: boolean;
}
