import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "./Sidebar";
import { NavBottom } from "./NavBottom";

export default async function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen bg-zinc-100/90 overflow-hidden">
      <Sidebar role={session.role} />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative md:ml-64">
        <div className="flex-1 overflow-y-auto p-4 pb-28 md:p-8">
          {children}
        </div>
      </main>

      <NavBottom role={session.role} />
    </div>
  );
}
