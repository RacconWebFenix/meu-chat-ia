"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

import { AuthCard } from "@/components/shared";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evita problemas de hidratação mostrando apenas depois que o componente montou
  if (!mounted) {
    return (
      <AuthCard
        logo={
          <Image
            src="/assets/logo-comercio-integrado.png"
            alt="Comércio Integrado"
            width={184}
            height={80}
            priority
          />
        }
        title="Criar nova conta"
      >
        {/* O AuthCard exige children, então adicionamos um elemento vazio */}
        {null}
      </AuthCard>
    );
  }

  return (
    <AuthCard
      logo={
        <Image
          src="/assets/logo-comercio-integrado.png"
          alt="Comércio Integrado"
          width={184}
          height={80}
          priority
        />
      }
      title="Criar nova conta"
    >
      <RegisterForm />
    </AuthCard>
  );
}
