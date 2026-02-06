import { createClient } from '@supabase/supabase-js';
import { env } from '@/config/env';

/**
 * Check if using mock Supabase
 */
const isMockSupabase = env.VITE_SUPABASE_URL.includes('mock.supabase.co');

/**
 * Supabase client instance
 * Uses validated environment variables from env.ts
 * In mock mode, creates a client but it won't actually connect
 */
export const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: !isMockSupabase,
      persistSession: !isMockSupabase,
      detectSessionInUrl: !isMockSupabase,
    },
  }
);

/**
 * Export mock flag for components that need it
 */
export const isSupabaseMock = isMockSupabase;
