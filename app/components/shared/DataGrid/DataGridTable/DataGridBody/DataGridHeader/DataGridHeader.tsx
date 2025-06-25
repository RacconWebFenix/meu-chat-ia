import React from "react";
import styles from "./DataGridHeader.module.scss";

export default function DataGridHeader({
  columns,
  selectable,
}: {
  columns: string[];
  selectable?: boolean;
}) {
  return (
    <thead>
      <tr>
        {selectable && <th className={styles.dataGridTableTh}></th>}
        {columns.map((header, i) => (
          <th key={i} className={styles.dataGridTableTh}>
            {header}
          </th>
        ))}
     
      </tr>
    </thead>
  );
}
