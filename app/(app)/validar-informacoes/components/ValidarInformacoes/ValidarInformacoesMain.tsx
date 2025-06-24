"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import InfoTable from "../InfoTable/InfoTable";
import { parseSelectedRows } from "../../utils/parseSelectedRows";
import styles from "./ValidarInformacoesMain.module.scss";
import { useSelectedGridContext } from "@/app/providers";
import { CitationList } from "../CitationList/CitationList";
import { ImagesBlock } from "../ImagesBlock/ImagesBlock";
import ChatLoading from "@/app/components/shared/ChatLoading/ChatLoading";
import { perplexityMock } from "@/app/mocks/perplexity.mock";
import CustomGridTable from "@/app/components/shared/CustomGrid/CustomGridTable";
import { parseMarkdownTable } from "@/app/Utils/parseMarkdownTable";
import ExplicacaoCard from "../ExplicacaoCard/ExplicacaoCard";

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

const USE_MOCK = false; // Toggle between mock and real API

export default function ValidarInformacoesMain({}) {
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

  const content = result?.[0]?.choices?.[0]?.message?.content;

  const tableRegex = /(\|.+\|\n)+/g;
  const tableMatch = content?.match(tableRegex);

  let explanation = content || "";
  let columns: string[] = [];
  let data: string[][] = [];

  if (tableMatch) {
    const tableMarkdown = tableMatch[0];
    const parsed = parseMarkdownTable(tableMarkdown);
    columns = parsed?.columns || [];
    if (parsed?.data && parsed.data.length > 0) {
      data = [parsed.data[0]];
    } else {
      data = [];
    }
    if (content) {
      explanation = content.replace(tableMarkdown, "").trim();
    } else {
      explanation = "";
    }
  }

  const images = result?.[0]?.images || [];

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
            {result?.[0]?.citations && (
              <CitationList citations={result[0].citations} />
            )}

            {explanation && (
              <ExplicacaoCard
                explanation={explanation}
                title="Pesquisa Técnica."
              />
            )}

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
          disabled={loading || selectedRows.length === 0}
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
      </div>
    </div>
  );
}
