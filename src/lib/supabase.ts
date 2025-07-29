import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Staff = {
  staffid: number;
  staffname: string;
  tag: number;
  email: string;
  lab: string;
};

export type CheckIn = {
  id: string;
  staffid: number;
  tag: number;
  time_collected: string;
  staff?: Staff[];
};

export type Control = {
  id: string;
  mode: string;
  staffid: number;
  created_at: string;
};