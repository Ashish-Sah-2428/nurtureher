/**
 * Database Configuration
 * 
 * Controls whether to use local storage or Supabase
 * 
 * Mode Options:
 * - 'local': Uses localStorage (current working mode)
 * - 'supabase': Uses Supabase PostgreSQL database
 */

// ============================================
// CHANGE THIS TO SWITCH DATABASE MODE
// ============================================

export const DATABASE_MODE: 'local' | 'supabase' = 'local';

// ============================================

/**
 * Check if Supabase is properly configured
 * Returns true only if mode is supabase (checked later with actual client)
 */
export const isSupabaseConfigured = (): boolean => {
  // Don't use require() - it doesn't work in Vite/ESM
  // This will be checked properly when supabase mode is active
  if (DATABASE_MODE !== 'supabase') return false;
  return true;
};

/**
 * Get current database mode
 */
export const getDatabaseMode = (): 'local' | 'supabase' => {
  if (DATABASE_MODE === 'supabase') {
    return 'supabase';
  }
  return 'local';
};

console.log(`🗄️ Database Mode: ${getDatabaseMode().toUpperCase()}`);