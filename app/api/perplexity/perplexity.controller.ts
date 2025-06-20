import { NextRequest, NextResponse } from "next/server";
import { PerplexityService } from "./perplexity.service";

export const PerplexityController = {
  async handlePost(req: NextRequest) {
    try {
      const data = await req.json();
      const result = await PerplexityService.processData(data);
      return NextResponse.json(result);
    } catch  {
      return NextResponse.json(
        { error: "Erro ao processar requisição" },
        { status: 500 }
      );
    }
  },
};
