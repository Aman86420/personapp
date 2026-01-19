import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET() {
    try {
        // Attempt a dummy query to verify connectivity.
        // Replace 'test_table' with a real table name if you want to test data fetching.
        // For now, we'll just check if the client can be initialized and handle a basic request.
        const { error } = await supabaseAdmin
            .from('_test_connection') // This is a dummy table name
            .select('*', { count: 'exact', head: true })
            .limit(1);

        // If the error is 'PGRST116' (table not found), it still means we connected to the database!
        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return NextResponse.json({
            status: 'success',
            message: 'Supabase connectivity verified (Admin Client)',
            connection_details: {
                url_configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
                service_role_configured: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
            },
            db_response: error ? `Connected, but table not found (Expected if using dummy name): ${error.message}` : 'Table found and queried successfully',
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            {
                status: 'error',
                message: 'Failed to connect to Supabase',
                error: errorMessage,
            },
            { status: 500 }
        );
    }
}
