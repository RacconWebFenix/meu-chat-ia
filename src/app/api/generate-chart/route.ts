import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

import { SqlQueryResultRow } from "@/types";

async function getChartJson(payload: SqlQueryResultRow[]) {
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

    const chartPayload: SqlQueryResultRow[] = body.payload;

    if (!chartPayload) {
      return NextResponse.json(
        { error: "Payload de dados não fornecido." },
        { status: 400 }
      );
    }

    const n8nResponse = await getChartJson(chartPayload);
    const chartData = JSON.parse(n8nResponse[0].output);

    return NextResponse.json(chartData);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro desconhecido.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
