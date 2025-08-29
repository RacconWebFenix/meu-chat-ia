"use client";
import { createContext, useContext, useState, useEffect } from "react";

export type LayoutType = "layout1" | "layout2" | "layout3";

interface LayoutContextType {
  currentLayout: LayoutType;
  setCurrentLayout: (layout: LayoutType) => void;
}

const LayoutContext = createContext<LayoutContextType>({
  currentLayout: "layout1",
  setCurrentLayout: () => {},
});

export const useLayout = () => useContext(LayoutContext);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [currentLayout, setCurrentLayout] = useState<LayoutType>("layout1");

  // Carrega layout salvo no localStorage
  useEffect(() => {
    const savedLayout = localStorage.getItem("selectedLayout") as LayoutType;
    if (
      savedLayout &&
      ["layout1", "layout2", "layout3"].includes(savedLayout)
    ) {
      setCurrentLayout(savedLayout);
    }
  }, []);

  const handleLayoutChange = (layout: LayoutType) => {
    setCurrentLayout(layout);
    localStorage.setItem("selectedLayout", layout);
  };

  return (
    <LayoutContext.Provider
      value={{
        currentLayout,
        setCurrentLayout: handleLayoutChange,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}
