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
  showCheckButton = true,
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
      <td>
        {showCheckButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const search = row
                .filter((v) => typeof v === "string" || typeof v === "number")
                .join(" ");
              window.open(
                `https://www.google.com/search?q=${encodeURIComponent(search)}`,
                "_blank"
              );
            }}
          >
            Checar
          </button>
        )}
      </td>
    </tr>
  );
}
