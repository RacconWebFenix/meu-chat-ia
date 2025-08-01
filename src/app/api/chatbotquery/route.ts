// src/app/api/chatbotquery/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const n8nWebhookUrl = process.env.N8N_CHATBOT_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      throw new Error("N8N_CHATBOT_WEBHOOK_URL não está definida no .env");
    }

    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Falha no workflow do n8n (Análise):", errorText);
      throw new Error(`O workflow de análise falhou: ${response.statusText}`);
    }

    const n8nResponse = await response.json();

    /**
     * CORREÇÃO: Tratamos a resposta como um objeto único, não como um array.
     * Verificamos se o objeto existe e se ele tem a propriedade 'output'.
     */
    if (n8nResponse && n8nResponse.output) {
      const analysisPayload = JSON.parse(n8nResponse.output);
      return NextResponse.json(analysisPayload);
    } else {
      console.error(
        "Estrutura de resposta inesperada do n8n (Análise):",
        n8nResponse
      );
      throw new Error("Formato de resposta inesperado do serviço de IA.");
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro na Rota da API (Análise):", errorMessage);
    return NextResponse.json(
      {
        error: "Falha ao buscar dados do serviço de IA",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
