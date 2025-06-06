import React, { useState } from "react";

import styles from "./DataGridTable.module.scss";
import { DataGridTableProps } from "../shared/DataGrid/types";
import DataGridHeader from "../shared/DataGrid/DataGridHeader";
import DataGridBody from "../shared/DataGrid/DataGridBody";
import DataGridSelectedRows from "../shared/DataGrid/DataGridSelectedRows";

export default function DataGridTable({
  columns,
  data,
  selectable = true,
  onSelectionChange,
  userInputHeaders,
  userInputRow,
}: DataGridTableProps) {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [userInputSelected, setUserInputSelected] = useState(false);

  const handleRowSelect = (idx: number) => {
    setSelectedRows((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
    onSelectionChange?.(selectedRows);
  };

  return (
    <div className={styles.dataGridTableContainer}>
      {/* User input table (opcional) */}
      {userInputHeaders && userInputRow && (
        <div className={styles.userInputTableWrapper}>
          <strong className={styles.userInputTitle}>Pesquisa:</strong>
          <table className={styles.dataGridTable}>
            <thead>
              <tr>
                <th className={styles.dataGridTableTh}></th>
                {userInputHeaders.map((header, i) => (
                  <th key={i} className={styles.dataGridTableTh}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.dataGridTableTdCheckbox}>
                  <input
                    type="checkbox"
                    checked={userInputSelected}
                    onChange={() => setUserInputSelected((v) => !v)}
                  />
                </td>
                {userInputRow.map((cell, idx) => (
                  <td key={idx} className={styles.dataGridTableTd}>
                    {cell}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <table className={styles.dataGridTable}>
        <DataGridHeader columns={columns} selectable={selectable} />
        <DataGridBody
          data={data}
          selectedRows={selectedRows}
          onRowSelect={handleRowSelect}
          selectable={selectable}
        />
      </table>

      <DataGridSelectedRows
        columns={columns}
        data={data}
        selectedRows={selectedRows}
        userInputRow={userInputRow}
        userInputSelected={userInputSelected}
      />
    </div>
  );
}
