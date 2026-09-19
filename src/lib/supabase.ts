import { createClient } from "@supabase/supabase-js";

// Read Supabase credentials from Vite environment variables
const rawUrl = import.meta.env.VITE_SUPABASE_URL || "https://nioyqlsvpfkyfwbvggzs.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pb3lxbHN2cGZreWZ3YnZnZ3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MzE3NzMsImV4cCI6MjEwNTQwNzc3M30.E6KKDGbfECZHfv_BlU11ctr2LVio1s69kjpitbi__wA";

// Format URL cleanly if missing protocol or if publishable key reference string passed
const supabaseUrl = rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
  ? rawUrl
  : `https://nioyqlsvpfkyfwbvggzs.supabase.co`;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
