import React, { useEffect, useState, ReactElement } from "react";
import { Box, Fade } from "@mui/material";

interface FadeSwitchProps {
  activeKey: string | number;
  duration?: number;
  children: React.ReactNode;
}

export default function FadeSwitch({
  activeKey,
  duration = 400,
  children,
}: FadeSwitchProps) {
  const [displayedKey, setDisplayedKey] = useState(activeKey);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (activeKey !== displayedKey) {
      setVisible(false);
      const timeout = setTimeout(() => {
        setDisplayedKey(activeKey);
        setVisible(true);
      }, duration);
      return () => clearTimeout(timeout);
    }
  }, [activeKey, displayedKey, duration]);

  // Type-safe: só considera ReactElement
  const childToShow = React.Children.toArray(children).find(
    (child): child is ReactElement =>
      React.isValidElement(child) &&
      String(child.key).replace(/^\.\$?/, "") === String(displayedKey)
  );

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <Fade
        in={visible}
        timeout={duration}
        style={{
          transitionTimingFunction: "ease-in-out",
        }}
      >
        <Box sx={{ width: "100%" }}>{childToShow}</Box>
      </Fade>
    </Box>
  );
}
