import React, { useState } from "react";

import { DataGridTableProps } from "./types";
import DataGridHeader from "./DataGridTable/DataGridBody/DataGridHeader/DataGridHeader";
import DataGridBody from "./DataGridTable/DataGridBody/DataGridBody";
import DataGridSelectedRows from "./DataGridSelectedRows/DataGridSelectedRows";
import UserTableInputRow from "./UserTableInputRow/UserTableInputRow";
import styles from "./DataGridTable.module.scss";

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
        <UserTableInputRow
          headers={userInputHeaders}
          row={userInputRow}
          selected={userInputSelected}
          onSelect={() => setUserInputSelected((v) => !v)}
        />
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
