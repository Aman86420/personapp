import { createClient } from "@supabase/supabase-js";

/**
 * Standard Supabase client for use in Client Components.
 * This client uses the public anonymous key and is restricted by Row Level Security (RLS).
 */
export const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
