import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const SESSION_COOKIE = "admin_session";
const SESSION_TTL_DAYS = 7;

function getServiceClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

/**
 * Validate the admin password and create a session row + cookie.
 * Returns true on success.
 */
export async function loginWithPassword(password: string): Promise<boolean> {
  if (password !== ADMIN_PASSWORD) return false;

  const token = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_TTL_DAYS);

  const supabase = getServiceClient();
  const { error } = await supabase
    .from("admin_sessions")
    .insert({ token, expires_at: expiresAt.toISOString() });

  if (error) return false;

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  return true;
}

/**
 * Check the current session cookie against the sessions table.
 * Returns true if the session is valid and not expired.
 */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return false;

  const supabase = getServiceClient();
  const { data } = await supabase
    .from("admin_sessions")
    .select("expires_at")
    .eq("token", token)
    .maybeSingle();

  if (!data) return false;
  if (new Date(data.expires_at) < new Date()) return false;
  return true;
}

/**
 * Destroy the current session.
 */
export async function logout(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    const supabase = getServiceClient();
    await supabase.from("admin_sessions").delete().eq("token", token);
  }
  store.delete(SESSION_COOKIE);
}

export { SESSION_COOKIE };
