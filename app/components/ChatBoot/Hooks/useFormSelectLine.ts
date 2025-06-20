import { useState, useEffect } from "react";
import {
  IndustrialFields,
  RamoFields,
  isIndustrialFields,
} from "../EquivalenceForm/types";

export function useFormSelectLine(
  branchFields: RamoFields | IndustrialFields,
  setPrompt: (v: RamoFields | IndustrialFields) => void,
  onSend?: (
    prompt: RamoFields | IndustrialFields,
    userInputHeaders: string[],
    userInputRow: (string | undefined)[],
    quantidadeEquivalentes: number
  ) => void
) {
  const [quantidadeEquivalentes, setQuantidadeEquivalentes] = useState(5);
  const [ramoTipo, setRamoTipo] = useState<string>("1");

  useEffect(() => {
    // Se o usuário selecionou o ramo "1" (Automotivo)...
    if (ramoTipo === "1") {
      // ...criamos um novo objeto 'branchFields' limpo, com a estrutura de RamoFields.
      const novoBranchFields: RamoFields = {
        nome: "",
        caracteristicas: "",
        referencia: "",
        marcaFabricante: "",
      };
      // O setPrompt recebe este novo objeto e atualiza o estado principal.
      setPrompt(novoBranchFields);
    }
    // Se o usuário selecionou o ramo "2" (Industrial)...
    else if (ramoTipo === "2") {
      // ...criamos um novo objeto 'branchFields' limpo, com a estrutura de IndustrialFields.
      const novoBranchFields: IndustrialFields = {
        nomePeca: "",
        caracteristicasInd: "",
        referenciaInd: "",
        marcaInd: "",
        norma: "",
        aplicacao: "",
      };
      // O setPrompt recebe este novo objeto e atualiza o estado principal.
      setPrompt(novoBranchFields);
    }
  }, [ramoTipo, setPrompt]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let userInputHeaders: string[] = [];
    let userInputRow: (string | undefined)[] = [];
    let promptObj: RamoFields | IndustrialFields;

    if (ramoTipo === "2" && isIndustrialFields(branchFields)) {
      userInputHeaders = [
        "Nome da Peça ou Componente",
        "Características físicas",
        "Referência da Marca ou Fabricante",
        "Marca ou Fabricante",
        "Norma Aplicável",
        "Aplicação",
      ];
      userInputRow = [
        branchFields.nomePeca,
        branchFields.caracteristicasInd,
        branchFields.referenciaInd,
        branchFields.marcaInd,
        branchFields.norma,
        branchFields.aplicacao,
      ];
      promptObj = { ...branchFields, ramo: ramoTipo, quantidadeEquivalentes: quantidadeEquivalentes }; // Incluindo o ramo selecionado
      setPrompt(promptObj);
    } else if (!isIndustrialFields(branchFields)) {
      userInputHeaders = [
        "Nome",
        "Características físicas",
        "Referência",
        "Marca/Fabricante",
      ];
      userInputRow = [
        branchFields.nome,
        branchFields.caracteristicas,
        branchFields.referencia,
        branchFields.marcaFabricante,
      ];
      promptObj = {
        ...branchFields,
        ramo: ramoTipo,
        quantidadeEquivalentes: quantidadeEquivalentes,
      }; // Incluindo o ramo selecionado
      setPrompt(promptObj);
    } else {
      // fallback, should not happen
      promptObj = branchFields;
    }

    if (onSend)
      onSend(promptObj, userInputHeaders, userInputRow, quantidadeEquivalentes);
  }

  return {
    ramoTipo,
    setRamoTipo,
    quantidadeEquivalentes,
    setQuantidadeEquivalentes,
    handleSubmit,
  };
}
