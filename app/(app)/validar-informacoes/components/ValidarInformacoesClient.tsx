import React from "react";
import { parseMarkdownTable } from "@/app/Utils/parseMarkdownTable";
import styles from "./YourComponent.module.css";

// Definição do tipo YourComponentProps
interface YourComponentProps {
  result: Array<{
    choices: Array<{
      message: {
        content: string;
      };
    }>;
  }>;
}

const YourComponent: React.FC<YourComponentProps> = ({ result }) => {
  // Ajuste para usar diretamente o texto de `explanation`
  const markdownContent = result?.[0]?.choices?.[0]?.message?.content || "";
  const parsedTable = parseMarkdownTable(markdownContent);

  // Separar tabela e texto
  const explanation = markdownContent
    .split("\n")
    .filter((line: string) => !line.includes("|"));
  const columns = parsedTable?.columns || [];
  const data = parsedTable?.data.slice(0, 1) || []; // Apenas uma linha na tabela

  return (
    <div>
      <h1 className={styles.title}>Validação das Informações</h1>
      <div className={styles.explanation}>{explanation.join("\n")}</div>
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

export default YourComponent;
