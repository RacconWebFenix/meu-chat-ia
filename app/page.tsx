"use client"; // Importante para habilitar React Client Component no Next.js App Router
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Header from "./components/Header/Header";
import Link from "next/link";
import { useState } from "react";

import ChatBoot from "./components/ChatBoot/ChatBoot";
import CustomChat from "./components/ChatPDM/ChatPDM";
import TabsSwitcher from "./components/TabsSwitcher/TabsSwitcher";
import SearchPrice from "./components/SearchPrice/SearchPrice";

export default function HomePage() {
  const [tab, setTab] = useState<"custom" | "boot" | "pricesearch">("pricesearch");

  return (
    <main style={{ maxWidth: 1200, margin: "2rem auto", padding: "0 1rem" }}>
      <Header />

      <TabsSwitcher tab={tab} setTab={setTab} />

      {tab === "boot" && <ChatBoot />}
      {tab === "custom" && <CustomChat />}
      {tab === "pricesearch" && <SearchPrice />}

      <Link href="/feedbacks">Ver Feedbacks</Link>
    </main>
  );
}
