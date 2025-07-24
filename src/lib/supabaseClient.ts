import { createClient } from '@supabase/supabase-js';

// Read environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that environment variables exist
if (!supabaseUrl) {
    throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
    throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on the schema
export interface Book {
    id: string;
    title: string;
    author: string | null;
    cover_url: string | null;
    owner_id: string;
    is_available: boolean;
    is_active: boolean;
}

export interface User {
    id: string;
    name: string;
    favorite_book_id: string | null;
    is_active: boolean;
}

export interface Loan {
    book_id: string;
    borrower_id: string;
    loan_date: string;
    returned_date: string | null;
}
