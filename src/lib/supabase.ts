import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use placeholders to prevent the client from throwing an error on initialization
// if environment variables are missing (e.g. during first deploy).
const placeholderUrl = 'https://placeholder.supabase.co';
const placeholderKey = 'placeholder';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase configuration missing! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file or Netlify settings.'
  );
}

export const supabase = createClient(
  supabaseUrl || placeholderUrl, 
  supabaseAnonKey || placeholderKey
);

// Helper to check if supabase is actually configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);
