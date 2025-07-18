import { RamoFields, IndustrialFields } from "@/features/chat/types";

export function hasAnyFieldFilled(
  branchFields: Partial<RamoFields> | Partial<IndustrialFields>
): boolean {
  if (!branchFields) return false;

  if ("nome" in branchFields) {
    const { nome, caracteristicas, referencia, marcaFabricante } = branchFields;
    return [nome, caracteristicas, referencia, marcaFabricante].some(
      (field) => (field?.trim() || "") !== ""
    );
  }

  if ("nomePeca" in branchFields) {
    const {
      nomePeca,
      caracteristicasInd,
      referenciaInd,
      marcaInd,
      norma,
      aplicacao,
    } = branchFields;
    return [
      nomePeca,
      caracteristicasInd,
      referenciaInd,
      marcaInd,
      norma,
      aplicacao,
    ].some((field) => (field?.trim() || "") !== "");
  }

  return false;
}
