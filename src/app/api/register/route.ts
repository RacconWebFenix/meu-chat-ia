import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";
import { prisma } from "lib/prisma";

export async function POST(req: NextRequest) {
  const { username, password, name } = await req.json();
  if (!username || !password) {
    return NextResponse.json(
      { error: "Usuário e senha obrigatórios" },
      { status: 400 }
    );
  }
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json({ error: "Usuário já existe" }, { status: 400 });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, passwordHash, name },
  });
  return NextResponse.json({ id: user.id, username: user.username });
}
