// app/admin/page.tsx
import Link from "next/link";
import { getAdminStats } from "@/lib/actions/admin";
import { getSession } from "@/lib/auth";

export const metadata = { title: "Admin Panel – mymoney" };

export default async function AdminPage() {
  const [stats, session] = await Promise.all([getAdminStats(), getSession()]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="page-title">Admin Panel</h1>
        <p className="text-surface-500 text-sm mt-0.5">
          System overview · Logged in as{" "}
          <span className="font-medium text-surface-700">
            {session?.username}
          </span>
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Users",
            value: stats.totalUsers,
            color: "brand",
            icon: "👥",
          },
          {
            label: "Members",
            value: stats.memberCount,
            color: "sky",
            icon: "👤",
          },
          {
            label: "Admins",
            value: stats.adminCount,
            color: "violet",
            icon: "🛡️",
          },
          {
            label: "Transactions",
            value: stats.txCount,
            color: "emerald",
            icon: "💳",
          },
        ].map((s: any) => (
          <div key={s.label} className="stat-card">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-2xl font-display font-semibold text-surface-900 tabular-nums">
                {s.value}
              </p>
              <p className="text-sm text-surface-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-base font-semibold text-surface-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/users"
            className="card p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow group"
          >
            <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
              <svg
                className="w-5 h-5 text-brand-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-surface-900">Manage Users</p>
              <p className="text-sm text-surface-500">
                Create, edit, delete users
              </p>
            </div>
            <svg
              className="w-4 h-4 text-surface-300 ml-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </Link>

          <div className="card p-5 flex items-center gap-4 opacity-60 cursor-not-allowed">
            <div className="w-10 h-10 rounded-lg bg-surface-50 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-surface-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-surface-900">Analytics</p>
              <p className="text-sm text-surface-500">Coming soon</p>
            </div>
            <span className="ml-auto text-xs bg-surface-100 text-surface-500 px-2 py-0.5 rounded-full">
              Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
