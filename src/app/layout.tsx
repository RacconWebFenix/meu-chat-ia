import { AppProvider } from "../contexts/AppProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CIB2B Chat IA",
  description: "Sistema de Chat com IA para análise de dados",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <AppProvider>{props.children}</AppProvider>
      </body>
    </html>
  );
}
