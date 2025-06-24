"use client";
import React, { createContext, useContext, useState } from "react";

export type GridRow = Record<string, string | number>;

// Novo tipo para o contexto
export type SelectGridContextType = {
  selectedGrid: GridRow[];
  setSelectedGrid: (v: GridRow[]) => void;
  inputHeaders: string[];
  setInputHeaders: (v: string[]) => void;
  inputRows: string[];
  setInputRows: (v: string[]) => void;
};

// Cria o contexto
export const SelectGridContext = createContext<SelectGridContextType>({
  selectedGrid: [],
  setSelectedGrid: () => {},
  inputHeaders: [],
  setInputHeaders: () => {},
  inputRows: [],
  setInputRows: () => {},
});

export function useSelectedGridContext() {
  return useContext(SelectGridContext);
}

// Atualiza o provider para receber as novas props
export default function SelectedGridProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedGrid, setSelectedGrid] = useState<GridRow[]>([]);
  const [inputHeaders, setInputHeaders] = useState<string[]>([]);
  const [inputRows, setInputRows] = useState<string[]>([]);

  return (
    <SelectGridContext.Provider
      value={{
        selectedGrid,
        setSelectedGrid,
        inputHeaders,
        setInputHeaders,
        inputRows,
        setInputRows,
      }}
    >
      {children}
    </SelectGridContext.Provider>
  );
}
