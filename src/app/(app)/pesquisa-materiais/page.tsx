"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useState } from "react";
import { Box, Container } from "@mui/material";
import { TabsSwitcher, FadeSwitch } from "@/components/shared";
import ChatBoot from "@/components/ChatBoot/ChatBoot";
import ChatPDM from "@/components/ChatPDM/ChatPDM";

export default function PesquisaMateriaisPage() {
  const [tab, setTab] = useState<"pdm" | "equivalencia">("equivalencia");

  return (
    <Container maxWidth="xl" disableGutters>
      <Box sx={{ width: "100%" }}>
        <TabsSwitcher tab={tab} setTab={setTab} />

        <FadeSwitch activeKey={tab} duration={400}>
          <div key="equivalencia">
            <ChatBoot />
          </div>
          <div key="pdm">
            <ChatPDM />
          </div>
        </FadeSwitch>
      </Box>
    </Container>
  );
}
