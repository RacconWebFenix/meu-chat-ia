import React, { useEffect } from "react";
import styles from "./UserSearchTable.module.scss";
import { useSelectedGridContext } from "@/app/providers";

interface UserSearchTableProps {
  inputHeaders: string[];
  inputRows: string[]; // cada linha é um array de strings
}

export default function UserSearchTable({
  inputHeaders,
  inputRows,
}: UserSearchTableProps) {
  const { setInputHeaders, setInputRows } = useSelectedGridContext();

  useEffect(() => {
    setInputHeaders(inputHeaders);
    setInputRows(inputRows);
  }, [inputHeaders, inputRows, setInputHeaders, setInputRows]);

  return (
    <div className={styles.userSearchTableContainer}>
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
                <td key={cellIdx}>{cell}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
