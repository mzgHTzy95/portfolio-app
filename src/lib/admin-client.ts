import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client for admin server-side operations.
 * Uses the service role key so it bypasses RLS — only call this from
 * server components / route handlers / server actions after auth check.
 */
export function adminClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
