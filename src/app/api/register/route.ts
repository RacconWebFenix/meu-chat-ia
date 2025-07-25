import { NextRequest, NextResponse } from "next/server";

import * as bcrypt from "bcrypt";
import { prisma } from "../../../../lib/prisma";
import { SecurityValidator } from "../../../lib/security";

export async function POST(req: NextRequest) {
  try {
    const { username, password, name } = await req.json();
    
    // Validação básica de entrada
    if (!username || !password) {
      console.log("🚫 Tentativa de registro sem credenciais completas");
      return NextResponse.json(
        { error: "Usuário e senha obrigatórios" },
        { status: 400 }
      );
    }

    // Sanitização de entrada
    const sanitizedUsername = SecurityValidator.sanitizeInput(username.trim().toLowerCase());
    const sanitizedName = name ? SecurityValidator.sanitizeInput(name.trim()) : null;

    // Validação de tamanho do username
    if (sanitizedUsername.length < 3 || sanitizedUsername.length > 50) {
      return NextResponse.json(
        { error: "Username deve ter entre 3 e 50 caracteres" },
        { status: 400 }
      );
    }

    // Validação de força da senha
    const passwordValidation = SecurityValidator.validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      console.log(`🚫 Senha fraca para usuário: ${sanitizedUsername}`);
      return NextResponse.json(
        { error: "Senha não atende aos critérios de segurança", details: passwordValidation.errors },
        { status: 400 }
      );
    }

    // Verificar se usuário já existe
    const existing = await prisma.user.findUnique({ where: { username: sanitizedUsername } });
    if (existing) {
      console.log(`🚫 Tentativa de registro com usuário existente: ${sanitizedUsername}`);
      return NextResponse.json({ error: "Usuário já existe" }, { status: 400 });
    }

    // Hash da senha com salt mais forte
    const passwordHash = await bcrypt.hash(password, 12);
    
    const user = await prisma.user.create({
      data: { 
        username: sanitizedUsername, 
        passwordHash, 
        name: sanitizedName 
      },
    });

    console.log(`✅ Usuário registrado com sucesso: ${sanitizedUsername}`);
    
    return NextResponse.json({ 
      id: user.id, 
      username: user.username,
      message: "Usuário criado com sucesso"
    });
    
  } catch (error) {
    console.error("❌ Erro no registro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
