"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar automaticamente para a página inicial
    router.replace("/");
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px",
        color: "#666",
      }}
    >
      Redirecionando para Pesquisa de Materiais...
    </div>
  );
}
