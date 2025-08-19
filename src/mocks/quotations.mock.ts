// src/mocks/quotations.mock.ts
import { Quotation } from "@/features/reports/types";

export const quotationsMock: Quotation[] = [
  {
    id: "1",
    empresa: "1362 - NIDEC MOBILIDADE BRASIL",
    comprador: "686 - ALLAN CIENI",
    fornecedor: "1943 - BALASKA FILIAL 1",
    idCotacao: 69497,
    finalizada: "25/07/2025",
    codItem: "S01401",
    descricao: "LUBRIFICANTE",
  },
  {
    id: "2",
    empresa: "1296 - CHACARA SÃO CARLOS",
    comprador: "626 - THAIS OLIVEIRA",
    fornecedor: "128 - PULL",
    idCotacao: 69486,
    finalizada: "03/07/2025",
    codItem: "123",
    descricao: "TESTE",
  },
  {
    id: "3",
    empresa: "1362 - NIDEC MOBILIDADE BRASIL",
    comprador: "686 - ALLAN CIENI",
    fornecedor: "1943 - BALASKA FILIAL 1",
    idCotacao: 69440,
    finalizada: "25/07/2025",
    codItem: "IMP1613",
    descricao: "CAPACETE",
  },
  {
    id: "4",
    empresa: "1362 - NIDEC MOBILIDADE BRASIL",
    comprador: "686 - ALLAN CIENI",
    fornecedor: "1943 - BALASKA FILIAL 1",
    idCotacao: 69440,
    finalizada: "25/07/2025",
    codItem: "IMP1614",
    descricao: "PROTETOR AURICULAR",
  },
];
