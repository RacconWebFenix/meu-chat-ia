import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { OpenAIController } from "./openai.controller";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Não autorizado" }), {
      status: 401,
    });
  }
  // Se autenticado, delega para o controller
  return OpenAIController.handle(req);
};
