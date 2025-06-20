"use client";
import React, { useContext, useEffect, useMemo } from "react";
import styles from "./DataGridSelectedRows.module.scss";
import { useRouter } from "next/navigation";
import { SelectGridContext } from "@/app/providers";

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
  const { setValor } = useContext(SelectGridContext);

  // Junta as linhas selecionadas e a linha de input do usuário (se houver)
  const linhasSelecionadas = useMemo(
    () => [
      ...(userInputSelected && userInputRow ? [userInputRow] : []),
      ...selectedRows.map((rowIdx) => data[rowIdx]),
    ],
    [userInputSelected, userInputRow, selectedRows, data]
  );

  // Converte ReactNode para string para garantir serialização
  function serializarLinha(
    linha: (string | number | React.ReactNode)[]
  ): (string | number)[] {
    return linha.map((cell) => {
      if (typeof cell === "string" || typeof cell === "number") return cell;
      if (React.isValidElement(cell)) return "[Elemento]";
      return String(cell);
    });
  }

  const handleValidar = () => {
    // Aqui você pode passar as linhas selecionadas e headers via query params, localStorage, etc.
    // Exemplo: salvar no localStorage
    localStorage.setItem(
      "linhasSelecionadas",
      JSON.stringify(linhasSelecionadas.map(serializarLinha))
    );
    localStorage.setItem("headersSelecionados", JSON.stringify(columns));
    router.push("/validar-informacoes");
  };

  useEffect(() => {
    if (linhasSelecionadas.length > 0) {
      const keys = columns;
      const allObjs = linhasSelecionadas.map((linha) => {
        const values = serializarLinha(linha);
        return Object.fromEntries(
          keys.map((key, i) => [key, String(values[i])])
        );
      });
      setValor(JSON.stringify(allObjs));
    }
  }, [linhasSelecionadas, columns, setValor]);

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
