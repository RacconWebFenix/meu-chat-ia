import React, { useEffect, useState } from "react";
import ProductEquivalenceSelector from "./ProductEquivalenceSelector/ProductEquivalenceSelector";
import styles from "./ProductEquivalenceSelector.module.scss";
import { useFormSelectLine } from "@/features/chat/hooks";
import { IndustrialFields, RamoFields } from "@/features/chat/types";
import LineInputs from "../LineInputs/LineInputs";
import { hasAnyFieldFilled } from "./helpers";
import { getDefaultFields } from "@/features/chat/hooks";
import { CustomButton } from "@/components/shared";

interface SelectLineProps {
  setPrompt: (v: RamoFields | IndustrialFields) => void;
  onSend?: (
    prompt: RamoFields | IndustrialFields,
    userInputHeaders: string[],
    userInputRow: string[],
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
  >(getDefaultFields("1"));

  const {
    ramoTipo,
    setRamoTipo,
    quantidadeEquivalentes,
    setQuantidadeEquivalentes,
    handleSubmit,
  } = useFormSelectLine(
    branchFields,
    setPrompt,
    onSend &&
      ((prompt, headers, row, quantidade) => {
        // Garante que userInputRow seja string[]
        onSend(
          prompt,
          headers,
          row.map((x) => x ?? ""),
          quantidade
        );
      })
  );

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

      <CustomButton
        type="submit"
        colorType="primary"
        fullWidth
        variant="contained"
        sx={{
          mt: 2,
          py: 1.5,
          fontSize: 16,
          fontWeight: 700,
          background: (theme) => theme.palette.primary.main,
          color: (theme) => theme.palette.primary.contrastText,
          "&:hover": {
            background: (theme) => theme.palette.primary.dark,
          },
        }}
        disabled={!isButtonEnabled}
      >
        Enviar
      </CustomButton>
    </form>
  );
}
