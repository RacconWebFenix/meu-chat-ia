// src/app/api/get-groups/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const n8nWebhookUrl = process.env.N8N_GROUPID_COMPANY!; // URL do seu webhook n8n

  try {
    const response = await fetch(n8nWebhookUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Falha ao buscar grupos do n8n:", errorText);
      throw new Error("Erro na comunicação com o serviço de dados.");
    }

    const groups = await response.json();
    return NextResponse.json(groups);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido no servidor.";
    console.error("Erro na rota /api/get-groups:", errorMessage);
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}
