import {
  IndustrialFields,
  RamoFields,
  isIndustrialFields,
} from "../EquivalenceForm/types";

export const industrialHeaders = [
  "Nome da Peça ou Componente",
  "Características físicas",
  "Referência da Marca ou Fabricante",
  "Marca ou Fabricante",
  "Norma Aplicável",
  "Aplicação",
];

export const ramoHeaders = [
  "Nome",
  "Características físicas",
  "Referência",
  "Marca/Fabricante",
];

export const RAMO_TIPO_LABELS: Record<string, string> = {
  "1": "Linha Automotiva",
  "2": "Linha Industrial",
  "3": "Agrícola",
  "4": "Multiaplicação",
  "5": "Administrativo",
};

export function getDefaultFields(
  ramoTipo: string
): RamoFields | IndustrialFields {
  if (ramoTipo === "2") {
    return {
      nomePeca: "",
      caracteristicasInd: "",
      referenciaInd: "",
      marcaInd: "",
      norma: "",
      aplicacao: "",
    } as IndustrialFields;
  }
  return {
    nome: "",
    caracteristicas: "",
    referencia: "",
    marcaFabricante: "",
  } as RamoFields;
}

export function getHeadersAndRow(
  fields: RamoFields | IndustrialFields,
  ramoTipo: string
): { headers: string[]; row: (string | undefined)[] } {
  if (ramoTipo === "2" && isIndustrialFields(fields)) {
    return {
      headers: industrialHeaders,
      row: [
        fields.nomePeca,
        fields.caracteristicasInd,
        fields.referenciaInd,
        fields.marcaInd,
        fields.norma,
        fields.aplicacao,
      ],
    };
  } else {
    return {
      headers: ramoHeaders,
      row: [
        (fields as RamoFields).nome,
        (fields as RamoFields).caracteristicas,
        (fields as RamoFields).referencia,
        (fields as RamoFields).marcaFabricante,
      ],
    };
  }
}

export function montarCamposValores<T extends object>(obj: T) {
  return { campos: { ...obj } };
}
