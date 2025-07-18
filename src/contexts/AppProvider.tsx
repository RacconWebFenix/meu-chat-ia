"use client";
import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import MaterialUIProvider from "../components/providers/MaterialUIProvider";
import { NavigationProvider } from "./NavigationContext";
import { PageTitleProvider } from "./PageTitleContext";
import { GridProvider } from "./GridContext";
import GlobalNavigationLoading from "../components/shared/GlobalNavigationLoading";

// Main App Provider - combines all providers
export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <MaterialUIProvider>
        <NavigationProvider>
          <PageTitleProvider>
            <GridProvider>
              <GlobalNavigationLoading />
              {children}
            </GridProvider>
          </PageTitleProvider>
        </NavigationProvider>
      </MaterialUIProvider>
    </SessionProvider>
  );
}
