import { getAllUsers } from "@/lib/actions/admin";
import UsersClient from "./UsersClient";

export const metadata = { title: "Users – mymoney Admin" };

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="section-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="text-surface-500 text-sm mt-0.5">
            {users.length} registered users
          </p>
        </div>
      </div>

      <UsersClient
        users={users.map((u: any) => ({
          ...u,
          createdAt: u.created_at.toISOString(),
          tenantId: u.tenant_id,
        }))}
      />
    </div>
  );
}
