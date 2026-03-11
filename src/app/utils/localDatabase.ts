// Local Database - No Supabase Required!
// All data stored in browser with export/import functionality

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor' | 'psychiatrist' | 'super_admin';
  password?: string;
  category?: string;
  depressionLevel?: string;
  lastAssessmentDate?: string;
  createdAt: string;
}

export interface Assessment {
  id: string;
  userId: string;
  userEmail: string;
  category: string;
  answers: Record<string, any>;
  additionalNotes: string;
  depressionLevel: string;
  timestamp: string;
  reviewStatus: 'pending' | 'reviewed' | 'approved';
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  mood: string;
  emoji: string;
  note: string;
  activities: string[];
  timestamp: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood: string;
  timestamp: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  content: string;
  anonymous: boolean;
  timestamp: string;
  likes: number;
  likedBy: string[];
}

export interface Notification {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  category: string;
  depressionLevel: string;
  message: string;
  timestamp: string;
  read: boolean;
}

class LocalDatabase {
  private storageKey = 'nurtureher_database';

  private getData() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        return this.getDefaultData();
      }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return this.getDefaultData();
      }
      // Ensure all required fields exist with defaults (handles old data missing new fields)
      const defaults = this.getDefaultData();
      return {
        users: Array.isArray(parsed.users) ? parsed.users : defaults.users,
        assessments: Array.isArray(parsed.assessments) ? parsed.assessments : defaults.assessments,
        moods: Array.isArray(parsed.moods) ? parsed.moods : defaults.moods,
        journals: Array.isArray(parsed.journals) ? parsed.journals : defaults.journals,
        posts: Array.isArray(parsed.posts) ? parsed.posts : defaults.posts,
        notifications: Array.isArray(parsed.notifications) ? parsed.notifications : defaults.notifications,
        sessions: (parsed.sessions && typeof parsed.sessions === 'object' && !Array.isArray(parsed.sessions))
          ? parsed.sessions
          : defaults.sessions,
      };
    } catch (error) {
      console.error('❌ Error reading database, resetting to defaults:', error);
      return this.getDefaultData();
    }
  }

  private getDefaultData() {
    const defaultData = {
      users: [] as User[],
      assessments: [] as Assessment[],
      moods: [] as MoodEntry[],
      journals: [] as JournalEntry[],
      posts: [] as CommunityPost[],
      notifications: [] as Notification[],
      sessions: {} as Record<string, { userId: string; token: string; expiresAt: string }>,
    };

    return defaultData;
  }

  private saveData(data: any) {
    if (!data || typeof data !== 'object') {
      console.error('❌ Attempted to save invalid data, skipping');
      return;
    }
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    // Also save to a backup
    try {
      localStorage.setItem(`${this.storageKey}_backup`, JSON.stringify({
        users: data.users || [],
        assessments: data.assessments || [],
        moods: data.moods || [],
        journals: data.journals || [],
        posts: data.posts || [],
        notifications: data.notifications || [],
        sessions: data.sessions || {},
        backupDate: new Date().toISOString()
      }));
    } catch (backupError) {
      console.warn('⚠️ Backup save failed:', backupError);
    }
  }

  // ============= INIT =============
  
  initializeDatabase() {
    // Force initialize with default data if needed
    const data = this.getData();
    this.saveData(data);
    console.log('✅ Database initialized');
    return data;
  }

  // ============= AUTH =============
  
  signup(email: string, password: string, name: string, role: string = 'patient'): { user: User; token: string } {
    const data = this.getData();
    
    // Check if user exists
    const existing = data.users.find((u: User) => u.email === email);
    if (existing) {
      throw new Error('User already exists');
    }

    const user: User = {
      id: `user_${Date.now()}_${Math.random()}`,
      email,
      name,
      role: role as any,
      password, // In real app, hash this!
      createdAt: new Date().toISOString(),
    };

    data.users.push(user);
    
    // Create session token immediately after signup
    const token = `token_${Date.now()}_${Math.random()}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    data.sessions[token] = { userId: user.id, token, expiresAt };
    this.saveData(data);

    console.log('✅ User created and logged in:', user.id);
    return { user, token };
  }

  login(email: string, password: string): { user: User; token: string } {
    const data = this.getData();
    
    const user = data.users.find((u: User) => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Create session token
    const token = `token_${Date.now()}_${Math.random()}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    data.sessions[token] = { userId: user.id, token, expiresAt };
    this.saveData(data);

    console.log('✅ User logged in:', user.id);
    return { user, token };
  }

  verifyToken(token: string): User | null {
    const data = this.getData();
    
    const session = data.sessions[token];
    if (!session) return null;

    // Check expiry
    if (new Date(session.expiresAt) < new Date()) {
      delete data.sessions[token];
      this.saveData(data);
      return null;
    }

    const user = data.users.find((u: User) => u.id === session.userId);
    return user || null;
  }

  logout(token: string) {
    const data = this.getData();
    delete data.sessions[token];
    this.saveData(data);
  }

  getCurrentUser(token: string): User | null {
    return this.verifyToken(token);
  }

  // ============= USERS =============

  getAllUsers(): User[] {
    const data = this.getData();
    return data.users.map((u: User) => ({ ...u, password: undefined })); // Don't expose passwords
  }

  getUser(userId: string): User | null {
    const data = this.getData();
    const user = data.users.find((u: User) => u.id === userId);
    return user ? { ...user, password: undefined } : null;
  }

  updateUser(userId: string, updates: Partial<User>) {
    const data = this.getData();
    const index = data.users.findIndex((u: User) => u.id === userId);
    
    if (index === -1) throw new Error('User not found');

    data.users[index] = { ...data.users[index], ...updates };
    this.saveData(data);

    console.log('✅ User updated:', userId);
    return data.users[index];
  }

  deleteUser(userId: string) {
    const data = this.getData();
    data.users = data.users.filter((u: User) => u.id !== userId);
    this.saveData(data);
    console.log('✅ User deleted:', userId);
  }

  // ============= ASSESSMENTS =============

  saveAssessment(assessment: Omit<Assessment, 'id' | 'timestamp'>): Assessment {
    const data = this.getData();
    
    const newAssessment: Assessment = {
      ...assessment,
      id: `assessment_${Date.now()}_${Math.random()}`,
      timestamp: new Date().toISOString(),
      reviewStatus: 'pending',
    };

    data.assessments.push(newAssessment);

    // Update user profile
    const userIndex = data.users.findIndex((u: User) => u.id === assessment.userId);
    if (userIndex !== -1) {
      data.users[userIndex].category = assessment.category;
      data.users[userIndex].depressionLevel = assessment.depressionLevel;
      data.users[userIndex].lastAssessmentDate = newAssessment.timestamp;
    }

    this.saveData(data);

    console.log('✅ Assessment saved:', newAssessment.id);
    return newAssessment;
  }

  getAllAssessments(): Assessment[] {
    const data = this.getData();
    return data.assessments.sort((a: Assessment, b: Assessment) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  getUserAssessments(userId: string): Assessment[] {
    const data = this.getData();
    return data.assessments
      .filter((a: Assessment) => a.userId === userId)
      .sort((a: Assessment, b: Assessment) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }

  getAssessment(assessmentId: string): Assessment | null {
    const data = this.getData();
    return data.assessments.find((a: Assessment) => a.id === assessmentId) || null;
  }

  updateAssessmentReview(assessmentId: string, reviewStatus: string, reviewNotes: string, reviewedBy: string) {
    const data = this.getData();
    const index = data.assessments.findIndex((a: Assessment) => a.id === assessmentId);
    
    if (index === -1) throw new Error('Assessment not found');

    data.assessments[index] = {
      ...data.assessments[index],
      reviewStatus: reviewStatus as any,
      reviewNotes,
      reviewedBy,
      reviewedAt: new Date().toISOString(),
    };

    this.saveData(data);
    console.log('✅ Assessment reviewed:', assessmentId);
    return data.assessments[index];
  }

  // ============= MOODS =============

  saveMood(mood: Omit<MoodEntry, 'id' | 'timestamp'>): MoodEntry {
    const data = this.getData();
    
    const newMood: MoodEntry = {
      ...mood,
      id: `mood_${Date.now()}_${Math.random()}`,
      timestamp: new Date().toISOString(),
    };

    data.moods.push(newMood);
    this.saveData(data);

    console.log('✅ Mood saved:', newMood.id);
    return newMood;
  }

  getUserMoods(userId: string): MoodEntry[] {
    const data = this.getData();
    return data.moods
      .filter((m: MoodEntry) => m.userId === userId)
      .sort((a: MoodEntry, b: MoodEntry) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }

  // ============= JOURNALS =============

  saveJournal(journal: Omit<JournalEntry, 'id' | 'timestamp'>): JournalEntry {
    const data = this.getData();
    
    const newJournal: JournalEntry = {
      ...journal,
      id: `journal_${Date.now()}_${Math.random()}`,
      timestamp: new Date().toISOString(),
    };

    data.journals.push(newJournal);
    this.saveData(data);

    console.log('✅ Journal saved:', newJournal.id);
    return newJournal;
  }

  getUserJournals(userId: string): JournalEntry[] {
    const data = this.getData();
    return data.journals
      .filter((j: JournalEntry) => j.userId === userId)
      .sort((a: JournalEntry, b: JournalEntry) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }

  deleteJournal(journalId: string) {
    const data = this.getData();
    data.journals = data.journals.filter((j: JournalEntry) => j.id !== journalId);
    this.saveData(data);
    console.log('✅ Journal deleted:', journalId);
  }

  // ============= COMMUNITY =============

  createPost(post: Omit<CommunityPost, 'id' | 'timestamp' | 'likes' | 'likedBy'>): CommunityPost {
    const data = this.getData();
    
    const newPost: CommunityPost = {
      ...post,
      id: `post_${Date.now()}_${Math.random()}`,
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: [],
    };

    data.posts.push(newPost);
    this.saveData(data);

    console.log('✅ Post created:', newPost.id);
    return newPost;
  }

  getAllPosts(): CommunityPost[] {
    const data = this.getData();
    return data.posts.sort((a: CommunityPost, b: CommunityPost) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  likePost(postId: string, userId: string) {
    const data = this.getData();
    const index = data.posts.findIndex((p: CommunityPost) => p.id === postId);
    
    if (index === -1) throw new Error('Post not found');

    const post = data.posts[index];
    
    if (post.likedBy.includes(userId)) {
      // Unlike
      post.likedBy = post.likedBy.filter((id: string) => id !== userId);
      post.likes--;
    } else {
      // Like
      post.likedBy.push(userId);
      post.likes++;
    }

    this.saveData(data);
    return post;
  }

  // ============= NOTIFICATIONS =============

  createNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Notification {
    const data = this.getData();
    
    const newNotification: Notification = {
      userId: notification.userId || '',
      userEmail: notification.userEmail || '',
      userName: notification.userName || '',
      category: notification.category || '',
      depressionLevel: notification.depressionLevel || '',
      message: notification.message || '',
      id: `notification_${Date.now()}_${Math.random()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    data.notifications.push(newNotification);
    this.saveData(data);

    console.log('✅ Notification created:', newNotification.id);
    return newNotification;
  }

  getAllNotifications(userId: string): Notification[] {
    const data = this.getData();
    return data.notifications
      .filter((n: Notification) => n.userId === userId)
      .sort((a: Notification, b: Notification) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }

  markNotificationAsRead(notificationId: string) {
    const data = this.getData();
    const index = data.notifications.findIndex((n: Notification) => n.id === notificationId);
    
    if (index === -1) throw new Error('Notification not found');

    data.notifications[index] = {
      ...data.notifications[index],
      read: true,
    };

    this.saveData(data);
    console.log('✅ Notification marked as read:', notificationId);
    return data.notifications[index];
  }

  // ============= DATA EXPORT/IMPORT =============

  exportData(): string {
    const data = this.getData();
    return JSON.stringify(data, null, 2);
  }

  importData(jsonString: string) {
    try {
      const data = JSON.parse(jsonString);
      this.saveData(data);
      console.log('✅ Data imported successfully');
    } catch (error) {
      console.error('❌ Import failed:', error);
      throw new Error('Invalid JSON data');
    }
  }

  clearAllData() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(`${this.storageKey}_backup`);
    console.log('✅ All data cleared');
  }

  getStats() {
    const data = this.getData();
    return {
      totalUsers: data.users.length,
      totalAssessments: data.assessments.length,
      totalMoods: data.moods.length,
      totalJournals: data.journals.length,
      totalPosts: data.posts.length,
      activeSessions: Object.keys(data.sessions).length,
      dataSize: new Blob([JSON.stringify(data)]).size,
    };
  }
}

export const localDB = new LocalDatabase();