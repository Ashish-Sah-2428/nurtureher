import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { db } from '../utils/database';

interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'patient' | 'doctor' | 'psychiatrist' | 'super_admin';
  category?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getValidToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    console.log('🔐 AuthProvider: Checking for existing session...');
    
    // Clear any old corrupted data from previous demo sessions
    try {
      const raw = localStorage.getItem('nurtureher_database');
      if (raw) {
        const parsed = JSON.parse(raw);
        // If old demo users exist, clear database for fresh start
        const hasDemoUsers = parsed?.users?.some?.((u: any) => 
          u.email === 'patient@demo.com' || u.email === 'admin@demo.com' || u.email === 'doctor@demo.com'
        );
        if (hasDemoUsers) {
          console.log('🧹 Clearing old demo data for production...');
          localStorage.removeItem('nurtureher_database');
          localStorage.removeItem('nurtureher_database_backup');
          localStorage.removeItem('auth_token');
        }
      }
    } catch {
      // If data is corrupted, clear it
      localStorage.removeItem('nurtureher_database');
      localStorage.removeItem('nurtureher_database_backup');
    }
    
    // Initialize database
    db.initializeDatabase();
    console.log('✅ Database initialized');
    
    const storedToken = localStorage.getItem('auth_token');
    
    if (storedToken) {
      console.log('Found stored token, verifying...');
      const currentUser = db.verifyToken(storedToken);
      
      if (currentUser) {
        console.log('✅ Session valid, user:', currentUser.email);
        setUser(currentUser);
        setAccessToken(storedToken);
      } else {
        console.log('❌ Session expired, clearing...');
        localStorage.removeItem('auth_token');
      }
    } else {
      console.log('No stored session found');
    }
    
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, name: string, role: string = 'patient') => {
    try {
      console.log('📝 Signing up user:', email);
      
      const result = await db.signup(email, password, name, role);
      
      // Handle both local and Supabase responses
      if (result.user && result.token) {
        // Local DB response
        setUser(result.user);
        setAccessToken(result.token);
        localStorage.setItem('auth_token', result.token);
      } else if (result.user && result.session) {
        // Supabase response
        setUser(result.user);
        setAccessToken(result.session.access_token);
        localStorage.setItem('auth_token', result.session.access_token);
      }
      
      console.log('✅ Signup successful');
    } catch (error: any) {
      console.error('❌ Signup failed:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Signing in user:', email);
      
      const result = await db.login(email, password);
      
      // Handle both local and Supabase responses
      if (result.user && result.token) {
        // Local DB response
        setUser(result.user);
        setAccessToken(result.token);
        localStorage.setItem('auth_token', result.token);
      } else if (result.user && result.session) {
        // Supabase response
        setUser(result.user);
        setAccessToken(result.session.access_token);
        localStorage.setItem('auth_token', result.session.access_token);
      }
      
      console.log('✅ Login successful');
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    console.log('👋 Signing out...');
    
    if (accessToken) {
      await db.logout(accessToken);
    }
    
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('auth_token');
    
    console.log('✅ Signed out');
  };

  const getValidToken = async (): Promise<string | null> => {
    console.log('🔑 Getting valid token...');
    
    if (!accessToken) {
      console.log('❌ No token available');
      return null;
    }

    // Verify token is still valid
    const currentUser = db.verifyToken(accessToken);
    
    if (!currentUser) {
      console.log('❌ Token expired, signing out...');
      await signOut();
      return null;
    }

    console.log('✅ Token valid');
    return accessToken;
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, signUp, signIn, signOut, getValidToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}