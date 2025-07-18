import { NextRequest, NextResponse } from "next/server";
import { SonarService } from "./sonar.service";


export const SonarController = {
  async handle(req: NextRequest) {
    try {
      const body = await req.json();
      const { reply, feedbackId } = await SonarService.askSonar(body);
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
