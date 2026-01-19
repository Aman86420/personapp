import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('form_submissions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({
            message: "Success",
            days: data
        });
    } catch (error) {
        return NextResponse.json({
            message: "Error fetching data",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Log received data for debugging
        console.log("Received data:", body);

        // Insert into Supabase
        // Note: This assumes a table 'form_submissions' exists with columns matching the keys in 'body'
        // or that 'body' is a JSON object stored in a single column.
        // For flexibility, we'll try to insert the whole object.
        const { data, error } = await supabaseAdmin
            .from('form_submissions')
            .insert([body])
            .select();

        if (error) throw error;

        return NextResponse.json({
            message: "Data saved successfully",
            data: data
        }, { status: 201 });
    } catch (error) {
        console.error("Submission error:", error);
        return NextResponse.json({
            message: "Error processing request",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 400 });
    }
}
