import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Função para gerar prompt dinâmico
async function getDynamicPrompt() {
  // Exemplo: busca últimos 5 feedbacks positivos
  const feedbacks = await prisma.feedback.findMany({
    where: { userFeedback: "positivo" },
    orderBy: { id: "desc" },
    take: 5,
  });

  let dynamicPart = "";
  if (feedbacks.length > 0) {
    dynamicPart =
      "\nExemplos de respostas bem avaliadas pelos usuários:\n" +
      feedbacks
        .map(
          (f, i) => `${i + 1}. Pergunta: ${f.prompt}\nResposta: ${f.response}\n`
        )
        .join("\n");
  }

  // Junta o SYSTEM_PROMPT base com a parte dinâmica
  return process.env.SYSTEM_PROMPT + dynamicPart;
}

export async function POST(request) {

  try {
    const { message } = await request.json();

    // Gere o prompt dinâmico
    const dynamicPrompt = await getDynamicPrompt();

    console.log(dynamicPrompt, "Dynamic prompt generated");

    // 1. Armazene o prompt e um placeholder para a resposta no início
    const feedbackEntry = await prisma.feedback.create({
      data: {
        prompt: message,
        response: "PENDING_RESPONSE",
      },
    });

    // Use o prompt dinâmico na chamada à IA
    const body = {
      model: process.env.API_PERPLEXITY_MODEL,
      messages: [
        {
          role: "system",
          content: dynamicPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.1,
      top_p: 0.6,
      return_images: true,
      return_related_questions: false,
      stream: false,
      web_search_options: {
        search_depth: "deep",
      },
    };

    const response = await fetch(process.env.API_PERPLEXITY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_PERPLEXITY_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Atualiza o registro com o erro da API, se desejar
      await prisma.feedback.update({
        where: { id: feedbackEntry.id },
        data: { response: `API_ERROR: ${JSON.stringify(errorData)}` },
      });
      return new Response(JSON.stringify({ error: "Erro na API externa" }), {
        status: 500,
      });
    }

    const data = await response.json();

    const reply =
      {
        citations: data.citations,
        images: data.images,
        text: data.choices?.[0]?.message,
      } || "Sem resposta";

    // 2. Atualize o registro com a resposta real da API
    await prisma.feedback.update({
      where: { id: feedbackEntry.id },
      data: { response: reply.text?.content || JSON.stringify(reply) },
    });

    return new Response(
      JSON.stringify({ reply, feedbackId: feedbackEntry.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro interno no servidor" }), {
      status: 500,
    });
  }
}
