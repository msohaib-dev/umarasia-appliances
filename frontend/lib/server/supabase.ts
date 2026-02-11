import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const fallbackUrl = "https://placeholder-supabase.local";
const fallbackKey = "placeholder-service-role-key";

export const supabase = createClient(supabaseUrl || fallbackUrl, serviceRoleKey || fallbackKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

export const ensureSupabaseConfigured = () => {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured.");
  }

  try {
    const parts = serviceRoleKey.split(".");
    if (parts.length >= 2) {
      const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf8"));
      const role = String(payload?.role || "");
      if (role && role !== "service_role") {
        throw new Error("SUPABASE_SERVICE_ROLE_KEY is invalid: expected service_role key, received non-service token.");
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is invalid.");
  }
};
