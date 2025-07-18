import React from "react";
import styles from "./DataGridHeader.module.scss";

interface TableColumn {
  name: string;
  displayName?: string;
}

export default function DataGridHeader({
  columns,
  selectable,
}: {
  columns: string[] | TableColumn[];
  selectable?: boolean;
}) {
  const getColumnDisplayName = (column: string | TableColumn): string => {
    if (typeof column === "string") {
      return column;
    }
    return column.displayName || column.name;
  };

  return (
    <thead>
      <tr>
        {selectable && <th className={styles.dataGridTableTh}></th>}
        {columns.map((column, i) => (
          <th key={i} className={styles.dataGridTableTh}>
            {getColumnDisplayName(column)}
          </th>
        ))}
      </tr>
    </thead>
  );
}
