// src/features/reports/types/index.ts

// Define os tipos de dados primitivos que nossas colunas podem ter.
export type ReportValue = string | number | null | undefined;

// O ReportRow agora usa um Record, que é mais seguro que 'any'.
// Ele mapeia chaves string para um dos nossos tipos permitidos.
// Incluímos 'id' como obrigatório para o DataGrid.
export type ReportRow = { id: string } & Record<string, ReportValue>;

// Re-export tipos de pivot
export * from "./pivot.types";

// A interface Quotation continua como antes para manter a tipagem forte
// onde conhecemos a estrutura.
export interface Quotation {
  id: string;
  empresa: string;
  comprador: string;
  fornecedor: string;
  idCotacao: number;
  finalizada: string;
  codItem: string;
  descricao: string;
}

// A interface de filtros permanece a mesma.
export interface QuotationFilters {
  reportType: string;
  startDate: string;
  endDate: string;
  searchTerm?: string;
  groupId?: number | null;
  page?: number;
  pageSize?: number;
}
