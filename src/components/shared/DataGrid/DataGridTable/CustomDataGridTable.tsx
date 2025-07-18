import React, { useMemo } from "react";
import styles from "./CustomDataGridTable.module.scss";

interface CustomDataGridTableProps {
  columns: string[];
  data: (string | number | React.ReactNode)[][];
  onRowSelect?: (rowIndex: number) => void;
}

const CustomDataGridTable: React.FC<CustomDataGridTableProps> = ({
  columns,
  data,
  onRowSelect,
}) => {
  const renderedRows = useMemo(() => {
    return data.map((row, rowIndex) => (
      <tr key={rowIndex} onClick={() => onRowSelect?.(rowIndex)}>
        {row.map((cell, cellIndex) => (
          <td key={cellIndex}>{cell}</td>
        ))}
      </tr>
    ));
  }, [data, onRowSelect]);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>{renderedRows}</tbody>
    </table>
  );
};

export default React.memo(CustomDataGridTable);
