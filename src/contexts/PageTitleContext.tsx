"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface PageTitleContextType {
  pageTitle: string;
  setPageTitle: (title: string) => void;
}

const PageTitleContext = createContext<PageTitleContextType>({
  pageTitle: "Identificação de Materiais",
  setPageTitle: () => {},
});

export const usePageTitle = () => useContext(PageTitleContext);

// Mapeamento de rotas para títulos
const routeTitleMap: Record<string, string> = {
  "/": "Identificação de Materiais",
  "/identificacao-materiais": "Identificação de Materiais",
  "/feedbacks": "Feedbacks - Gerenciar Feedbacks",
  "/validar-informacoes": "Validar Informações",
  "/login": "Login - Acesse sua Conta",
  "/register": "Cadastro - Criar Nova Conta",
};

export function PageTitleProvider({ children }: { children: React.ReactNode }) {
  const [pageTitle, setPageTitle] = useState("Identificação de Materiais");
  const pathname = usePathname();

  // Atualiza o título automaticamente baseado na rota
  useEffect(() => {
    const newTitle = routeTitleMap[pathname] || "Identificação de Materiais";
    setPageTitle(newTitle);
  }, [pathname]);

  return (
    <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}
