/**
 * Unified Database Interface
 * 
 * Automatically uses either local or Supabase based on configuration
 */

import { getDatabaseMode } from './databaseConfig';
import { localDB } from './localDatabase';

// Supabase DB loaded dynamically only when needed
let supabaseDB: any = null;
let supabaseLoadFailed = false;

const getDB = () => {
  const mode = getDatabaseMode();
  
  if (mode === 'supabase' && !supabaseLoadFailed) {
    // Return local for now, trigger async load
    if (!supabaseDB) {
      // Dynamic import - works in Vite/ESM
      import('./supabaseDatabase').then((mod) => {
        supabaseDB = mod.supabaseDB;
        console.log('✅ Supabase database loaded');
      }).catch((err) => {
        console.warn('⚠️ Supabase not available, using local database:', err);
        supabaseLoadFailed = true;
      });
      // Return local until async load completes
      return localDB;
    }
    return supabaseDB;
  }
  
  return localDB;
};

/**
 * Database instance - automatically switches between local and Supabase
 */
export const db = {
  // Auth
  signup: async (...args: any[]) => {
    const database = getDB();
    return database.signup(...args);
  },

  login: async (...args: any[]) => {
    const database = getDB();
    return database.login(...args);
  },

  logout: async (...args: any[]) => {
    const database = getDB();
    return database.logout(...args);
  },

  getCurrentUser: async (...args: any[]) => {
    const database = getDB();
    return database.getCurrentUser ? database.getCurrentUser(...args) : null;
  },

  verifyToken: (...args: any[]) => {
    const database = getDB();
    return database.verifyToken(...args);
  },

  // Users
  getAllUsers: async (...args: any[]) => {
    const database = getDB();
    return database.getAllUsers(...args);
  },

  getUser: async (...args: any[]) => {
    const database = getDB();
    return database.getUser(...args);
  },

  updateUser: async (...args: any[]) => {
    const database = getDB();
    return database.updateUser(...args);
  },

  // Assessments
  saveAssessment: async (...args: any[]) => {
    const database = getDB();
    return database.saveAssessment(...args);
  },

  getAllAssessments: async (...args: any[]) => {
    const database = getDB();
    return database.getAllAssessments(...args);
  },

  getUserAssessments: async (...args: any[]) => {
    const database = getDB();
    return database.getUserAssessments(...args);
  },

  updateAssessmentReview: async (...args: any[]) => {
    const database = getDB();
    return database.updateAssessmentReview(...args);
  },

  // Moods
  saveMood: async (...args: any[]) => {
    const database = getDB();
    return database.saveMood(...args);
  },

  getUserMoods: async (...args: any[]) => {
    const database = getDB();
    return database.getUserMoods(...args);
  },

  // Journals
  saveJournal: async (...args: any[]) => {
    const database = getDB();
    return database.saveJournal(...args);
  },

  getUserJournals: async (...args: any[]) => {
    const database = getDB();
    return database.getUserJournals(...args);
  },

  deleteJournal: async (...args: any[]) => {
    const database = getDB();
    return database.deleteJournal(...args);
  },

  // Community
  createPost: async (...args: any[]) => {
    const database = getDB();
    return database.createPost(...args);
  },

  getAllPosts: async (...args: any[]) => {
    const database = getDB();
    return database.getAllPosts(...args);
  },

  likePost: async (...args: any[]) => {
    const database = getDB();
    return database.likePost(...args);
  },

  // Notifications
  createNotification: async (...args: any[]) => {
    const database = getDB();
    return database.createNotification ? database.createNotification(...args) : null;
  },

  getAllNotifications: async (...args: any[]) => {
    const database = getDB();
    return database.getAllNotifications ? database.getAllNotifications(...args) : [];
  },

  markNotificationAsRead: async (...args: any[]) => {
    const database = getDB();
    return database.markNotificationAsRead ? database.markNotificationAsRead(...args) : null;
  },

  // Stats
  getStats: async (...args: any[]) => {
    const database = getDB();
    return database.getStats ? database.getStats(...args) : {
      totalUsers: 0,
      totalAssessments: 0,
      totalMoods: 0,
      totalJournals: 0,
      totalPosts: 0,
    };
  },

  // Utility
  initializeDatabase: (...args: any[]) => {
    const database = getDB();
    return database.initializeDatabase ? database.initializeDatabase(...args) : null;
  },

  exportData: (...args: any[]) => {
    const database = getDB();
    return database.exportData ? database.exportData(...args) : null;
  },

  importData: (...args: any[]) => {
    const database = getDB();
    return database.importData ? database.importData(...args) : null;
  },

  clearAllData: (...args: any[]) => {
    const database = getDB();
    return database.clearAllData ? database.clearAllData(...args) : null;
  },
};

// Export database mode for reference
export { getDatabaseMode };

console.log(`✅ Database wrapper initialized (Mode: ${getDatabaseMode()})`);