"use client";

import Image from "next/image";
import { signOut } from "next-auth/react";
import { FiLogOut } from "react-icons/fi"; // Exemplo com react-icons
import styles from "./Header.module.scss";
import { useRouter } from "next/navigation"; // Corrija aqui!


export default function Header() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <Image
              src="/assets/logo-comercio-integrado.png"
              alt="Comércio Integrado"
              width={150}
              height={0}
            />
          </div>

          <div>
            <h1 className={styles.title}>
              Pesquisa e Identificação de Materiais
            </h1>
          </div>

          {/* Botão de sair */}
          <button
            className={styles.logoutButton}
            onClick={handleSignOut}
            title="Sair"
          >
            <FiLogOut size={24} />
          </button>
        </div>
      </header>
      <p className={styles.emptyMessage}>
        Bem vindo ao ambiente de pesquisa da Comércio Integrado
      </p>
    </>
  );
}
