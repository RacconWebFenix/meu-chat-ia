import { withAuth } from "next-auth/middleware";

export default withAuth({
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
