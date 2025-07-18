"use client";
import { useEffect } from "react";
import { usePageTitle } from "../contexts/PageTitleContext";

/**
 * Hook para definir o título da página manualmente
 * @param title - Título personalizado para a página
 */
export function useSetPageTitle(title: string) {
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    if (title) {
      setPageTitle(title);
    }
  }, [title, setPageTitle]);
}

/**
 * Hook para obter e definir o título da página
 * @returns { pageTitle, setPageTitle } - Título atual e função para definir
 */
export function usePageTitleManager() {
  const { pageTitle, setPageTitle } = usePageTitle();

  return {
    pageTitle,
    setPageTitle,
  };
}
