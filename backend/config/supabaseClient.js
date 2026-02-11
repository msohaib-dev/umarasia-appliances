const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const isProduction = process.env.NODE_ENV === "production";
const useDummyDataEnv = String(process.env.USE_DUMMY_DATA || "true").toLowerCase() === "true";
const useDummyData = isProduction ? false : useDummyDataEnv;

const supabaseKey = supabaseServiceRoleKey || supabaseAnonKey;
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

let supabase = null;

if (!useDummyData && isSupabaseConfigured) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

if (isProduction && !isSupabaseConfigured) {
  throw new Error("Supabase is required in production. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
}

const isSupabaseEnabled = Boolean(supabase);

module.exports = {
  supabase,
  useDummyData,
  isSupabaseConfigured,
  isSupabaseEnabled
};
