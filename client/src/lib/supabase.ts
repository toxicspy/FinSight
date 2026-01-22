import { createClient } from "@supabase/supabase-js";

// Frontend client (PUBLIC)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Log status for debugging
console.log("Supabase Status:", {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
