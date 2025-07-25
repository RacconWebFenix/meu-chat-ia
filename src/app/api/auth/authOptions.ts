import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import * as bcrypt from "bcrypt";
import { prisma } from "../../../../lib/prisma";
import { SecurityValidator } from "../../../lib/security";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Usuário", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          console.log("🚫 Tentativa de login sem credenciais");
          return null;
        }

        // Validação básica de entrada
        if (!credentials.username || !credentials.password) {
          console.log("🚫 Credenciais incompletas");
          return null;
        }

        // Sanitização de entrada
        const username = SecurityValidator.sanitizeInput(
          credentials.username.trim().toLowerCase()
        );

        if (username.length < 3 || username.length > 50) {
          console.log("🚫 Username com tamanho inválido");
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { username },
          });

          if (!user) {
            console.log(`🚫 Usuário não encontrado: ${username}`);
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          if (isValid) {
            console.log(`✅ Login bem-sucedido: ${username}`);
            return {
              id: user.id + "",
              name: user.name || user.username,
              username: user.username,
            };
          }

          console.log(`🚫 Senha inválida para usuário: ${username}`);
          return null;
        } catch (error) {
          console.error("❌ Erro na autenticação:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && 'username' in user) {
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        const user = session.user as { id: string; username?: string; name?: string; email?: string; image?: string };
        user.id = token.sub || "";
        user.username = token.username as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
