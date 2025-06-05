import React from "react";
import LineInputs from "../../LineInputs/LineInputs";
import ProductEquivalenceSelector from "./ProductEquivalenceSelector/ProductEquivalenceSelector";
import styles from "./ProductEquivalenceSelector.module.scss";
import { useFormSelectLine } from "../Hooks/useFormSelectLine";

interface SelectLineProps {
  linha: "automotiva" | "industrial";
  setLinha: (v: "automotiva" | "industrial") => void;
  setPrompt: (v: string) => void;
  onSend?: (
    prompt: string,
    userInputHeaders: string[],
    userInputRow: (string | undefined)[],
    quantidadeEquivalentes: number
  ) => void;
  disabled?: boolean;
}

export default function EquivalenceForm({
  linha,
  setLinha,
  setPrompt,
  onSend,
  disabled,
}: SelectLineProps) {
  const {
    automotiva,
    setAutomotiva,
    industrial,
    setIndustrial,
    quantidadeEquivalentes,
    setQuantidadeEquivalentes,
    handleSubmit,
  } = useFormSelectLine(linha, setLinha, setPrompt, onSend);

  return (
    <form className={styles.ProductEquivalenceSelector} onSubmit={handleSubmit}>
      <div>
        <ProductEquivalenceSelector
          linha={linha}
          setLinha={setLinha}
          quantidadeEquivalentes={quantidadeEquivalentes}
          setQuantidadeEquivalentes={setQuantidadeEquivalentes}
          disabled={disabled}
        />

        <LineInputs
          linha={linha}
          automotiva={automotiva}
          setAutomotiva={setAutomotiva}
          industrial={industrial}
          setIndustrial={setIndustrial}
          disabled={disabled}
        />
      </div>

      <button type="submit" className={styles.buttonSubmit} disabled={disabled}>
        Enviar
      </button>
    </form>
  );
}
