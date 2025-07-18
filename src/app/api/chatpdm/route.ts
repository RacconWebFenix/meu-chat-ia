import { NextRequest, NextResponse } from "next/server";

import { ChatPDMService } from "./chatpdm.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const reply = await ChatPDMService.askPDM(body);
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { error: "Erro ao processar a requisição do chatpdm." },
      { status: 500 }
    );
  }
}
