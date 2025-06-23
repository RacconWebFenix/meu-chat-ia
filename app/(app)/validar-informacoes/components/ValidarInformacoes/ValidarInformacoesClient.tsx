"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import InfoTable from "../InfoTable/InfoTable";
import { parseSelectedRows } from "../../utils/parseSelectedRows";
import styles from "./ValidarInformacoesClient.module.scss";

import { extractExplanationAndTable } from "@/app/Utils/extractExplanationAndTable";
import { useSelectedGridContext } from "@/app/providers";
import { CitationList } from "../CitationList/CitationList";
import { ImagesBlock } from "../ImagesBlock/ImagesBlock";
import ChatLoading from "@/app/components/shared/ChatLoading/ChatLoading";
import { perplexityMock } from "@/app/mocks/perplexity.mock";
import CustomGrid from "@/app/components/shared/CustomGrid/CustomGrid";
import CustomGridTable from "@/app/components/shared/CustomGrid/CustomGridTable";
import { parseMarkdownTable } from "@/app/Utils/parseMarkdownTable";

// Tipos para resposta da API Perplexity
interface PerplexityImage {
  image_url: string;
  origin_url: string;
  height?: number;
  width?: number;
}

// Atualização do tipo PerplexityResult para incluir choices corretamente
interface PerplexityResult {
  id: string;
  model: string;
  created: number;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    search_context_size: string;
  };
  citations: string[];
  search_results: {
    title: string;
    url: string;
    date: string | null;
  }[];
  images: {
    image_url: string;
    origin_url: string;
    height?: number;
    width?: number;
  }[];
  choices: {
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
  }[];
}

const USE_MOCK = true; // Toggle between mock and real API

export default function ValidarInformacoesClient({}) {
  const router = useRouter();

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRowData, setSelectedRowData] = useState<Record<
    string,
    string
  > | null>(null); // State for selected row data
  const [result, setResult] = useState<PerplexityResult[] | null>(null);

  const { selectedGrid } = useSelectedGridContext();

  const dataArr = parseSelectedRows(selectedGrid) || [];

  const handleRowSelect = (rowIdx: number) => {
    setSelectedRows([rowIdx]);
    setSelectedRowData(dataArr[rowIdx] || null); // Update selected row data
  };

  const handleValidar = async () => {
    setLoading(true);
    setError(null);
    if (USE_MOCK) {
      setResult(perplexityMock);
      setLoading(false);
      return;
    } else {
      try {
        const response = await fetch("/api/perplexity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedRowData),
        });

        const apiResult = await response.json();
        if (!response.ok) throw new Error(apiResult.error || "Erro ao validar");
        setResult(apiResult.received); // Salva o resultado retornado
      } catch {
        setError("Erro inesperado");
      } finally {
        setLoading(false);
      }
    }
  };

  // Utilidades para extrair texto e tabela
  let explanation = "";
  let images: PerplexityImage[] = [];
  let citations: string[] = [];
  if (
    result &&
    Array.isArray(result) &&
    result[0]?.choices?.[0]?.message?.content
  ) {
    try {
      const { explanation: exp } = extractExplanationAndTable(
        result[0].choices[0].message.content
      );
      explanation = exp;
      images = result[0].images || [];
      citations = result[0].citations || [];
    } catch {}
  }

  // Ajuste para tratar `result` como um único objeto PerplexityResult
  const gridItems =
    result?.[0]?.search_results.map((item) => ({
      id: item.title,
      content: item.title || "Sem título",
    })) || [];

  // Integração da variável `parsedData`
  const markdownContent = result?.[0]?.choices?.[0]?.message?.content || "";
  const parsedTable = parseMarkdownTable(markdownContent);

  // Separar tabela e texto
  const explanationText = markdownContent
    .split("\n")
    .filter((line) => !line.includes("|"));
  const columns = parsedTable?.columns || [];
  const data = parsedTable?.data.slice(0, 1) || []; // Apenas uma linha na tabela

  return (
    <div>
      <h1 className={styles.title}>Validação das Informações</h1>
      <div className={styles.mainContainer}>
        {loading ? (
          <ChatLoading />
        ) : (
          <>
            <InfoTable
              data={dataArr}
              selectedRows={selectedRows}
              onRowSelect={handleRowSelect}
            />
            {images.length > 0 && <ImagesBlock images={images} />}
            {citations.length > 0 && <CitationList citations={citations} />}

            {explanation && (
              <div style={{ marginBottom: 16 }}>
                <strong>Explicação:</strong>
                <div>{explanation}</div>
              </div>
            )}

            <CustomGrid
              items={gridItems}
              onItemClick={(id) => console.log(`Item ${id} clicked`)}
            />
            <CustomGridTable
              columns={columns}
              data={data}
              onSelectionChange={(selectedRows) => console.log(selectedRows)}
            />
          </>
        )}
        <button
          onClick={handleValidar}
          className={styles.dpButton}
          disabled={loading || selectedRows.length === 0} // Disable if loading or no rows selected
          style={{ marginRight: 12 }}
        >
          Validar
        </button>
        <button
          onClick={() => {
            router.push("/");
          }}
          className={styles.dpButton}
        >
          Voltar
        </button>
        {error && <div className={styles.errorMsg}>{error}</div>}
        {result && (
          <div style={{ marginTop: 24 }}>
            {explanation && (
              <div style={{ marginBottom: 16 }}>
                <strong>Explicação:</strong>
                <div>{explanation}</div>
              </div>
            )}
            {columns.length > 0 && data.length > 0 && (
              <table className={styles.dataGridTable}>
                <thead>
                  <tr>
                    {columns.map((column, index) => (
                      <th key={index}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
