import React, { useEffect } from "react";
import styles from "./UserSearchTable.module.scss";
import { useGrid } from "@/contexts/GridContext";

interface UserSearchTableProps {
  inputHeaders: string[];
  inputRows: string[];
}

export default function UserSearchTable({
  inputHeaders,
  inputRows,
}: UserSearchTableProps) {
  const { setInputHeaders, setInputRows } = useGrid();

  useEffect(() => {
    setInputHeaders(inputHeaders);
    setInputRows(inputRows);
  }, [inputHeaders, inputRows, setInputHeaders, setInputRows]);

  return (
    <div className={styles.container}>
      <table className={styles.userInputTable}>
        <thead>
          <tr>
            {inputHeaders?.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {inputRows.map((cell, cellIdx) => (
              <td key={cellIdx} className={styles.userInputTableTdCheckbox}>
                <span className={styles.cellText}>{cell}</span>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
