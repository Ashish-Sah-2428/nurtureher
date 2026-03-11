import { supabase } from './supabaseClient';
import type { User, Assessment, MoodEntry, JournalEntry, CommunityPost } from './supabaseClient';

class SupabaseDatabase {
  // ============= AUTH =============
  
  async signup(email: string, password: string, name: string, role: string = 'patient') {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      // 2. Create user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          name,
          role,
        })
        .select()
        .single();

      if (userError) throw userError;

      console.log('✅ Supabase signup successful:', email);
      return { user: userData, session: authData.session };
    } catch (error: any) {
      console.error('❌ Supabase signup failed:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Login failed');

      // Get user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError) throw userError;

      console.log('✅ Supabase login successful:', email);
      return { user: userData, session: data.session };
    } catch (error: any) {
      console.error('❌ Supabase login failed:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('✅ Supabase logout successful');
    } catch (error: any) {
      console.error('❌ Supabase logout failed:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  // ============= USERS =============

  async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  async getUser(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  async updateUser(userId: string, updates: Partial<User>) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      console.log('✅ User updated:', userId);
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // ============= ASSESSMENTS =============

  async saveAssessment(assessment: Omit<Assessment, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .insert(assessment)
        .select()
        .single();

      if (error) throw error;

      // Update user profile
      await this.updateUser(assessment.user_id, {
        category: assessment.category,
        depression_level: assessment.depression_level,
        last_assessment_date: new Date().toISOString(),
      });

      console.log('✅ Assessment saved:', data.id);
      return data;
    } catch (error) {
      console.error('Error saving assessment:', error);
      throw error;
    }
  }

  async getAllAssessments(): Promise<Assessment[]> {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching assessments:', error);
      return [];
    }
  }

  async getUserAssessments(userId: string): Promise<Assessment[]> {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user assessments:', error);
      return [];
    }
  }

  async updateAssessmentReview(
    assessmentId: string,
    reviewStatus: string,
    reviewNotes: string,
    reviewedBy: string
  ) {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .update({
          review_status: reviewStatus,
          review_notes: reviewNotes,
          reviewed_by: reviewedBy,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', assessmentId)
        .select()
        .single();

      if (error) throw error;
      console.log('✅ Assessment reviewed:', assessmentId);
      return data;
    } catch (error) {
      console.error('Error reviewing assessment:', error);
      throw error;
    }
  }

  // ============= MOODS =============

  async saveMood(mood: Omit<MoodEntry, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .insert(mood)
        .select()
        .single();

      if (error) throw error;
      console.log('✅ Mood saved:', data.id);
      return data;
    } catch (error) {
      console.error('Error saving mood:', error);
      throw error;
    }
  }

  async getUserMoods(userId: string): Promise<MoodEntry[]> {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching moods:', error);
      return [];
    }
  }

  // ============= JOURNALS =============

  async saveJournal(journal: Omit<JournalEntry, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert(journal)
        .select()
        .single();

      if (error) throw error;
      console.log('✅ Journal saved:', data.id);
      return data;
    } catch (error) {
      console.error('Error saving journal:', error);
      throw error;
    }
  }

  async getUserJournals(userId: string): Promise<JournalEntry[]> {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching journals:', error);
      return [];
    }
  }

  async deleteJournal(journalId: string) {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', journalId);

      if (error) throw error;
      console.log('✅ Journal deleted:', journalId);
    } catch (error) {
      console.error('Error deleting journal:', error);
      throw error;
    }
  }

  // ============= COMMUNITY =============

  async createPost(post: Omit<CommunityPost, 'id' | 'created_at' | 'likes' | 'liked_by'>) {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          ...post,
          likes: 0,
          liked_by: [],
        })
        .select()
        .single();

      if (error) throw error;
      console.log('✅ Post created:', data.id);
      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  async getAllPosts(): Promise<CommunityPost[]> {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }

  async likePost(postId: string, userId: string) {
    try {
      // Get current post
      const { data: post, error: fetchError } = await supabase
        .from('community_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (fetchError) throw fetchError;

      const likedBy = post.liked_by || [];
      const isLiked = likedBy.includes(userId);

      // Toggle like
      const newLikedBy = isLiked
        ? likedBy.filter((id: string) => id !== userId)
        : [...likedBy, userId];

      const { data, error } = await supabase
        .from('community_posts')
        .update({
          liked_by: newLikedBy,
          likes: newLikedBy.length,
        })
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }

  // ============= STATS =============

  async getStats() {
    try {
      const [users, assessments, moods, journals, posts] = await Promise.all([
        this.getAllUsers(),
        this.getAllAssessments(),
        supabase.from('mood_entries').select('id', { count: 'exact' }),
        supabase.from('journal_entries').select('id', { count: 'exact' }),
        this.getAllPosts(),
      ]);

      return {
        totalUsers: users.length,
        totalAssessments: assessments.length,
        totalMoods: moods.count || 0,
        totalJournals: journals.count || 0,
        totalPosts: posts.length,
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        totalUsers: 0,
        totalAssessments: 0,
        totalMoods: 0,
        totalJournals: 0,
        totalPosts: 0,
      };
    }
  }
}

export const supabaseDB = new SupabaseDatabase();
