import { prisma } from "@/prisma/lib/prisma";
import axios from "axios";
import { FeedbackService } from "@/app/api/feedback/feedback.service";

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

export const OpenAIService = {
  getDynamicPrompt,
  async askOpenAI(prompt: string) {
    const dynamicPrompt = await getDynamicPrompt();

    const openaiBody = {
      text: prompt,
      training: dynamicPrompt,
    };

    const response = await axios.post(
      "https://n8n.cib2b.com.br/webhook/90d92d66-f34f-426a-9512-492d060fc55f",
      openaiBody
    );

    const resposta = Array.isArray(response.data)
      ? response.data[0]
      : response.data;

    const reply = {
      citations: resposta?.citations,
      images: resposta?.images,
      text: { content: resposta?.content },
    };

    // Apaga todos os pendentes antes de criar um novo
    await prisma.feedback.deleteMany({
      where: {
        status: "pendente",
      },
    });

    // Cria novo feedback como pendente
    const feedback = await FeedbackService.create({
      prompt: JSON.stringify(openaiBody),
      response: reply.text?.content || "",
      status: "pendente",
    });

    return { reply, feedbackId: feedback.id };
  },
};
