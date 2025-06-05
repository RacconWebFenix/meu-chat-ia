import React from "react";
import styles from "./ProductEquivalenceSelector.module.scss";

interface ProductEquivalenceSelectorProps {
  linha: "automotiva" | "industrial";
  setLinha: (v: "automotiva" | "industrial") => void;
  quantidadeEquivalentes: number;
  setQuantidadeEquivalentes: (v: number) => void;
  disabled?: boolean;
}

export default function ProductEquivalenceSelector({
  linha,
  setLinha,
  quantidadeEquivalentes,
  setQuantidadeEquivalentes,
  disabled,
}: ProductEquivalenceSelectorProps) {
  return (
    <div className={styles.selectorContainer}>
      <select
        className={styles.selectLineSelect}
        value={linha}
        onChange={(e) =>
          setLinha(
            e.target.value === "automotiva" ? "automotiva" : "industrial"
          )
        }
        disabled={disabled}
      >
        <option value="automotiva">Linha Automotiva</option>
        <option value="industrial">Linha Industrial / Multiaplicação</option>
      </select>

      <select
        className={styles.selectLineSelect}
        value={quantidadeEquivalentes}
        onChange={(e) => setQuantidadeEquivalentes(Number(e.target.value))}
        disabled={disabled}
      >
        <option value={5}>5 produtos equivalentes</option>
        <option value={10}>10 produtos equivalentes</option>
        <option value={20}>20 produtos equivalentes</option>
      </select>
    </div>
  );
}
