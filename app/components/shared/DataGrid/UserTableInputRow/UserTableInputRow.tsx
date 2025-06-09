import React from "react";
import styles from "./UserTableInputRow.module.scss";

interface UserTableInputRowProps {
  headers: string[];
  row: (string | number | React.ReactNode)[];
  selected: boolean;
  onSelect: () => void;
}

export default function UserTableInputRow({
  headers,
  row,
  selected,
  onSelect,
}: UserTableInputRowProps) {
  return (
    <div className={styles.userInputTableWrapper}>
      <strong className={styles.userInputTitle}>Pesquisa:</strong>
      <table className={styles.userInputTable}>
        <thead>
          <tr>
            <th className={styles.dataGridTableTh}></th>
            {headers.map((header, i) => (
              <th key={i} className={styles.dataGridTableTh}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr
            className={selected ? styles.selectedRow : undefined}
            onClick={onSelect}
            style={{ cursor: "pointer" }}
          >
            <td className={styles.dataGridTableTdCheckbox}>
              <input
                type="checkbox"
                checked={selected}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
              />
            </td>
            {row.map((cell, idx) => (
              <td key={idx} className={styles.dataGridTableTd}>
                {cell}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
