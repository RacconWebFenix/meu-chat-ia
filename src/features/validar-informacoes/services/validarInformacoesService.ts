import { mockService } from "@/services";
import { PerplexityResult } from "@/types/api.types";

export class ValidarInformacoesService {
  private static instance: ValidarInformacoesService;

  static getInstance(): ValidarInformacoesService {
    if (!ValidarInformacoesService.instance) {
      ValidarInformacoesService.instance = new ValidarInformacoesService();
    }
    return ValidarInformacoesService.instance;
  }

  async validateProduct(
    selectedRowData: Record<string, string>,
    useMock = false
  ): Promise<PerplexityResult[]> {
    if (useMock) {
      return mockService.getValidarInformacoesMock();
    }

    const response = await fetch("/api/perplexity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedRowData),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as { received: PerplexityResult[] };
    return data.received || [];
  }

  async getMockData(): Promise<PerplexityResult[]> {
    return mockService.getValidarInformacoesMock();
  }
}

// Singleton instance
export const validarInformacoesService =
  ValidarInformacoesService.getInstance();
