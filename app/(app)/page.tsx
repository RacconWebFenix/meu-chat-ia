"use client"; // Importante para habilitar React Client Component no Next.js App Router
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useState } from "react";
import Link from "next/link";

import ChatBoot from "../components/ChatBoot/ChatBoot";
import ChatPDM from "../components/ChatPDM/ChatPDM";
import TabsSwitcher from "../components/TabsSwitcher/TabsSwitcher";
import FadeSwitch from "../components/shared/FadeSwitch/FadeSwitch";

export default function HomePage() {
  const [tab, setTab] = useState<"pdm" | "equivalencia">("equivalencia");

  return (
    <main style={{ maxWidth: 1200, margin: "2rem auto", padding: "0 1rem" }}>
     
      <TabsSwitcher tab={tab} setTab={setTab} />

      <FadeSwitch activeKey={tab} duration={400}>
        <div key="equivalencia">
          <ChatBoot />
        </div>
        <div key="pdm">
          <ChatPDM />
        </div>
      </FadeSwitch>

      <Link href="/feedbacks">Ver Feedbacks</Link>
    </main>
  );
}
