"use client";
import React, { useContext, useEffect, useMemo } from "react";
import styles from "./DataGridSelectedRows.module.scss";
import { useRouter } from "next/navigation";
import { SelectGridContext, GridRow } from "@/app/providers";

interface DataGridSelectedRowsProps {
  columns: string[];
  data: (string | number | React.ReactNode)[][];
  selectedRows: number[];
  userInputRow?: (string | number | React.ReactNode)[];
  userInputSelected?: boolean;
  showValidateButton?: boolean;
}

export default function DataGridSelectedRows({
  columns,
  data,
  selectedRows,
  userInputRow,
  userInputSelected,
  showValidateButton = true,
}: DataGridSelectedRowsProps) {
  const router = useRouter();
  // Obtém o contexto para manipular as linhas selecionadas
  const { setSelectedGrid } = useContext(SelectGridContext);

  // Junta as linhas selecionadas e a linha de input do usuário (se houver)
  const linhasSelecionadas = useMemo(
    () => [
      ...(userInputSelected && userInputRow ? [userInputRow] : []),
      ...selectedRows.map((rowIdx) => data[rowIdx]),
    ],
    [userInputSelected, userInputRow, selectedRows, data]
  );

  const handleValidar = () => {
    router.push("/validar-informacoes");
  };

  useEffect(() => {
    if (linhasSelecionadas.length > 0) {
      const allObjs: GridRow[] = linhasSelecionadas.map((linha) => {
        return Object.fromEntries(
          columns.map((key, i) => [key, String(linha[i])])
        );
      });
      setSelectedGrid(allObjs);
    } else {
      setSelectedGrid([]);
    }
  }, [linhasSelecionadas, columns, setSelectedGrid]);

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
      {/* Botão para validar informações */}
      {showValidateButton && linhasSelecionadas.length > 0 && (
        <button style={{ marginTop: 16 }} onClick={handleValidar}>
          Validar informações
        </button>
      )}
    </div>
  );
}
