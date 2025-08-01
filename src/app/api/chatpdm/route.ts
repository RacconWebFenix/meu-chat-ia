import { NextRequest, NextResponse } from "next/server";

import { ChatPDMService } from "./chatpdm.service";

// Interfaces definidas no serviço, reexportadas aqui
interface ChatPDMRequest {
  prompt: string;
  message?: string;
  [key: string]: unknown;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatPDMRequest;
    const reply = await ChatPDMService.askPDM(body);
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { error: "Erro ao processar a requisição do chatpdm." },
      { status: 500 }
    );
  }
}
