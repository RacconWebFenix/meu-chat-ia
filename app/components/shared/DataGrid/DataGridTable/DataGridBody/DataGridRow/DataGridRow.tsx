import React, { ReactNode } from "react";
import styles from "./DataGridRow.module.scss";

interface DataGridRowProps {
  row: (string | number | ReactNode)[];
  idx: number;
  selected: boolean;
  onSelect: (idx: number) => void;
  selectable?: boolean;
  showCheckButton?: boolean;
}

export default function DataGridRow({
  row,
  idx,
  selected,
  onSelect,
  selectable,
}: DataGridRowProps) {
  return (
    <tr
      className={selected ? styles.selectedRow : undefined}
      onClick={() => onSelect(idx)}
      style={{ cursor: "pointer" }}
    >
      {selectable && (
        <td className={styles.dataGridTableTdCheckbox}>
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => {
              e.stopPropagation(); // evita duplo disparo
              onSelect(idx);
            }}
          />
        </td>
      )}
      {row.map((cell, cidx) => (
        <td key={cidx} className={styles.dataGridTableTd}>
          {cell}
        </td>
      ))}
    </tr>
  );
}
