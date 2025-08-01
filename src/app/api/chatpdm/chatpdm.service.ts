import axios from "axios";

// Definição da interface para o tipo de entrada
interface ChatPDMRequest {
  prompt: string;
  message?: string;
  [key: string]: unknown; // Para campos adicionais que possam surgir
}

interface ChatPDMResponse {
  output: string;
  [key: string]: unknown; // Para campos adicionais na resposta
}

export const ChatPDMService = {
  async askPDM(body: ChatPDMRequest) {
    const response = await axios.post<ChatPDMResponse>(
      "https://n8n.cib2b.com.br/webhook/chatpdm",
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      text: response.data.output || "Erro ao obter resposta da IA.",
    };
  },
};
