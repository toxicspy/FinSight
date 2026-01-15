import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL

// Public client for frontend (uses Anon Key)
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Admin client for backend (uses Service Role Key)
// Note: Never expose Service Role Key to the frontend!
// This is used in server-side logic only.
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl || '', supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase public credentials missing. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.")
}

if (!supabaseServiceRoleKey) {
  console.warn("Supabase service role key missing. Admin functionality may be limited.")
}
