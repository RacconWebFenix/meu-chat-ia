"use client";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./DataGridSelectedRows.module.scss";
import { useRouter } from "next/navigation";
import { useGrid } from "@/contexts";
import { GridRow } from "@/types";
import ChatLoading from "../../ChatLoading";
import CustomButton from "../../CustomButton";

interface TableColumn {
  name: string;
  displayName?: string;
}

interface DataGridSelectedRowsProps {
  columns: string[] | TableColumn[];
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
  const { setSelectedGrid } = useGrid();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);

  // Funções auxiliares para trabalhar com columns como string[] ou TableColumn[]
  const getColumnName = (column: string | TableColumn): string => {
    return typeof column === "string" ? column : column.name;
  };

  const getColumnDisplayName = (column: string | TableColumn): string => {
    if (typeof column === "string") {
      return column;
    }
    return column.displayName || column.name;
  };

  // Junta as linhas selecionadas e a linha de input do usuário (se houver)
  const linhasSelecionadas = useMemo(
    () => [
      ...(userInputSelected && userInputRow ? [userInputRow] : []),
      ...selectedRows.map((rowIdx) => data[rowIdx]),
    ],
    [userInputSelected, userInputRow, selectedRows, data]
  );

  const handleValidar = () => {
    setIsButtonDisabled(true);
    setShowLoadingOverlay(true);
    router.push("/validar-informacoes");
  };

  useEffect(() => {
    if (linhasSelecionadas.length > 0) {
      const allObjs: GridRow[] = linhasSelecionadas.map((linha) => {
        return Object.fromEntries(
          columns.map((column, i) => [getColumnName(column), String(linha[i])])
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
      {showLoadingOverlay && (
        <ChatLoading className={styles.fullScreenOverlay} />
      )}
      <strong>Linha(s) selecionada(s):</strong>
      <table className={styles.dataGridTable}>
        <thead>
          <tr>
            {columns.map((column, i) => (
              <th key={i} className={styles.dataGridTableTh}>
                {getColumnDisplayName(column)}
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
        <CustomButton
          onClick={handleValidar}
          colorType="primary"
          variant="contained"
          sx={{
            mt: 2,
            py: 1.5,
            fontSize: 16,
            fontWeight: 700,
            background: (theme) => theme.palette.primary.main,
            color: (theme) => theme.palette.primary.contrastText,
            "&:hover": {
              background: (theme) => theme.palette.primary.dark,
            },
          }}
          disabled={isButtonDisabled}
        >
          Pesquisa Avançada
        </CustomButton>
      )}
    </div>
  );
}
