import { createClient } from '@supabase/supabase-js'

// Using process.env for server-side if needed, but for frontend use import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase credentials missing. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.")
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '')
