import React from "react";
import { parseMarkdownTable } from "@/app/Utils/parseMarkdownTable";
import styles from "./YourComponent.module.css";

// Definição do tipo YourComponentProps
interface ValidarInformacoesTableProps {
  result: Array<{
    choices: Array<{
      message: {
        content: string;
      };
    }>;
  }>;
}

const ValidarInformacoesTable: React.FC<ValidarInformacoesTableProps> = ({
  result,
}) => {
  // Ajuste para usar diretamente o texto de `explanation`
  const markdownContent = result?.[0]?.choices?.[0]?.message?.content || "";
  const tableRegex = /\|.+\|\n/g;
  const tableMatches = markdownContent.match(tableRegex);

  let explanation = markdownContent;
  let columns: string[] = [];
  let data: string[][] = [];

  if (tableMatches) {
    tableMatches.forEach((tableMarkdown) => {
      const parsedTable = parseMarkdownTable(tableMarkdown);
      columns = parsedTable?.columns || [];
      data = [...data, ...(parsedTable?.data || [])];

      explanation = explanation.replace(tableMarkdown, "").trim();
    });
  }

  // Remove caracteres especiais e formata o texto
  explanation = explanation
    .replace(/\[\d+\]/g, "") // Remove referências como [1], [2], etc.
    .replace(/\*\*/g, "") // Remove asteriscos duplos
    .replace(/[#*\-]/g, "") // Remove caracteres especiais como #, *, -
    .replace(/\s+/g, " ") // Remove espaços extras
    .trim();

  return (
    <div>
      <h1 className={styles.title}>Validação das Informações</h1>
      <div className={styles.explanation}>{explanation}</div>
      {columns.length > 0 && data.length > 0 && (
        <table className={styles.dataGridTable}>
          <thead>
            <tr>
              {columns.map((column: string, index: number) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row: string[], rowIndex: number) => (
              <tr key={rowIndex}>
                {row.map((cell: string, cellIndex: number) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ValidarInformacoesTable;
