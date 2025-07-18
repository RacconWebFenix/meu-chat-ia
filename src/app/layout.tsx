import { AppProvider } from "../contexts/AppProvider";

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body>
        <AppProvider>{props.children}</AppProvider>
      </body>
    </html>
  );
}
