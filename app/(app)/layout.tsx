import Header from "../components/Header/Header";

import "../globals.css";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div>{children}</div>
    </>
  );
}
