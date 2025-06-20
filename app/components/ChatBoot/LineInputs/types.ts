export type BranchFields = {
  nome: string;
  caracteristicas: string;
  referencia: string;
  marcaFabricante: string;
};

export type BranchFieldsIndustrial = {
  nomePeca: string;
  caracteristicasInd: string;
  referenciaInd: string;
  marcaInd: string;
  norma: string;
  aplicacao: string;
};

export type BranchInFields = BranchFields | BranchFieldsIndustrial;

export interface TypeOfBranchProps {
  ramoTipo: string;
  setBranchFields: (v: BranchInFields) => void;
  branchFields: BranchInFields;
  disabled?: boolean;
}
