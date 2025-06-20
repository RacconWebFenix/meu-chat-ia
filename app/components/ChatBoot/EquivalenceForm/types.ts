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
