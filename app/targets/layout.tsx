import AppShell from "@/components/layout/AppShell";

export default function TargetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
