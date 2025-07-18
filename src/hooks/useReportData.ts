// src/hooks/useReportData.ts
"use client";

import { useState, useCallback } from "react";
import { reports, Report } from "@/lib/reports";

type DataRow = Record<string, string | number | null>;
// O tipo para o objeto de filtros, um Record onde as chaves são strings e os valores também.
export type ReportFilters = Record<string, string>;

interface UseReportDataReturn {
  data: DataRow[];
  activeReport: Report | null;
  isLoading: boolean;
  error: string | null;
  // A função agora aceita o ID do relatório e um objeto de filtros.
  fetchReport: (reportId: string, filters: ReportFilters) => Promise<void>;
}

export const useReportData = (): UseReportDataReturn => {
  const [data, setData] = useState<DataRow[]>([]);
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(
    async (reportId: string, filters: ReportFilters) => {
      if (!reportId) {
        setError("ID do relatório não fornecido.");
        return;
      }

      setIsLoading(true);
      setError(null);
      setData([]);
      setActiveReport(null);

      try {
        // Enviamos o reportId e os filtros para a nossa API.
        const response = await fetch("/api/n8n-query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reportId, filters }),
        });

        if (!response.ok) {
          const errorResult = await response.json();
          throw new Error(
            errorResult.error || "Falha ao buscar os dados do relatório."
          );
        }

        const result = await response.json();

        setData(result);
        setActiveReport(reports[reportId]);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ocorreu um erro desconhecido.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { data, activeReport, isLoading, error, fetchReport };
};
