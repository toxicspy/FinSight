import { createClient } from '@supabase/supabase-js';

// Backend client (ADMIN)
// Always use process.env for backend secrets
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
