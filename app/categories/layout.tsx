// app/categories/layout.tsx
import AppShell from "@/components/layout/AppShell";

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
