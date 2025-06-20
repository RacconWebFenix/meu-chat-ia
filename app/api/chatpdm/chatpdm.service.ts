import axios from "axios";

export const ChatPDMService = {
  async askPDM(body: unknown) {
    const response = await axios.post(
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
