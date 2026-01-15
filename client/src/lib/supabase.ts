import { createClient } from '@supabase/supabase-js';

// Frontend client (PUBLIC)
// We use the ! operator because we expect these to be defined in the environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log values for debugging (will show in browser console)
console.log('Supabase Config:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  isPlaceholder: supabaseUrl?.includes('${')
});

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'undefined' || supabaseUrl.includes('${')) {
  console.error("Supabase environment variables are missing or invalid! Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Replit Secrets.", { supabaseUrl });
}

// In Replit development, VITE_ variables might not be replaced if they reference secrets directly in shell
// We'll provide a fallback to ensure the client can initialize without crashing.
// For the auth flow to work, the URL must be a valid Supabase project URL.
// The origin of the current preview is used as a fallback to avoid Invalid URL errors.
const finalUrl = (supabaseUrl && !supabaseUrl.includes('${')) 
  ? supabaseUrl 
  : 'https://9d13760f-95e0-43c3-a624-57f81bb49fea-00-3owtwvc67afpy.spock.replit.dev'; 

const finalKey = (supabaseAnonKey && !supabaseAnonKey.includes('${')) 
  ? supabaseAnonKey 
  : 'placeholder-key';

export const supabase = createClient(finalUrl, finalKey);
