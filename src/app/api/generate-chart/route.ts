import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
// --- INÍCIO DA MODIFICAÇÃO ---
// 1. Importe o tipo que definimos para os dados brutos da query
import { SqlQueryResultRow } from "@/types";
// --- FIM DA MODIFICAÇÃO ---

// --- INÍCIO DA MODIFICAÇÃO ---
// 2. Use o tipo importado para tipar o payload
async function getChartJson(payload: SqlQueryResultRow[]) {
  // --- FIM DA MODIFICAÇÃO ---
  const chartGeneratorWebhookUrl = process.env.N8N_CHART_GENERATOR_WEBHOOK_URL;

  if (!chartGeneratorWebhookUrl) {
    throw new Error("URL do webhook gerador de gráfico não configurada.");
  }

  try {
    const response = await axios.post(chartGeneratorWebhookUrl, {
      payload: payload,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao chamar o webhook gerador de gráfico:", error);
    throw new Error(
      "Falha na comunicação com o serviço de geração de gráfico."
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // --- INÍCIO DA MODIFICAÇÃO ---
    // 3. Opcionalmente, podemos tipar a variável aqui também para maior clareza
    const chartPayload: SqlQueryResultRow[] = body.payload;
    // --- FIM DA MODIFICAÇÃO ---

    if (!chartPayload) {
      return NextResponse.json(
        { error: "Payload de dados não fornecido." },
        { status: 400 }
      );
    }

    const chartJson = await getChartJson(chartPayload);

    return NextResponse.json(chartJson);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro desconhecido.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
