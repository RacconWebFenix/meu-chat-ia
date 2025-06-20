import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// Defina e exporte o objeto de opções
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Usuário", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });
        if (
          user &&
          (await bcrypt.compare(credentials.password, user.passwordHash))
        ) {
          return { id: user.id + "", name: user.name || user.username };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt", // string literal
  },
  pages: {
    signIn: "/login",
  },
};

// Passe o objeto para o NextAuth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
