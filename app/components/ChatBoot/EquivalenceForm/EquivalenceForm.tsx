import React, { useEffect, useState } from "react";

import ProductEquivalenceSelector from "./ProductEquivalenceSelector/ProductEquivalenceSelector";
import styles from "./ProductEquivalenceSelector.module.scss";
import { useFormSelectLine } from "../Hooks/useFormSelectLine";
import { IndustrialFields, RamoFields } from "./types";
import LineInputs from "../LineInputs/LineInputs";
import { hasAnyFieldFilled } from "./helpers";

interface SelectLineProps {
  setPrompt: (v: RamoFields | IndustrialFields) => void;
  onSend?: (
    prompt: RamoFields | IndustrialFields,
    userInputHeaders: string[],
    userInputRow: (string | undefined)[],
    quantidadeEquivalentes: number
  ) => void;
  disabled?: boolean;
}

export default function EquivalenceForm({
  setPrompt,
  onSend,
  disabled,
}: SelectLineProps) {
  const [branchFields, setBranchFields] = useState<
    RamoFields | IndustrialFields
  >({} as RamoFields | IndustrialFields);

  const {
    ramoTipo,
    setRamoTipo,
    quantidadeEquivalentes,
    setQuantidadeEquivalentes,
    handleSubmit,
  } = useFormSelectLine(branchFields, setPrompt, onSend);

  // Initialize the branchFields based on ramoTipo
  useEffect(() => {
    if (ramoTipo === "2") {
      setBranchFields({
        nomePeca: "",
        caracteristicasInd: "",
        referenciaInd: "",
        marcaInd: "",
        norma: "",
        aplicacao: "",
      } as IndustrialFields);
    } else {
      setBranchFields({
        nome: "",
        caracteristicas: "",
        referencia: "",
        marcaFabricante: "",
      } as RamoFields);
    }
  }, [ramoTipo]);

  const isButtonEnabled = hasAnyFieldFilled(branchFields) && !disabled;

  return (
    <form className={styles.ProductEquivalenceSelector} onSubmit={handleSubmit}>
      <div>
        <ProductEquivalenceSelector
          ramoTipo={ramoTipo}
          setRamoTipo={setRamoTipo}
          quantidadeEquivalentes={quantidadeEquivalentes}
          setQuantidadeEquivalentes={setQuantidadeEquivalentes}
          disabled={disabled}
        />

        <LineInputs
          ramoTipo={ramoTipo}
          branchFields={branchFields}
          setBranchFields={setBranchFields}
          disabled={disabled}
        />
      </div>

      <button
        type="submit"
        className={styles.buttonSubmit}
        disabled={!isButtonEnabled}
      >
        Enviar
      </button>
    </form>
  );
}
