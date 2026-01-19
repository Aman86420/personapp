import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Admin client for use in Server Components, API routes, and Server Actions.
 * This client uses the Service Role Key and BYPASSES Row Level Security (RLS).
 * 
 * IMPORTANT: NEVER expose this client or the service role key to the client side.
 */
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);
