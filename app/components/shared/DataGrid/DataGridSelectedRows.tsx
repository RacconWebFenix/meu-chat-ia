import React from "react";
import styles from "./DataGridTable.module.scss";

interface DataGridSelectedRowsProps {
  columns: string[];
  data: (string | number | React.ReactNode)[][];
  selectedRows: number[];
  userInputRow?: (string | number | React.ReactNode)[];
  userInputSelected?: boolean;
}

export default function DataGridSelectedRows({
  columns,
  data,
  selectedRows,
  userInputRow,
  userInputSelected,
}: DataGridSelectedRowsProps) {
  // Exemplo: mostra as linhas selecionadas e a linha de input do usuário, se marcada
  if ((!selectedRows || selectedRows.length === 0) && !userInputSelected) {
    return null;
  }

  return (
    <div className={styles.selectedRowsContainer}>
      <strong>Linha(s) selecionada(s):</strong>
      <table className={styles.dataGridTable}>
        <thead>
          <tr>
            {columns.map((header, i) => (
              <th key={i} className={styles.dataGridTableTh}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {userInputSelected && userInputRow && (
            <tr>
              {userInputRow.map((cell, idx) => (
                <td key={idx} className={styles.dataGridTableTd}>
                  {cell}
                </td>
              ))}
            </tr>
          )}
          {selectedRows.map((rowIdx) => (
            <tr key={rowIdx}>
              {data[rowIdx].map((cell, idx) => (
                <td key={idx} className={styles.dataGridTableTd}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
