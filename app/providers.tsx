"use client";
import React, { createContext, useContext, useState } from "react";

type SelectGridContextType = {
  valor: string;
  setValor: (v: string) => void;
};

// Cria o contexto
export const SelectGridContext = createContext<SelectGridContextType>({
  valor: "",
  setValor: () => {},
});

export function useTesteContext() {
  return useContext(SelectGridContext);
}

export default function SelectedGridProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [valor, setValor] = useState("teste");

  return (
    <SelectGridContext.Provider value={{ valor, setValor }}>
      {children}
    </SelectGridContext.Provider>
  );
}
