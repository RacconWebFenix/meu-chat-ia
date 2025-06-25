import { useState } from "react";
import { parseSelectedRows } from "../utils/parseSelectedRows";
import { perplexityMock } from "@/app/mocks/perplexity.mock";
import { useSelectedGridContext } from "@/app/providers";


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
  citations: { url: string; siteName: string }[];
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

export function useValidarInformacoes() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRowData, setSelectedRowData] = useState<Record<
    string,
    string
  > | null>(null);
  const [result, setResult] = useState<PerplexityResult[] | null>(null);

  const { selectedGrid, inputRows, inputHeaders } = useSelectedGridContext();

  const dataArr = parseSelectedRows(selectedGrid) || [];

  const handleRowSelect = (rowIdx: number | null) => {
    if (rowIdx === null) {
      setSelectedRows([]);
      setSelectedRowData(null);
    } else {
      setSelectedRows([rowIdx]);
      setSelectedRowData(dataArr[rowIdx] || null);
    }
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
        setResult(apiResult.received);
      } catch {
        setError("Erro inesperado");
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    selectedRows,
    loading,
    error,
    result,
    dataArr,
    inputRows,
    inputHeaders,
    handleRowSelect,
    handleValidar,
  };
}
