// src/app/api/chatbotquery/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const n8nWebhookUrl = process.env.N8N_CHATBOT_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      throw new Error("N8N_CHATBOT_WEBHOOK_URL não está definida no .env");
    }

    // 1. Chama o Fluxo 1 do n8n, que é o gatilho rápido
    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Falha no Fluxo 1 do n8n:", errorText);
      throw new Error(`O Fluxo 1 do n8n falhou: ${response.statusText}`);
    }

    // 2. A resposta do Fluxo 1 é { jobId, status, ... }.
    //    Nós apenas a pegamos e repassamos diretamente para o frontend.
    const n8nResponse = await response.json();
    return NextResponse.json(n8nResponse);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro na Rota da API (chatbotquery):", errorMessage);
    return NextResponse.json(
      { error: "Falha ao iniciar a consulta", details: errorMessage },
      { status: 500 }
    );
  }
}
