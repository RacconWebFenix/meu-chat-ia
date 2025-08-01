import { Message } from "../../../types/api.types";

// Chat specific types
export interface ChatState {
  messages: Message[];
  prompt: string;
  currentFeedbackId: string | null;
  feedbackSent: boolean;
  userInputHeaders: string[];
  userInputRow: string[];
}

export interface ChatConfig {
  useMock: boolean;
  autoScroll: boolean;
  maxMessages: number;
}

// EquivalenceForm types
export interface RamoFields {
  nome: string;
  caracteristicas: string;
  referencia: string;
  marcaFabricante: string;
  ramo?: string;
  quantidadeEquivalentes?: number;
}

export interface IndustrialFields {
  nomePeca: string;
  caracteristicasInd: string;
  referenciaInd: string;
  marcaInd: string;
  norma: string;
  aplicacao: string;
  ramo?: string;
  quantidadeEquivalentes?: number;
}

export function isIndustrialFields(
  fields: RamoFields | IndustrialFields
): fields is IndustrialFields {
  return "nomePeca" in fields;
}

export type { Message };
