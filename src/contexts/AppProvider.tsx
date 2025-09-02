// src/contexts/AppProvider.tsx
"use client";
import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import MaterialUIProvider from "../components/providers/MaterialUIProvider";
import { NavigationProvider } from "./NavigationContext";
import { PageTitleProvider } from "./PageTitleContext";
import { GridProvider } from "./GridContext";
import { GroupProvider } from "./GroupContext";
import { AuthProvider } from "./AuthContext";
import GlobalNavigationLoading from "../components/shared/GlobalNavigationLoading";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <MaterialUIProvider>
          <NavigationProvider>
            <PageTitleProvider>
              <GridProvider>
                <GroupProvider>
                  <GlobalNavigationLoading />
                  {children}
                </GroupProvider>
              </GridProvider>
            </PageTitleProvider>
          </NavigationProvider>
        </MaterialUIProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
