import { useState, useEffect } from "react";
import { IndustrialFields, RamoFields } from "../types";
import {
  getDefaultFields,
  getHeadersAndRow,
  RAMO_TIPO_LABELS,
} from "./helpers";

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
    setPrompt(getDefaultFields(ramoTipo));
  }, [ramoTipo, setPrompt]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const promptObj = {
      ...branchFields,
      ramo: RAMO_TIPO_LABELS[ramoTipo], // agora envia o nome/texto do ramo
      quantidadeEquivalentes,
    };
    setPrompt(promptObj);

    const { headers: userInputHeaders, row: userInputRow } = getHeadersAndRow(
      promptObj,
      ramoTipo
    );

    // Corrige userInputRow para garantir string[]
    const sanitizedUserInputRow = userInputRow.map((x) => x ?? "");

    if (onSend)
      onSend(
        promptObj,
        userInputHeaders,
        sanitizedUserInputRow,
        quantidadeEquivalentes
      );
  }

  return {
    ramoTipo,
    setRamoTipo,
    quantidadeEquivalentes,
    setQuantidadeEquivalentes,
    handleSubmit,
  };
}
