"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { GridRow } from "../types/api.types";

// Grid Context Types
export interface GridContextType {
  selectedGrid: GridRow[];
  setSelectedGrid: (grid: GridRow[]) => void;
  inputHeaders: string[];
  setInputHeaders: (headers: string[]) => void;
  inputRows: string[];
  setInputRows: (rows: string[]) => void;
  clearGrid: () => void;
}

// Grid Context
const GridContext = createContext<GridContextType | undefined>(undefined);

// Grid Provider
export function GridProvider({ children }: { children: ReactNode }) {
  const [selectedGrid, setSelectedGrid] = useState<GridRow[]>([]);
  const [inputHeaders, setInputHeaders] = useState<string[]>([]);
  const [inputRows, setInputRows] = useState<string[]>([]);

  const clearGrid = () => {
    setSelectedGrid([]);
    setInputHeaders([]);
    setInputRows([]);
  };

  const value: GridContextType = {
    selectedGrid,
    setSelectedGrid,
    inputHeaders,
    setInputHeaders,
    inputRows,
    setInputRows,
    clearGrid,
  };

  return <GridContext.Provider value={value}>{children}</GridContext.Provider>;
}

// Grid Hook
export function useGrid(): GridContextType {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error("useGrid must be used within a GridProvider");
  }
  return context;
}
