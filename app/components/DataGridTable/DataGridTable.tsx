import React, { useState, ReactNode, ReactElement } from "react";
import styles from "./DataGridTable.module.scss";

function isReactElementWithProps(element: unknown): element is ReactElement<{
  style: any;
  children?: ReactNode;
}> {
  return React.isValidElement(element) && typeof element.props === "object";
}

interface DataGridTableProps {
  children: ReactNode;
  userInputHeaders?: string[];
  userInputRow?: (string | undefined)[];
}

export default function DataGridTable({
  children,
  userInputHeaders,
  userInputRow,
}: DataGridTableProps) {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userInputSelected, setUserInputSelected] = useState(false);

  // Converte children para array de linhas
  const rows = React.Children.toArray(children);

  // Extrai cabeçalho e corpo
  const header = rows.find(
    (row): row is ReactElement<any, any> =>
      React.isValidElement(row) && row.type === "thead"
  );
  const body = rows.find(
    (row): row is ReactElement<any, any> =>
      React.isValidElement(row) && row.type === "tbody"
  );

  // Extrai dados das linhas do corpo (tipagem correta)
  const bodyRows: ReactElement<any, any>[] =
    body && body.props && body.props.children
      ? (React.Children.toArray(body.props.children).filter(
          React.isValidElement
        ) as ReactElement<any, any>[])
      : [];

  // Extrai os dados das células para exibir ao selecionar
  const getRowData = (row: ReactElement<any, any>): ReactNode[] =>
    React.Children.toArray(row.props.children).map((cell) => {
      if (isReactElementWithProps(cell) && cell.props.children !== undefined) {
        return cell.props.children;
      }
      return cell;
    });

  // Extrai cabeçalhos das colunas
  const columnHeaders: string[] =
    header &&
    React.Children.toArray(header.props.children)[0] &&
    React.isValidElement(React.Children.toArray(header.props.children)[0])
      ? (React.Children.toArray(
          (
            React.Children.toArray(header.props.children)[0] as ReactElement<
              any,
              any
            >
          ).props.children
        )
          .filter(React.isValidElement)
          .map(
            (cell) => (cell as ReactElement<any, any>).props.children as string
          ) as string[])
      : [];

  // Manipula seleção de linhas
  const handleCheckboxChange = (idx: number) => {
    setSelectedRows((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // Dados das linhas selecionadas
  const selectedRowsData: ReactNode[][] = selectedRows.map((idx) =>
    getRowData(bodyRows[idx])
  );

  // Função para salvar
  const handleSave = () => {
    const objetosSelecionados: any[] = [];

    // Adiciona a linha do usuário se selecionada
    if (userInputSelected && userInputHeaders && userInputRow) {
      const obj: Record<string, unknown> = {};
      userInputHeaders.forEach((header, idx) => {
        obj[header] = userInputRow[idx];
      });
      objetosSelecionados.push(obj);
    }

    // Adiciona as linhas selecionadas da tabela principal
    selectedRowsData.forEach((row) => {
      const obj: Record<string, unknown> = {};
      columnHeaders.forEach((header: string, idx: number) => {
        obj[header] = row[idx];
      });
      objetosSelecionados.push(obj);
    });

    console.log("Linhas selecionadas:", objetosSelecionados);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className={styles.dataGridTableContainer}>
      {/* Tabela do usuário (prompt) */}
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

      {/* Tabela principal */}
      <table className={styles.dataGridTable}>
        <thead>
          <tr>
            <th className={styles.dataGridTableTh}></th>
            {columnHeaders.map((header, i) => (
              <th key={i} className={styles.dataGridTableTh}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, idx) => (
            <tr
              key={idx}
              className={
                selectedRows.includes(idx) ? styles.selectedRow : undefined
              }
            >
              <td className={styles.dataGridTableTdCheckbox}>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(idx)}
                  onChange={() => handleCheckboxChange(idx)}
                />
              </td>
              {React.Children.map(row.props.children, (cell) => {
                if (
                  React.isValidElement(cell) &&
                  typeof cell.type === "string" &&
                  ["td", "th"].includes(cell.type)
                ) {
                  return React.cloneElement(
                    cell as React.ReactElement<
                      React.HTMLAttributes<HTMLElement>
                    >,
                    {
                      className: styles.dataGridTableTd,
                    }
                  );
                }
                return cell;
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Linhas selecionadas e botão salvar */}
      {(selectedRows.length > 0 || userInputSelected) && (
        <div className={styles.selectedRowsContainer}>
          <strong className={styles.selectedRowsTitle}>
            Linhas selecionadas:
          </strong>
          {/* Aviso personalizado */}
          <div className={styles.selectedRowsInfo}>
            Você selecionou {selectedRows.length + (userInputSelected ? 1 : 0)}{" "}
            linha
            {selectedRows.length + (userInputSelected ? 1 : 0) !== 1 ? "s" : ""}
            .
          </div>
          <table className={styles.dataGridTable}>
            <thead>
              <tr>
                {columnHeaders.map((header, i) => (
                  <th key={i} className={styles.dataGridTableTh}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Apenas linhas da tabela principal selecionadas */}
              {selectedRowsData.map((row, idx) => (
                <tr key={idx}>
                  {row.map((cell, cidx) => (
                    <td key={cidx} className={styles.dataGridTableTd}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button className={styles.saveButton} onClick={handleSave}>
            Salvar
          </button>
          {showSuccess && (
            <div className={styles.successMessage}>
              Dados cadastrados com sucesso
            </div>
          )}
        </div>
      )}
    </div>
  );
}
