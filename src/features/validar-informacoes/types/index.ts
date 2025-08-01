import { PerplexityResult } from "@/types/api.types";

// Validar Informações specific types
export interface ValidarInformacoesState {
  selectedRows: number[];
  selectedRowData: Record<string, string> | null;
  result: PerplexityResult[] | null;
  pesquisadasRows: number[];
}

export interface ValidarInformacoesConfig {
  useMock: boolean;
  autoLoadMock: boolean;
}

export interface ValidatedProduct {
  fabricante: string;
  referencia: string;
  aplicacao: string;
  isValid: boolean;
  explanation: string;
}
