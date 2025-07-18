import MainLayout from "@/components/MainLayout/MainLayout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
