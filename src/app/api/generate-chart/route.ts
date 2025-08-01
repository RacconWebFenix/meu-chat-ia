// src/app/api/generate-chart/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { rawData, originalQuestion } = await request.json();

    // Nota: O seu arquivo original tinha um erro de digitação na variável de ambiente. Corrigido para consistência.
    const n8nWebhookUrl = process.env.N8N_CHART_GENERATOR_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      throw new Error("N8N_CHART_WEBHOOK_URL não está definida no .env");
    }

    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawData, originalQuestion }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Falha no workflow do n8n (Gráfico):", errorText);
      throw new Error(`O workflow de gráfico falhou: ${response.statusText}`);
    }

    const n8nResponse = await response.json();

    if (
      Array.isArray(n8nResponse) &&
      n8nResponse.length > 0 &&
      n8nResponse[0].output
    ) {
      const chartPayload = JSON.parse(n8nResponse[0].output);
      return NextResponse.json(chartPayload);
    } else {
      console.error(
        "Estrutura de resposta inesperada do n8n (Gráfico):",
        n8nResponse
      );
      throw new Error("Formato de resposta inesperado do serviço de IA.");
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro na Rota da API (Gráfico):", errorMessage);
    return NextResponse.json(
      { error: "Falha ao gerar o gráfico", details: errorMessage },
      { status: 500 }
    );
  }
}
