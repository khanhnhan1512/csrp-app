import { createClient } from "@supabase/supabase-js";
import { getEnv } from "@/lib/env";

// Reports live in the dedicated "csrp" schema — the Supabase project is shared
// with another app, so this schema keeps the two isolated. The schema must be
// listed under "Exposed schemas" in the project's Data API settings.
function makeClient() {
  return createClient(getEnv("SUPABASE_URL"), getEnv("SUPABASE_SECRET_KEY"), {
    db: { schema: "csrp" },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

let client: ReturnType<typeof makeClient> | null = null;

export function getSupabase() {
  if (typeof window !== "undefined") {
    throw new Error("Supabase client uses the secret key and is server-only");
  }
  if (!client) client = makeClient();
  return client;
}
