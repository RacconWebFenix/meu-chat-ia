import React, { useState } from "react";
import styles from "./CustomGridTable.module.scss";

interface CustomGridTableProps {
  columns: string[];
  data: (string | number | React.ReactNode)[][];
  onSelectionChange?: (selectedRows: number[]) => void;
}

const CustomGridTable: React.FC<CustomGridTableProps> = ({
  columns,
  data,
  onSelectionChange,
}) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const handleRowSelect = (idx: number) => {
    setSelectedRows((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
    onSelectionChange?.(selectedRows);
  };

  return (
    <div className={styles.customGridTableContainer}>
      <table className={styles.customGridTable}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={
                selectedRows.includes(rowIndex) ? styles.selectedRow : ""
              }
              onClick={() => handleRowSelect(rowIndex)}
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomGridTable;
