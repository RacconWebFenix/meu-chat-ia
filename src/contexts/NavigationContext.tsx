"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface NavigationContextType {
  isNavigating: boolean;
  setIsNavigating: (loading: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
  setIsNavigating: () => {},
});

export const useNavigation = () => useContext(NavigationContext);

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  // Reset loading when pathname changes
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  return (
    <NavigationContext.Provider value={{ isNavigating, setIsNavigating }}>
      {children}
    </NavigationContext.Provider>
  );
}
