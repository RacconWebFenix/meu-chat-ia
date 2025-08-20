// src/features/reports/services/reportsService.ts
import {
  AggregatedRow,
  ExtendedQuotationFilters,
  PivotApiResponse,
} from "../types";

const N8N_QUOTATIONS_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_N8N_QUOTATIONS_WEBHOOK_URL;

export const reportsService = {
  getQuotations: async (
    filters: ExtendedQuotationFilters
  ): Promise<{ rows: AggregatedRow[]; totalRowCount: number }> => {
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

      const data: PivotApiResponse = JSON.parse(responseText);

      // ✅ AJUSTE DE ROBUSTEZ: Verifica se 'data.rows' é de fato um array.
      if (!data || !Array.isArray(data.rows)) {
        console.error(
          "Erro de formato na resposta do N8N: 'rows' não é um array.",
          data
        );
        // Retorna um estado vazio para evitar que a aplicação quebre.
        return { rows: [], totalRowCount: 0 };
      }

      const extractedRows: AggregatedRow[] = data.rows.map((rowData, index) => {
        if (!rowData || typeof rowData !== "object") {
          return { id: `invalid_row_${index}` };
        }

        const uniqueId = Object.values(rowData).join("-") || String(index);

        return {
          ...rowData,
          id: uniqueId,
        };
      });

      return {
        rows: extractedRows,
        totalRowCount: data.totalRowCount || 0,
      };
    } catch (error) {
      console.error("Falha ao buscar ou processar dados do n8n:", error);
      throw error;
    }
  },
};
