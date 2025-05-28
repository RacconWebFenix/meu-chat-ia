"use client"; // Importante para habilitar React Client Component no Next.js App Router
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Header from "./components/Header/Header";

import ChatBoot from "./components/ChatBoot/ChatBoot";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 1200, margin: "2rem auto", padding: "0 1rem" }}>
      <Header />
      <ChatBoot />
    </main>
  );
}
