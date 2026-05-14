// app/login/page.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "./LoginForm";
import Image from "next/image";

export const metadata = { title: "Sign In – mymoney" };

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect(session.role === "ADMIN" ? "/admin" : "/dashboard");

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-surface-100 via-surface-50 to-brand-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-brand-200/30 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-surface-200/20 blur-2xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="card p-8 shadow-xl border-surface-100">
          <Image
            src="/logo.svg"
            width={150}
            height={150}
            alt="logo"
            className="mx-auto"
          />
          <div className="mb-6 mt-5">
            <h2 className="font-display text-xl font-semibold text-surface-900">
              Selamat datang
            </h2>
            <p className="text-surface-500 text-sm mt-0.5">
              Login ke akun Anda untuk melanjutkan
            </p>
          </div>

          <LoginForm />
        </div>

        <p className="text-center text-xs text-surface-400 mt-4">
          Secured with end-to-end encryption
        </p>
      </div>
    </main>
  );
}
