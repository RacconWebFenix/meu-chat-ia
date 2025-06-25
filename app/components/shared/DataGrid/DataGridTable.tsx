import React, { useState } from "react";

import { DataGridTableProps } from "./types";
import DataGridHeader from "./DataGridTable/DataGridBody/DataGridHeader/DataGridHeader";
import DataGridBody from "./DataGridTable/DataGridBody/DataGridBody";
import DataGridSelectedRows from "./DataGridSelectedRows/DataGridSelectedRows";
import styles from "./DataGridTable.module.scss";

export default function DataGridTable({
  columns,
  data,
  selectable = true,
  onSelectionChange,

  showCheckButton = true,
  showValidateButton = true,
}: DataGridTableProps & {
  showCheckButton?: boolean;
  showValidateButton?: boolean;
}) {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const handleRowSelect = (idx: number) => {
    setSelectedRows((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
    onSelectionChange?.(selectedRows);
  };

  return (
    <>
      <div className={styles.dataGridTableContainer}>
        <table className={styles.dataGridTable}>
          <DataGridHeader columns={columns} selectable={selectable} />
          <DataGridBody
            data={data}
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            selectable={selectable}
            showCheckButton={showCheckButton}
          />
        </table>
        <div className={styles.selectedRowsContainer}>
          <DataGridSelectedRows
            columns={columns}
            data={data}
            selectedRows={selectedRows}
            showValidateButton={showValidateButton}
          />
        </div>
      </div>
    </>
  );
}
