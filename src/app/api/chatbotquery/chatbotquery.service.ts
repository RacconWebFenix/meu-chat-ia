import axios from "axios";

export const ChatbotQueryService = {
  async askChatbot(body: unknown) {
    const N8N_CHATBOT_WEBHOOK_URL = process.env.N8N_CHATBOT_WEBHOOK_URL!;

    try {
      const response = await axios.post(N8N_CHATBOT_WEBHOOK_URL, body, {
        headers: { "Content-Type": "application/json" },
      });

      // CORREÇÃO: Retorna a resposta do n8n diretamente.
      return response.data;
    } catch (error) {
      console.error("Erro na comunicação com o n8n para o chatbot:", error);
      throw new Error("Falha ao se comunicar com o serviço de IA do chatbot.");
    }
  },
};
