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

  return (process.env.SYSTEM_PROMPT || "") + dynamicPart;
}

export const PerplexityService = {
  getDynamicPrompt,
  async askPerplexity(prompt: string) {
    const dynamicPrompt = await getDynamicPrompt();

    const perplexityBody = {
      model: process.env.API_PERPLEXITY_MODEL,
      messages: [
        { role: "system", content: dynamicPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      return_images: true,
      return_related_questions: false,
      stream: false,
      web_search_options: {
        search_depth: process.env.API_PERPLEXITY_SEARCH_DEPTH,
      },
    };

    const response = await axios.post(
      process.env.API_PERPLEXITY_URL!,
      perplexityBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_PERPLEXITY_KEY}`,
        },
      }
    );

    const data = response.data;

    const reply = {
      citations: data?.citations,
      images: data?.images,
      text: data?.choices?.[0]?.message,
    };

    // Apaga todos os pendentes antes de criar um novo
    await prisma.feedback.deleteMany({
      where: {
        status: "pendente",
      },
    });

    // Cria novo feedback como pendente
    const feedback = await FeedbackService.create({
      prompt,
      response: reply.text?.content || "",
      status: "pendente",
    });

    return { reply, feedbackId: feedback.id };
  },
};
