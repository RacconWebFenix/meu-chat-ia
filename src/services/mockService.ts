import iaResponseMock from "@/mocks/iaResponse.mock";
import { perplexityMock } from "@/mocks/perplexity.mock";
import { validarInformacoesMock } from "@/mocks/validarInformacoes.mock";
import { PerplexityResult } from "@/types/api.types";

// Mock Service for development/testing
export class MockService {
  private static instance: MockService;

  static getInstance(): MockService {
    if (!MockService.instance) {
      MockService.instance = new MockService();
    }
    return MockService.instance;
  }

  // Simulate API delay
  private async delay(ms: number = 1000): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getValidarInformacoesMock(): Promise<PerplexityResult[]> {
    await this.delay();
    return validarInformacoesMock;
  }

  async getPerplexityMock(): Promise<PerplexityResult[]> {
    await this.delay();
    return perplexityMock;
  }

  async getChatBotMock(): Promise<typeof iaResponseMock> {
    await this.delay(500);
    return iaResponseMock;
  }
}

// Singleton instance
export const mockService = MockService.getInstance();
