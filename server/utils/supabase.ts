import { createClient } from '@supabase/supabase-js';

let supabaseInstance: ReturnType<typeof createClient> | null = null;
let initialized = false;

export function useSupabase() {
  if (initialized) {
    return supabaseInstance;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;

  if (url && key) {
    console.info('Supabase configurations detected. Initializing Supabase client.');
    supabaseInstance = createClient(url, key);
  } else {
    console.warn(
      'Supabase URL or Key is missing. Server APIs will run in LOCAL fallback mode using public/content/content.json.'
    );
  }

  initialized = true;
  return supabaseInstance;
}
