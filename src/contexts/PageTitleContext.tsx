"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface PageTitleContextType {
  pageTitle: string;
  setPageTitle: (title: string) => void;
}

const PageTitleContext = createContext<PageTitleContextType>({
  pageTitle: "Pesquisa e Identificação de Materiais",
  setPageTitle: () => {},
});

export const usePageTitle = () => useContext(PageTitleContext);

// Mapeamento de rotas para títulos
const routeTitleMap: Record<string, string> = {
  "/": "Início - Página Inicial",
  "/search": "Pesquisa de Materiais",
  "/feedbacks": "Feedbacks - Gerenciar Feedbacks",
  "/validar-informacoes": "Validar Informações",
  "/login": "Login - Acesse sua Conta",
  "/register": "Cadastro - Criar Nova Conta",
};

export function PageTitleProvider({ children }: { children: React.ReactNode }) {
  const [pageTitle, setPageTitle] = useState("Início - Página Inicial");
  const pathname = usePathname();

  // Atualiza o título automaticamente baseado na rota
  useEffect(() => {
    const newTitle =
      routeTitleMap[pathname] || "Pesquisa e Identificação de Materiais";
    setPageTitle(newTitle);
  }, [pathname]);

  return (
    <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}
