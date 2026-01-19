import { supabaseAdmin } from './admin';

export interface User {
    id?: string;
    email: string;
    name: string;
    password?: string;
    created_at?: string;
}

export async function findUserByEmail(email: string) {
    const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error finding user:', error);
        throw error;
    }

    return data;
}

export async function createUser(user: User) {
    const { data, error } = await supabaseAdmin
        .from('users')
        .insert([user])
        .select()
        .single();

    if (error) {
        console.error('Error creating user:', error);
        throw error;
    }

    return data;
}
