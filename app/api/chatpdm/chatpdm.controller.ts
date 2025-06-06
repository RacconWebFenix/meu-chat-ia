import { NextRequest, NextResponse } from "next/server";
import { ChatPDMService } from "./chatpdm.service";

export const ChatPDMController = {
  async askPDM(req: NextRequest) {

    try {
      const { text: prompt } = await req.json();
      const reply = await ChatPDMService.askPDM(prompt);
      return NextResponse.json({ reply });
    } catch {
      return NextResponse.json(
        { error: "Erro ao processar a requisição do chatpdm." },
        { status: 500 }
      );
    }
  },
};
