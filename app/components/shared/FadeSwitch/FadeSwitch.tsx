import React, { useEffect, useState, ReactElement } from "react";
import styles from "./FadeSwitch.module.scss";

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
    <div
      className={`${styles.fadeSwitch} ${visible ? styles.visible : ""}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {childToShow}
    </div>
  );
}
