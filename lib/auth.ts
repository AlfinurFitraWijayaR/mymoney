// lib/auth.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { Role } from "@prisma/client";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "fallback-dev-secret-change-in-production",
);

const COOKIE_NAME = "mymoney_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  userId: string;
  username: string;
  role: Role;
  tenantId: string;
  iat?: number;
  exp?: number;
}

// ── Token helpers ──────────────────────────────────────────────────────────────

export async function signToken(payload: Omit<SessionPayload, "iat" | "exp">) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// ── Session helpers ────────────────────────────────────────────────────────────

export async function createSession(
  payload: Omit<SessionPayload, "iat" | "exp">,
) {
  const token = await signToken(payload);
  const cookieStore = cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function destroySession() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ── Auth guards ────────────────────────────────────────────────────────────────

/** Returns session or throws (use in server components / actions) */
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHENTICATED");
  return session;
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireAuth();
  if (session.role !== "ADMIN") throw new Error("FORBIDDEN");
  return session;
}

// ── Login ──────────────────────────────────────────────────────────────────────

export async function login(username: string, password: string) {
  const bcrypt = await import("bcryptjs");

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return { error: "Invalid username or password" };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { error: "Invalid username or password" };

  await createSession({
    userId: user.id,
    username: user.username,
    role: user.role,
    tenantId: user.tenant_id,
  });

  return { success: true, role: user.role };
}
