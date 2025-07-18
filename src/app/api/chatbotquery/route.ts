// src/app/api/new-chatbot/route.ts
import { NextRequest } from "next/server";
import { ChatbotQueryController } from "./chatbotquery.controller";

export async function POST(req: NextRequest) {
  return ChatbotQueryController.handle(req);
}
