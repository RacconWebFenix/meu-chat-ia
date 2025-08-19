// src/features/reports/services/reportsService.ts
import { ReportRow, QuotationFilters } from "../types";

interface N8nRow {
  json: Record<string, string | number | null>;
}

export interface PaginatedN8nResponse {
  rows: N8nRow[];
  totalRowCount: number;
}

const N8N_QUOTATIONS_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_N8N_QUOTATIONS_WEBHOOK_URL;

export const reportsService = {
  getQuotations: async (
    filters: QuotationFilters
  ): Promise<{ rows: ReportRow[]; totalRowCount: number }> => {
    if (!N8N_QUOTATIONS_WEBHOOK_URL) {
      throw new Error(
        "Variável de ambiente NEXT_PUBLIC_N8N_QUOTATIONS_WEBHOOK_URL não está configurada."
      );
    }

    try {
      const response = await fetch(N8N_QUOTATIONS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error(
          `Erro na API do n8n: ${response.status} ${response.statusText}`
        );
      }

      const responseText = await response.text();
      if (!responseText) {
        return { rows: [], totalRowCount: 0 };
      }

      const data: PaginatedN8nResponse = JSON.parse(responseText);

      const extractedRows: ReportRow[] = data.rows.map((item, index) => {
        const rowData = item.json;

        // --- CORREÇÃO DA CHAVE ÚNICA ---
        // A primeira coluna da tabela dinâmica (ex: nome do comprador) é a chave única.
        const firstColumnValue = Object.values(rowData)[0];
        const uniqueId = String(firstColumnValue || index);

        return {
          ...rowData,
          id: uniqueId,
        };
      });

      return {
        rows: extractedRows,
        totalRowCount: data.totalRowCount,
      };
    } catch (error) {
      console.error("Falha ao buscar ou processar dados do n8n:", error);
      throw error;
    }
  },
};
