import { withAuth } from "next-auth/middleware";
import { TokenValidator } from "./src/lib/tokenValidation";

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

      // Validação básica de existência do token (NextAuth)
      if (!token) {
        console.log("🚫 Acesso negado: Token não encontrado");
        return false;
      }

      // Validação robusta adicional para rotas críticas da API
      const criticalApiRoutes = [
        "/api/chatbotquery",
        "/api/chatpdm",
        "/api/feedback",
        "/api/generate-chart",
        "/api/get-groups",
        "/api/get-result",
        "/api/perplexity",
        "/api/sonar",
      ];

      const isCriticalRoute = criticalApiRoutes.some((route) =>
        req.nextUrl.pathname.startsWith(route)
      );

      if (isCriticalRoute) {
        try {
          // Extrair token raw da requisição para validação avançada
          const rawToken = TokenValidator.extractTokenFromRequest(req);

          if (!rawToken) {
            console.log("🚫 API crítica: Token raw não encontrado");
            return false;
          }

          const validation = TokenValidator.validateToken(rawToken);

          if (!validation.valid) {
            console.log(`🚫 API crítica: Token inválido - ${validation.error}`);
            return false;
          }

          // Log de acesso para auditoria
          console.log(`✅ Acesso autorizado para ${req.nextUrl.pathname}`);

          return true;
        } catch (error) {
          console.error("❌ Erro na validação de token:", error);
          return false;
        }
      }

      // Para rotas não críticas, usar validação padrão do NextAuth
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
      - /api/* (será protegido individualmente)
      - /assets/*
      - /public/*
      - /_next/static/*
      - /_next/image/*
      - arquivos estáticos
    */
    "/((?!login|register|api|assets|public|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
