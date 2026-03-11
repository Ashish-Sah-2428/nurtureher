import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase Configuration
const SUPABASE_URL = 'https://ntglfzqujpywvylrzjju.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50Z2xmenF1anB5d3Z5bHJ6amp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NTYwNDIsImV4cCI6MjA4ODAzMjA0Mn0.VOhVlNVKCaPu2nf-8jVvPT9sObXwg4INFfcAukdrLSk';

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !SUPABASE_ANON_KEY.includes('YOUR_ANON_KEY_HERE');
};

// Only create client if properly configured
let _supabase: SupabaseClient | null = null;

export const supabase: SupabaseClient = (() => {
  if (isSupabaseConfigured()) {
    _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
    });
    console.log('🔧 Supabase Client Initialized:', SUPABASE_URL);
    return _supabase;
  }
  
  // Return a dummy proxy that won't crash if accidentally used
  console.log('⚠️ Supabase not configured - using local database');
  return new Proxy({} as SupabaseClient, {
    get: (_target, prop) => {
      if (prop === 'auth') {
        return new Proxy({}, {
          get: () => () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
        });
      }
      if (prop === 'from') {
        return () => new Proxy({}, {
          get: () => () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
        });
      }
      return () => Promise.resolve({ data: null, error: new Error('Supabase not configured') });
    }
  });
})();

// Database Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor' | 'psychiatrist' | 'super_admin';
  category?: string;
  depression_level?: string;
  last_assessment_date?: string;
  created_at: string;
}

export interface Assessment {
  id: string;
  user_id: string;
  user_email: string;
  category: string;
  answers: Record<string, any>;
  additional_notes: string;
  depression_level: string;
  review_status: 'pending' | 'reviewed' | 'approved';
  review_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  mood: string;
  emoji: string;
  note: string;
  activities: string[];
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood?: string;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  user_name: string;
  content: string;
  anonymous: boolean;
  likes: number;
  liked_by: string[];
  created_at: string;
}