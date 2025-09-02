/**
 * Mock Mode Context
 * Context to manage mock/real data mode
 */

import React, { createContext, useContext, useState, ReactNode } from "react";

interface MockModeContextType {
  isMockMode: boolean;
  toggleMockMode: () => void;
}

const MockModeContext = createContext<MockModeContextType | undefined>(
  undefined
);

interface MockModeProviderProps {
  children: ReactNode;
}

export const MockModeProvider: React.FC<MockModeProviderProps> = ({
  children,
}) => {
  const [isMockMode, setIsMockMode] = useState(true); // Default to mock mode

  const toggleMockMode = () => {
    setIsMockMode((prev) => !prev);
  };

  return (
    <MockModeContext.Provider value={{ isMockMode, toggleMockMode }}>
      {children}
    </MockModeContext.Provider>
  );
};

export const useMockMode = (): MockModeContextType => {
  const context = useContext(MockModeContext);
  if (!context) {
    throw new Error("useMockMode must be used within a MockModeProvider");
  }
  return context;
};
