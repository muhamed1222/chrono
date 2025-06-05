import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

const createSupabase = () =>
  createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

if (supabaseUrl && supabaseAnonKey) {
  supabase = createSupabase();
} else {
  console.error('Missing Supabase environment variables');
}

export const getSupabase = (): SupabaseClient => {
  if (supabase) return supabase;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase credentials not configured');
  }
  supabase = createSupabase();
  return supabase;
};

// Helper to handle Supabase errors
export const handleSupabaseError = (error: unknown) => {
  console.error('Supabase error:', error);
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }
  return 'An unexpected error occurred';
};
