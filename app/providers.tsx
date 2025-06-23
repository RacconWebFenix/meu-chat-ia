"use client";
import React, { createContext, useContext, useState } from "react";

export type GridRow = Record<string, string | number>;

type SelectGridContextType = {
  selectedGrid: GridRow[];
  setSelectedGrid: (v: GridRow[]) => void;
};

// Cria o contexto
export const SelectGridContext = createContext<SelectGridContextType>({
  selectedGrid: [],
  setSelectedGrid: () => {},
});

export function useSelectedGridContext() {
  return useContext(SelectGridContext);
}

export default function SelectedGridProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedGrid, setSelectedGrid] = useState<GridRow[]>([]);

  return (
    <SelectGridContext.Provider value={{ selectedGrid, setSelectedGrid }}>
      {children}
    </SelectGridContext.Provider>
  );
}
