import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qscblameyudtivmwretx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzY2JsYW1leXVkdGl2bXdyZXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0ODcwNDYsImV4cCI6MjA3MzA2MzA0Nn0.uCSXFx5UZGpWxuADFnAwZRQfYyut7pcEb6Px9yzIGdA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          country: string;
          residence: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          display_name: string;
          country: string;
          residence: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string;
          country?: string;
          residence?: string;
          created_at?: string;
        };
      };
      colleges: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'reach' | 'target' | 'safety';
          country: string;
          deadlines: any;
          progress: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: 'reach' | 'target' | 'safety';
          country: string;
          deadlines: any;
          progress?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: 'reach' | 'target' | 'safety';
          country?: string;
          deadlines?: any;
          progress?: number;
          created_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          deadline: string;
          status: 'pending' | 'in-progress' | 'completed';
          type: 'application' | 'essay' | 'test' | 'custom';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          deadline: string;
          status?: 'pending' | 'in-progress' | 'completed';
          type: 'application' | 'essay' | 'test' | 'custom';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          deadline?: string;
          status?: 'pending' | 'in-progress' | 'completed';
          type?: 'application' | 'essay' | 'test' | 'custom';
          created_at?: string;
        };
      };
      chats: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          messages: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          messages: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          messages?: any;
          created_at?: string;
        };
      };
    };
  };
}