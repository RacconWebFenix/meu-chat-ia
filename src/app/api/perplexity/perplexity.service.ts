// Serviço para lidar com lógica da API Perplexyty

import axios from "axios";

// Definição da interface para o tipo de entrada
interface PerplexityRequest {
  question: string;
  context?: string;
  [key: string]: unknown; // Para campos adicionais que possam surgir
}

export const PerplexityService = {
  async processData(data: PerplexityRequest) {
    const response = await axios.post(
      // "https://n8n.cib2b.com.br/webhook-test/bce2393e-b773-40c0-aa77-ee6238ec5f57",
      "https://n8n.cib2b.com.br/webhook/bce2393e-b773-40c0-aa77-ee6238ec5f57",
      data
    );

    return { received: response.data };
  },
};
