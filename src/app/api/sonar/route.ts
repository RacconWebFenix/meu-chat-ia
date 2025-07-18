import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";

import { NextRequest } from "next/server";
import { SonarController } from "./sonar.controller";

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Não autorizado" }), {
      status: 401,
    });
  }
  // Se autenticado, delega para o controller
  return SonarController.handle(req);
};
