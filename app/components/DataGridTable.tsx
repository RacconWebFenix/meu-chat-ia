import React, { useState } from "react";

export default function DataGridTable({ children }: { children: React.ReactNode }) {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Converte children para array de linhas
  const rows = React.Children.toArray(children);

  // Extrai cabeçalho e corpo
  const header = rows.find((row) => React.isValidElement(row) && row.type === "thead") as React.ReactElement | undefined;
  const body = rows.find((row) => React.isValidElement(row) && row.type === "tbody") as React.ReactElement | undefined;

  // Extrai dados das linhas do corpo
  const bodyRows = body
    ? React.Children.toArray((body as any).props.children)
    : [];

   

  // Extrai os dados das células para exibir ao selecionar
  const getRowData = (row: any) =>
    React.Children.toArray(row.props.children).map(
      (cell: any) => cell.props.children
    );

  // Extrai cabeçalhos das colunas
  const columnHeaders = header
    ? (
        React.Children.toArray((header as any).props.children)[0] &&
        React.isValidElement(
          React.Children.toArray((header as any).props.children)[0]
        )
          ? React.Children.toArray(
              ((React.Children.toArray((header as any).props.children)[0]) as React.ReactElement<any, any>)
                .props.children
            )
              .filter(React.isValidElement)
              .map((cell: any) => cell.props.children)
          : []
      )
    : [];

  // Manipula seleção de linhas
  const handleCheckboxChange = (idx: number) => {
    setSelectedRows((prev) =>
      prev.includes(idx)
        ? prev.filter((i) => i !== idx)
        : [...prev, idx]
    );
  };

  // Dados das linhas selecionadas
  const selectedRowsData = selectedRows.map((idx) => getRowData(bodyRows[idx]));

  // Função para salvar
  const handleSave = () => {
    const objetosSelecionados = selectedRowsData.map((row) => {
      const obj: Record<string, any> = {};
      columnHeaders.forEach((header: string, idx: number) => {
        // Se for o campo Fabricante e for um React element, pega só o children
        if (
          typeof header === "string" &&
          header.trim().toLowerCase() === "fabricante"
        ) {
          const cell = row[idx];
          if (React.isValidElement(cell)) {
            if (React.isValidElement(cell)) {
              obj[header] = React.isValidElement(cell) ? ((cell as React.ReactElement<any, any>).props.children) : cell;
            } else {
              obj[header] = cell;
            }
          } else {
            obj[header] = cell;
          }
        } else {
          obj[header] = row[idx];
        }
      });
      return obj;
    });
    console.log("Linhas selecionadas:", objetosSelecionados);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div style={{ overflowX: "auto", margin: "16px 0" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          color: "#111",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          borderRadius: 8,
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px", background: "#f3f3f3" }}></th>
            {columnHeaders.map((header: any, i: number) => (
              <th
                key={i}
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  background: "#f3f3f3",
                  fontWeight: "bold",
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row: any, idx: number) => (
            <tr
              key={idx}
              style={{
                background: selectedRows.includes(idx) ? "#e3f2fd" : undefined,
              }}
            >
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedRows.includes(idx)}
                  onChange={() => handleCheckboxChange(idx)}
                />
              </td>
              {React.Children.map(row.props.children, (cell: any, cidx: number) =>
                React.cloneElement(cell, {
                  style: {
                    ...cell.props.style,
                    border: "1px solid #ccc",
                    padding: "8px",
                  },
                })
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedRows.length > 0 && (
        <div
          style={{
            marginTop: 24,
            padding: 12,
            background: "#f5f5f5",
            borderRadius: 6,
            border: "1px solid #ddd",
          }}
        >
          <strong style={{color: "GrayText"}}>Linhas selecionadas:</strong>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
              color: "#111",
              marginTop: 8,
            }}
          >
            <thead>
              <tr>
                {columnHeaders.map((header: any, i: number) => (
                  <th
                    key={i}
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      background: "#f3f3f3",
                      fontWeight: "bold",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedRowsData.map((row, idx) => (
                <tr key={idx}>
                  {row.map((cell: any, cidx: number) => (
                    <td
                      key={cidx}
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        color: "#111",
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button
            style={{
              marginTop: 16,
              padding: "8px 24px",
              background: "#2196f3",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={handleSave}
          >
            Salvar
          </button>
          {showSuccess && (
            <div
              style={{
                marginTop: 12,
                color: "#388e3c",
                background: "#e8f5e9",
                padding: "8px 16px",
                borderRadius: 4,
                fontWeight: "bold",
              }}
            >
              Dados cadastrados com sucesso
            </div>
          )}
        </div>
      )}
    </div>
  );
}