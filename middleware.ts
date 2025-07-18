import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      // Permite acesso ao login e register sempre
      if (
        req.nextUrl.pathname.startsWith("/login") ||
        req.nextUrl.pathname.startsWith("/register")
      ) {
        return true;
      }

      // Para outras rotas, verifica se tem token
      return !!token;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    /*
      Protege todas as rotas, exceto:
      - /login
      - /register
      - /api/*
      - /assets/*
      - /_next/static/*
      - /_next/image/*
      - arquivos de imagem na raiz de /public (opcional)
    */
    "/((?!login|register|api|assets|_next/static|_next/image).*)",
  ],
};
