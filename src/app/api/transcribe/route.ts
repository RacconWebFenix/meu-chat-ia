// src/app/api/transcribe/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // 2. Extrai o arquivo de áudio usando a mesma chave ('audio') que definimos no hook.
    const audioFile = formData.get("audio") as Blob | null;

    // 3. Validação: Se não houver arquivo, retorna um erro.
    if (!audioFile) {
      return NextResponse.json(
        { error: "Nenhum arquivo de áudio recebido." },
        { status: 400 }
      );
    }

    // 4. Prepara os dados para enviar ao n8n.
    // O n8n também espera receber um 'FormData' com o arquivo.
    const n8nFormData = new FormData();
    n8nFormData.append("audio", audioFile, "recording.webm");

    // 5. Pega a URL do webhook do n8n a partir das variáveis de ambiente.
    const n8nWebhookUrl = process.env.N8N_CHATBOT_WEBHOOK_URL;
    if (!n8nWebhookUrl) {
      throw new Error("A URL do webhook de transcrição não está configurada.");
    }

    // 6. Chama o webhook do n8n com o áudio.
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: "POST",
      body: n8nFormData,
    });

    // 7. Validação: Se a resposta do n8n não for bem-sucedida, lança um erro.
    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error("Erro na resposta do n8n:", errorText);
      throw new Error(`O n8n retornou um erro: ${n8nResponse.statusText}`);
    }

    // 8. Pega o resultado final do fluxo n8n (o JSON com texto e/ou chartPayload).
    const finalResult = await n8nResponse.json();

    // 9. Retorna o resultado final para o seu frontend.
    return NextResponse.json(finalResult);
  } catch (error) {
    // Em caso de qualquer erro no processo, loga no servidor e retorna um erro 500.
    console.error("Erro na rota /api/transcribe:", error);
    const message =
      error instanceof Error ? error.message : "Erro desconhecido no servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
