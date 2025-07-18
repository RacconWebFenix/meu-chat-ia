import axios from "axios";
import { FeedbackService } from "../feedback/feedback.service";
import { prisma } from "lib/prisma";

async function getDynamicPrompt() {
  const positivos = await prisma.feedback.findMany({
    where: { rating: { gte: 4 } },
    take: 3,
  });
  const negativos = await prisma.feedback.findMany({
    where: { rating: { lte: 2 } },
    take: 3,
  });

  let dynamicPart = "";

  if (positivos.length > 0) {
    dynamicPart +=
      "\nExemplos de respostas bem avaliadas:\n" +
      positivos
        .map(
          (f, i) => `${i + 1}. Pergunta: ${f.prompt}\nResposta: ${f.response}\n`
        )
        .join("\n");
  }
  if (negativos.length > 0) {
    dynamicPart +=
      "\nExemplos de respostas mal avaliadas (evite este tipo):\n" +
      negativos
        .map(
          (f, i) => `${i + 1}. Pergunta: ${f.prompt}\nResposta: ${f.response}\n`
        )
        .join("\n");
  }

  return dynamicPart;
}

export const SonarService = {
  getDynamicPrompt,
  async askSonar(prompt: string) {
    const dynamicPrompt = await getDynamicPrompt();

    const sonarBody = {
      text: prompt,
      training: dynamicPrompt,
    };

    try {
      const response = await axios.post(
        // "https://n8n.cib2b.com.br/webhook-test/90d92d66-f34f-426a-9512-492d060fc55f",
        "https://n8n.cib2b.com.br/webhook/90d92d66-f34f-426a-9512-492d060fc55f",
        sonarBody
      );

      // Retorna os dados da resposta
      const reply = response.data;

      // Cria novo feedback como pendente
      const feedback = await FeedbackService.create({
        prompt: JSON.stringify(sonarBody),
        response: JSON.stringify(reply),
        status: "pendente",
      });

      return { reply, feedbackId: feedback.id };
    } catch (error) {
      console.error("Erro na chamada para Sonar API:", error);
      throw new Error("Falha ao comunicar com a API Sonar");
    }
  },
};
