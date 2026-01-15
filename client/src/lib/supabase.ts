import { createClient } from '@supabase/supabase-js';

// Frontend client (PUBLIC)
// We use the ! operator because we expect these to be defined in the environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are missing! Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Replit Secrets.");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
