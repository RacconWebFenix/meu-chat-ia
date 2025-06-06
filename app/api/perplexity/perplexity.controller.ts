import { NextRequest, NextResponse } from "next/server";
import { PerplexityService } from "./perplexity.service";

export const PerplexityController = {
  async handle(req: NextRequest) {
    try {
      const body = await req.json();
      const { reply, feedbackId } = await PerplexityService.askPerplexity(body.prompt);
      return NextResponse.json({ reply, feedbackId });
    } catch {
      return NextResponse.json(
        { error: "Erro ao conectar com a API externa" },
        { status: 500 }
      );
    }
  },
};