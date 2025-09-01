"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar automaticamente para a página de identificação de materiais
    router.replace("/identificacao-materiais");
  }, [router]);

  return null; // Não renderizar nada enquanto redireciona
}
