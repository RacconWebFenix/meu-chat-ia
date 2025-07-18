"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

import { AuthCard } from "@/components/shared";

import LoginForm from "./LoginForm";

export default function LoginPage() {
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
        title="Acesse sua conta"
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
      title="Acesse sua conta"
    >
      <LoginForm />
    </AuthCard>
  );
}
