import axios from "axios";

export const ChatPDMService = {
  async askPDM(body: unknown) {
    const response = await axios.post(process.env.PDM_API_URL!, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      text:
        response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Erro ao obter resposta da IA.",
    };
  },
};
