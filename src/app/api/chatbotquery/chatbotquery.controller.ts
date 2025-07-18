import { NextRequest, NextResponse } from "next/server";
import { ChatbotQueryService } from "./chatbotquery.service";

export const ChatbotQueryController = {
  async handle(req: NextRequest) {
    try {
      const { message } = await req.json();
      const directResponseFromN8n = await ChatbotQueryService.askChatbot(
        message
      );

      // CORREÇÃO: Envia a resposta direta do n8n para o frontend.
      return NextResponse.json(directResponseFromN8n);
    } catch (err) {
      console.error("Erro no controlador do chatbot:", err);
      return NextResponse.json(
        { error: "Erro ao processar a requisição do chatbot." },
        { status: 500 }
      );
    }
  },
};
