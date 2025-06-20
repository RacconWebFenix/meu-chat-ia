import { NextRequest, NextResponse } from "next/server";
import { OpenAIService } from "./openai.service";

export const OpenAIController = {
  async handle(req: NextRequest) {
    try {
      const body = await req.json();
      const { reply, feedbackId } = await OpenAIService.askOpenAI(body);
      return NextResponse.json({ reply, feedbackId });
    } catch (err) {
      console.error("Erro real:", err);
      return NextResponse.json(
        { error: "Erro ao conectar com a API externa" },
        { status: 500 }
      );
    }
  },
};
