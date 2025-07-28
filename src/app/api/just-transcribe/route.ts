import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as Blob | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: "Nenhum arquivo de áudio recebido." },
        { status: 400 }
      );
    }

    const n8nFormData = new FormData();
    n8nFormData.append("audio", audioFile, "recording.webm");

    // IMPORTANTE: Esta variável de ambiente deve apontar para o seu NOVO fluxo N8N que apenas transcreve.
    const n8nWebhookUrl = process.env.N8N_TRANSCRIBE_ONLY_WEBHOOK_URL;
    if (!n8nWebhookUrl) {
      throw new Error(
        "A URL do webhook de transcrição (N8N_TRANSCRIBE_ONLY_WEBHOOK_URL) não está configurada."
      );
    }

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: "POST",
      body: n8nFormData,
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error("Erro do N8N (transcrição):", errorText);
      throw new Error(
        `O N8N de transcrição retornou um erro: ${n8nResponse.statusText}`
      );
    }

    // O N8N retorna um array com um objeto: [{ "text": "..." }]
    const n8nResult = await n8nResponse.json();
    console.log(
      "[API /just-transcribe] Resposta recebida do N8N:",
      JSON.stringify(n8nResult, null, 2)
    );

    // CORREÇÃO: Extrai o texto diretamente do objeto de resposta do N8N
    const transcriptionText = n8nResult?.text || null;

    if (!transcriptionText) {
      return NextResponse.json(
        { error: "A transcrição retornou um texto vazio." },
        { status: 500 }
      );
    }

    // Retorna para o frontend no formato que ele espera: { "transcription": "..." }
    const responseToFrontend = { transcription: transcriptionText };
    console.log(
      "[API /just-transcribe] Resposta enviada para o frontend:",
      JSON.stringify(responseToFrontend, null, 2)
    );
    return NextResponse.json(responseToFrontend);
  } catch (error) {
    console.error("Erro em /api/just-transcribe:", error);
    const message =
      error instanceof Error ? error.message : "Erro desconhecido no servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
