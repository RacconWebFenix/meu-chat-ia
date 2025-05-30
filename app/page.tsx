"use client"; // Importante para habilitar React Client Component no Next.js App Router
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Header from "./components/Header/Header";
import Link from "next/link";
import { useState } from "react";

import ChatBoot from "./components/ChatBoot/ChatBoot";
import styles from "./page.module.scss";
import CustomChat from "./components/CustomChat/CustomChat";

export default function HomePage() {
  const [tab, setTab] = useState<"custom" | "boot">("custom");

  return (
    <main style={{ maxWidth: 1200, margin: "2rem auto", padding: "0 1rem" }}>
      <Header />

      <div className={styles.tabsContainer}>
        <button
          onClick={() => setTab("custom")}
          className={`${styles.tabButton} ${styles.tabButtonLeft}`}
          style={{
            background: tab === "custom" ? "#e3eaf2" : "#1976d2",
            color: tab === "custom" ? "#1976d2" : "#fff",
          }}
        >
          Descrição e PDM
        </button>
        <button
          onClick={() => setTab("boot")}
          className={`${styles.tabButton} ${styles.tabButtonRight}`}
          style={{
            background: tab === "boot" ? "#e3eaf2" : "#1976d2",
            color: tab === "boot" ? "#1976d2" : "#fff",
          }}
        >
          Pesquisa de Materiais
        </button>
      </div>

      {tab === "custom" && <CustomChat />}
      {tab === "boot" && <ChatBoot />}

      <Link href="/feedbacks">Ver Feedbacks</Link>
    </main>
  );
}
