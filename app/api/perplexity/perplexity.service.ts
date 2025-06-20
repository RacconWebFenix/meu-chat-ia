// Serviço para lidar com lógica da API Perplexyty

import axios from "axios";

export const PerplexityService = {
  async processData(data: unknown) {
    const response = await axios.post(
      "https://n8n.cib2b.com.br/webhook/bce2393e-b773-40c0-aa77-ee6238ec5f57",
      data
    );

    return { received: response.data };
  },
};
