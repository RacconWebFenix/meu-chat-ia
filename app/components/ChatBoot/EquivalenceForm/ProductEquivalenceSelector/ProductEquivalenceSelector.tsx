import React from "react";
import styles from "./ProductEquivalenceSelector.module.scss";

interface ProductEquivalenceSelectorProps {
  ramoTipo: string;
  setRamoTipo: (v: string) => void;
  quantidadeEquivalentes: number;
  setQuantidadeEquivalentes: (v: number) => void;
  disabled?: boolean;
}

export default function ProductEquivalenceSelector({
  ramoTipo,
  setRamoTipo,
  quantidadeEquivalentes,
  setQuantidadeEquivalentes,
  disabled,
}: ProductEquivalenceSelectorProps) {
  return (
    <div className={styles.selectorContainer}>
      <select
        className={styles.selectLineSelect}
        value={ramoTipo}
        onChange={(e) => setRamoTipo(e.target.value)}
        disabled={disabled}
      >
        <option value="1">Linha Automotiva</option>
        <option value="2">Linha Industrial</option>
        <option value="3">Agrícola</option>
        <option value="4">Multiaplicação</option>
        <option value="5">Administrativo</option>
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
