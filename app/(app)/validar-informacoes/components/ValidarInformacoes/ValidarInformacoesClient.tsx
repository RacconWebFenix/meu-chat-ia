"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import InfoTable from "../InfoTable/InfoTable";
import { parseSelectedRows } from "../../utils/parseSelectedRows";
import styles from "./ValidarInformacoesClient.module.scss";
import DataGridTable from "@/app/components/shared/DataGrid/DataGridTable";
import { extractExplanationAndTable } from "@/app/Utils/extractExplanationAndTable";
import { parseMarkdownTable } from "@/app/Utils/parseMarkdownTable";
import { useSelectedGridContext } from "@/app/providers";
import { CitationList } from "../CitationList/CitationList";
import { ImagesBlock } from "../ImagesBlock/ImagesBlock";
import ChatLoading from "@/app/components/shared/ChatLoading/ChatLoading";

// Tipos para resposta da API Perplexity
interface PerplexityImage {
  image_url: string;
  origin_url: string;
  height?: number;
  width?: number;
}

interface PerplexitySearchResult {
  title: string;
  url: string;
  date: string | null;
}

interface PerplexityChoice {
  index: number;
  finish_reason: string;
  message: {
    role: string;
    content: string;
    delta?: {
      role: string;
      content: string;
    };
  };
}

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
  search_results: PerplexitySearchResult[];
  images: PerplexityImage[];
  object: string;
  choices: PerplexityChoice[];
}

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
    try {
      const response = await fetch("tt/api/perplexity", {
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
      setLoading(true);
    }
  };

  // Utilidades para extrair texto e tabela
  let explanation = "";
  let table = null;
  let images: PerplexityImage[] = [];
  let citations: string[] = [];
  if (
    result &&
    Array.isArray(result) &&
    result[0]?.choices?.[0]?.message?.content
  ) {
    try {
      const { explanation: exp, table: tbl } = extractExplanationAndTable(
        result[0].choices[0].message.content
      );
      explanation = exp;
      if (tbl) {
        const parsed = parseMarkdownTable(tbl);
        if (parsed) table = parsed;
      }
      images = result[0].images || [];
      citations = result[0].citations || [];
    } catch {}
  }

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
            {table && (
              <div>
                <strong>Tabela:</strong>
                <DataGridTable
                  columns={table.columns}
                  data={table.data}
                  showValidateButton={false}
                />
              </div>
            )}
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
          </div>
        )}
      </div>
    </div>
  );
}
