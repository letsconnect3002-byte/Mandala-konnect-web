import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gvzblxozqftheowpazvx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2emJseG96cWZ0aGVvd3BhenZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMzEwNDQsImV4cCI6MjA5NDkwNzA0NH0.nEA542Y-2vVr89D-5DAO6Hj3kLxaRqc15E3ZlirvtTE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
