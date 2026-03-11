import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// CORS configuration
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use('*', logger(console.log));

// Global error handler
app.onError((err, c) => {
  console.error('Global error handler:', err);
  return c.json({ 
    error: 'Internal server error', 
    message: err.message,
    timestamp: new Date().toISOString() 
  }, 500);
});

// Initialize Supabase clients
let supabaseAdmin: any;
let supabaseClient: any;

try {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');

  console.log('🚀 Initializing server...');
  console.log('Supabase URL:', supabaseUrl);
  console.log('Has Service Key:', !!serviceRoleKey);
  console.log('Has Anon Key:', !!anonKey);

  if (!supabaseUrl || !serviceRoleKey || !anonKey) {
    throw new Error('Missing required environment variables');
  }

  supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
  supabaseClient = createClient(supabaseUrl, anonKey);
  
  console.log('✅ Supabase clients initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Supabase clients:', error);
}

// Health check endpoint - NO AUTH REQUIRED (uses anon key)
app.get('/make-server-8700eb70/health', (c) => {
  console.log('🏥 Health check endpoint called [v8-protected-routes]');
  
  return c.json({ 
    status: 'healthy', 
    version: 'v8-protected-routes',
    timestamp: new Date().toISOString(),
    server: 'running',
    deployed: true,
    build: 'v8',
    features: {
      protectedRoutes: true,
      enhancedLogging: true,
      jwtValidation: 'dual-client',
    },
    env: {
      hasSupabaseUrl: !!Deno.env.get('SUPABASE_URL'),
      hasAnonKey: !!Deno.env.get('SUPABASE_ANON_KEY'),
      hasServiceKey: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    }
  });
});

// Helper function to get user from JWT token
async function getUserFromToken(accessToken: string | undefined) {
  console.log('\n========== getUserFromToken v11-ENHANCED START ==========');
  
  if (!accessToken) {
    console.log('❌ No access token provided');
    return { user: null, error: new Error('No access token provided') };
  }
  
  console.log(`✅ Token received (${accessToken.length} chars)`);
  console.log(`Token preview: ${accessToken.substring(0, 30)}...`);
  
  try {
    // METHOD 1: Use admin client with getUser (most reliable)
    console.log('🔑 Method 1: Validating token via supabaseAdmin.auth.getUser()...');
    const { data: adminData, error: adminError } = await supabaseAdmin.auth.getUser(accessToken);
    
    console.log('Admin client response:', {
      hasUser: !!adminData?.user,
      userId: adminData?.user?.id,
      hasError: !!adminError,
      errorMessage: adminError?.message,
      errorStatus: adminError?.status,
    });
    
    if (adminError) {
      console.log('❌ Admin getUser error:', adminError.message, 'Status:', adminError.status);
      
      // METHOD 2: Fallback to anon client if admin fails
      console.log('🔑 Method 2: Trying with anon client as fallback...');
      const { data: anonData, error: anonError } = await supabaseClient.auth.getUser(accessToken);
      
      console.log('Anon client response:', {
        hasUser: !!anonData?.user,
        userId: anonData?.user?.id,
        hasError: !!anonError,
        errorMessage: anonError?.message,
        errorStatus: anonError?.status,
      });
      
      if (anonError || !anonData?.user) {
        console.log('❌ Anon client also failed:', anonError?.message, 'Status:', anonError?.status);
        return { user: null, error: new Error(`Token validation failed: ${anonError?.message || 'Unknown error'}`) };
      }
      
      console.log('✅ SUCCESS via anon client!');
      console.log('User ID:', anonData.user.id);
      console.log('User email:', anonData.user.email);
      return { user: anonData.user, error: null };
    }
    
    if (adminData?.user && adminData.user.id) {
      console.log('✅ SUCCESS via admin client!');
      console.log('User ID:', adminData.user.id);
      console.log('User email:', adminData.user.email);
      return { user: adminData.user, error: null };
    }
    
    console.log('❌ No user returned from validation');
    return { user: null, error: new Error('No user in auth response') };
    
  } catch (err) {
    console.error('❌ Exception in getUserFromToken:', err);
    console.error('Exception details:', {
      name: err?.name,
      message: err?.message,
      stack: err?.stack?.substring(0, 200),
    });
    return { user: null, error: err };
  } finally {
    console.log('========== getUserFromToken END ==========\n');
  }
}

// Test token endpoint
app.post('/make-server-8700eb70/test-token', async (c) => {
  console.log('🧪 Token test endpoint called');
  
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  
  if (!accessToken) {
    return c.json({ error: 'No token provided' }, 400);
  }
  
  const result = await getUserFromToken(accessToken);
  
  return c.json({
    success: !result.error && !!result.user,
    user: result.user ? { id: result.user.id, email: result.user.email } : null,
    error: result.error?.message || null,
  });
});

// Get current user profile
app.get('/make-server-8700eb70/me', async (c) => {
  try {
    console.log('📝 /me endpoint called');
    
    const authHeader = c.req.header('Authorization');
    console.log('Authorization header:', authHeader ? `Bearer ${authHeader.substring(7, 27)}...` : 'MISSING');
    
    const accessToken = authHeader?.split(' ')[1];
    
    if (!accessToken) {
      console.log('❌ No token in request');
      return c.json({ code: 401, message: 'No access token provided' }, 401);
    }
    
    console.log(`Validating token (${accessToken.length} chars)...`);
    const { user, error } = await getUserFromToken(accessToken);
    
    if (error || !user) {
      console.log('❌ Token validation failed:', error?.message);
      return c.json({ 
        code: 401, 
        message: 'Invalid JWT',
        details: error?.message 
      }, 401);
    }
    
    console.log('✅ User authenticated:', user.id);
    
    // Get profile from KV store
    let profile = await kv.get(`user:${user.id}`);
    console.log('Profile found:', !!profile);
    
    // Auto-create KV profile if it doesn't exist
    if (!profile) {
      console.log('📝 Auto-creating KV profile for user:', user.id);
      profile = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        role: user.user_metadata?.role || 'patient',
        createdAt: new Date().toISOString(),
      };
      await kv.set(`user:${user.id}`, profile);
      console.log('✅ KV profile auto-created');
    }
    
    return c.json({ user, profile });
  } catch (error) {
    console.error('❌ /me endpoint error:', error);
    return c.json({ code: 500, message: 'Internal server error', error: String(error) }, 500);
  }
});

// Signup endpoint
app.post('/make-server-8700eb70/signup', async (c) => {
  try {
    console.log('📝 Signup endpoint called');
    
    const { email, password, name, role } = await c.req.json();
    
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true // Auto-confirm since no email server configured
    });

    const userRole = role || 'patient';

    if (error) {
      console.log('❌ Signup error:', error.message);
      
      // If user already exists, try to find them and ensure their KV profile exists
      if (error.message?.toLowerCase().includes('already') || error.message?.toLowerCase().includes('registered')) {
        // List users to find the existing one
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = existingUsers?.users?.find((u: any) => u.email === email);
        
        if (existingUser) {
          // Ensure KV profile exists for the user
          const existingProfile = await kv.get(`user:${existingUser.id}`);
          if (!existingProfile) {
            await kv.set(`user:${existingUser.id}`, {
              id: existingUser.id,
              email,
              name: name || existingUser.user_metadata?.name || email.split('@')[0],
              role: userRole,
              createdAt: new Date().toISOString(),
            });
            console.log('✅ Created missing KV profile for existing user:', existingUser.id);
          }
        }
        
        return c.json({ error: error.message, code: 'USER_EXISTS' }, 409);
      }
      
      return c.json({ error: error.message }, 400);
    }

    // Create user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      role: userRole,
      createdAt: new Date().toISOString(),
    });
    
    console.log('✅ User created:', data.user.id);

    return c.json({ user: data.user });
  } catch (error) {
    console.error('❌ Signup endpoint error:', error);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

// Category selection
app.post('/make-server-8700eb70/select-category', async (c) => {
  try {
    console.log('📝 Category selection endpoint called');
    
    const authHeader = c.req.header('Authorization');
    console.log('Authorization header:', authHeader ? `Bearer ${authHeader.substring(7, 27)}...` : 'MISSING');
    
    const accessToken = authHeader?.split(' ')[1];
    
    if (!accessToken) {
      console.log('❌ No token provided');
      return c.json({ code: 401, message: 'No access token provided' }, 401);
    }
    
    console.log(`Validating token (${accessToken.length} chars)...`);
    const { user, error } = await getUserFromToken(accessToken);
    
    if (error || !user?.id) {
      console.log('❌ Token validation failed:', error?.message);
      return c.json({ 
        code: 401, 
        message: 'Invalid JWT',
        details: error?.message 
      }, 401);
    }

    console.log('✅ User authenticated:', user.id);

    const { category } = await c.req.json();
    console.log('Category to save:', category);
    
    const profile = await kv.get(`user:${user.id}`);
    console.log('Existing profile:', !!profile);
    
    await kv.set(`user:${user.id}`, {
      ...profile,
      category,
      categorySelectedAt: new Date().toISOString(),
    });

    console.log('✅ Category saved successfully');
    return c.json({ success: true });
  } catch (error) {
    console.error('❌ Category selection error:', error);
    return c.json({ code: 500, message: 'Failed to select category', error: String(error) }, 500);
  }
});

// Assessment submission
app.post('/make-server-8700eb70/assessment', async (c) => {
  console.log('\n🚀 ========== ASSESSMENT ENDPOINT START ==========');
  
  try {
    console.log('📝 Assessment submission endpoint called');
    console.log('Timestamp:', new Date().toISOString());
    
    // Step 1: Extract and verify token
    const authHeader = c.req.header('Authorization');
    console.log('Step 1: Auth header present:', !!authHeader);
    
    if (!authHeader) {
      console.log('❌ No Authorization header');
      return c.json({ error: 'Unauthorized', message: 'No authorization header provided' }, 401);
    }
    
    const accessToken = authHeader?.split(' ')[1];
    console.log('Token extracted:', !!accessToken, accessToken ? `(${accessToken.length} chars)` : '');
    
    if (!accessToken) {
      console.log('❌ No token provided in request');
      return c.json({ error: 'Unauthorized', message: 'No access token provided' }, 401);
    }
    
    // Step 2: Validate user
    console.log('Step 2: Validating user token...');
    const { user, error } = await getUserFromToken(accessToken);
    
    if (error || !user?.id) {
      console.log('❌ Token validation failed:', error?.message);
      return c.json({ 
        error: 'Unauthorized', 
        message: 'Invalid JWT - ' + (error?.message || 'Token validation failed'),
        hint: 'Please sign out and sign in again'
      }, 401);
    }

    console.log('✅ User authenticated successfully');
    console.log('User ID:', user.id);
    console.log('User email:', user.email);

    // Step 3: Parse and validate request body
    console.log('Step 3: Parsing request body...');
    let body;
    try {
      body = await c.req.json();
      console.log('Body parsed successfully');
      console.log('Body keys:', Object.keys(body));
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return c.json({ 
        error: 'Invalid request body', 
        message: 'Could not parse JSON',
        details: String(parseError)
      }, 400);
    }
    
    const { category, answers, additionalNotes, depressionLevel } = body;
    
    console.log('Assessment data received:', {
      userId: user.id,
      category,
      answersCount: answers ? Object.keys(answers).length : 0,
      depressionLevel,
      hasNotes: !!additionalNotes,
    });
    
    // Step 4: Validate required fields
    if (!category) {
      console.log('❌ Missing category field');
      return c.json({ error: 'Missing required field: category', message: 'Category is required' }, 400);
    }
    
    if (!answers || typeof answers !== 'object') {
      console.log('❌ Missing or invalid answers field');
      return c.json({ error: 'Missing required field: answers', message: 'Answers must be an object' }, 400);
    }
    
    if (Object.keys(answers).length === 0) {
      console.log('❌ No answers provided');
      return c.json({ error: 'No answers provided', message: 'Please answer at least one question' }, 400);
    }
    
    console.log('✅ All required fields present and valid');
    
    // Step 5: Create assessment object
    const assessmentId = `${user.id}:${Date.now()}`;
    console.log('Step 5: Creating assessment with ID:', assessmentId);
    
    const assessment = {
      id: assessmentId,
      userId: user.id,
      userEmail: user.email,
      category,
      answers,
      additionalNotes: additionalNotes || '',
      depressionLevel: depressionLevel || 'mild',
      timestamp: new Date().toISOString(),
      reviewStatus: 'pending',
    };

    console.log('Assessment object created:', {
      id: assessment.id,
      userId: assessment.userId,
      category: assessment.category,
      answersCount: Object.keys(assessment.answers).length,
    });

    // Step 6: Save to KV store with retry logic
    console.log('Step 6: Saving assessment to KV store...');
    let saveAttempts = 0;
    const maxAttempts = 3;
    let saveSuccess = false;
    
    while (saveAttempts < maxAttempts && !saveSuccess) {
      try {
        saveAttempts++;
        console.log(`Save attempt ${saveAttempts}/${maxAttempts}...`);
        
        // Ensure the object is perfectly safe for JSON serialization
        const safeAssessment = JSON.parse(JSON.stringify(assessment));
        await kv.set(`assessment:${assessmentId}`, safeAssessment);
        
        // Verify it was saved
        const saved = await kv.get(`assessment:${assessmentId}`);
        if (saved && saved.id === assessmentId) {
          console.log('✅ Assessment saved and verified successfully');
          saveSuccess = true;
        } else {
          console.warn(`⚠️ Verification failed on attempt ${saveAttempts}`);
          if (saveAttempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms before retry
          }
        }
      } catch (kvError: any) {
        console.error(`❌ KV store save failed on attempt ${saveAttempts}:`, kvError);
        if (saveAttempts >= maxAttempts) {
          return c.json({ 
            error: 'Database error - failed to save assessment', 
            message: `Database error: ${kvError.message || String(kvError)}`,
            details: String(kvError),
            hint: 'Please try again. If this persists, contact support.'
          }, 500);
        }
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait before retry
      }
    }

    if (!saveSuccess) {
      console.error('❌ Failed to save assessment after all attempts');
      return c.json({ 
        error: 'Database error - could not verify save', 
        message: 'Failed to save assessment to database',
        hint: 'Please try again'
      }, 500);
    }

    // Step 7: Update user profile
    console.log('Step 7: Updating user profile...');
    try {
      const profile = await kv.get(`user:${user.id}`);
      console.log('Current profile found:', !!profile);
      
      await kv.set(`user:${user.id}`, {
        ...profile,
        lastAssessment: assessmentId,
        depressionLevel,
        category,
        lastAssessmentDate: new Date().toISOString(),
      });
      console.log('✅ User profile updated successfully');
    } catch (profileError) {
      console.warn('⚠️ Failed to update user profile (non-critical):', profileError);
      // Continue anyway - assessment is saved
    }

    console.log('✅✅✅ ASSESSMENT SUBMISSION COMPLETED SUCCESSFULLY ✅✅✅');
    console.log('Assessment ID:', assessmentId);
    
    return c.json({ 
      success: true, 
      assessment: {
        id: assessment.id,
        category: assessment.category,
        depressionLevel: assessment.depressionLevel,
        timestamp: assessment.timestamp,
      },
      message: 'Assessment saved successfully'
    });
    
  } catch (error: any) {
    console.error('❌❌❌ CRITICAL ERROR in assessment endpoint:', error);
    console.error('Error name:', error?.name);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack?.substring(0, 500));
    
    return c.json({ 
      error: 'Server error', 
      message: error?.message || 'Unknown server error',
      details: String(error),
      hint: 'Please try again. Check console for details.'
    }, 500);
  } finally {
    console.log('========== ASSESSMENT ENDPOINT END ==========\n');
  }
});

// Prescription upload
app.post('/make-server-8700eb70/prescriptions', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { user, error } = await getUserFromToken(accessToken);
    
    if (error || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { files, notes } = await c.req.json();
    const prescriptionId = `${user.id}:${Date.now()}`;
    
    const prescription = {
      id: prescriptionId,
      userId: user.id,
      files,
      notes,
      timestamp: new Date().toISOString(),
    };

    await kv.set(`prescription:${prescriptionId}`, prescription);

    return c.json({ prescription });
  } catch (error) {
    console.error('❌ Prescription upload error:', error);
    return c.json({ error: 'Failed to save prescriptions' }, 500);
  }
});

// Get all assessments (for doctors)
app.get('/make-server-8700eb70/assessments', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { user, error } = await getUserFromToken(accessToken);
    
    if (error || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const assessments = await kv.getByPrefix('assessment:');
    
    const sortedAssessments = assessments.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return c.json({ assessments: sortedAssessments });
  } catch (error) {
    console.error('❌ Assessments fetch error:', error);
    return c.json({ error: 'Failed to fetch assessments' }, 500);
  }
});

// Update assessment review
app.post('/make-server-8700eb70/assessment/:id/review', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { user, error } = await getUserFromToken(accessToken);
    
    if (error || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const assessmentId = c.req.param('id');
    const { status, notes } = await c.req.json();
    
    const assessment = await kv.get(`assessment:${assessmentId}`);
    
    if (!assessment) {
      return c.json({ error: 'Assessment not found' }, 404);
    }

    const updatedAssessment = {
      ...assessment,
      reviewStatus: status,
      reviewNotes: notes,
      reviewedBy: user.id,
      reviewedAt: new Date().toISOString(),
    };

    await kv.set(`assessment:${assessmentId}`, updatedAssessment);

    return c.json({ assessment: updatedAssessment });
  } catch (error) {
    console.error('❌ Assessment review error:', error);
    return c.json({ error: 'Failed to update review' }, 500);
  }
});

// Admin: Get all users
app.get('/make-server-8700eb70/admin/all-users', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { user, error } = await getUserFromToken(accessToken);
    
    if (error || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    if (profile?.role !== 'super_admin') {
      return c.json({ error: 'Forbidden: Super admin access required' }, 403);
    }

    const users = await kv.getByPrefix('user:');
    
    return c.json({ users });
  } catch (error) {
    console.error('❌ Get all users error:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// Admin: Remove user
app.delete('/make-server-8700eb70/admin/remove-user/:userId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { user, error } = await getUserFromToken(accessToken);
    
    if (error || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    if (profile?.role !== 'super_admin') {
      return c.json({ error: 'Forbidden: Super admin access required' }, 403);
    }

    const userId = c.req.param('userId');
    
    await kv.del(`user:${userId}`);
    
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (deleteError) {
      console.log('⚠️ Error deleting user from auth:', deleteError.message);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('❌ Remove user error:', error);
    return c.json({ error: 'Failed to remove user' }, 500);
  }
});

// Mood tracking
app.post('/make-server-8700eb70/mood', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { user, error } = await getUserFromToken(accessToken);
    
    if (error || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { mood, emoji, note, activities } = await c.req.json();
    const moodId = `${user.id}:${Date.now()}`;
    
    const moodEntry = {
      id: moodId,
      userId: user.id,
      mood,
      emoji,
      note,
      activities,
      timestamp: new Date().toISOString(),
    };

    await kv.set(`mood:${moodId}`, moodEntry);

    return c.json({ mood: moodEntry });
  } catch (error) {
    console.error('❌ Mood save error:', error);
    return c.json({ error: 'Failed to save mood' }, 500);
  }
});

app.get('/make-server-8700eb70/moods', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { user, error } = await getUserFromToken(accessToken);
    
    if (error || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const moods = await kv.getByPrefix(`mood:${user.id}:`);
    
    const sortedMoods = moods.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return c.json({ moods: sortedMoods });
  } catch (error) {
    console.error('❌ Moods fetch error:', error);
    return c.json({ error: 'Failed to fetch moods' }, 500);
  }
});

// Journal routes
app.post('/make-server-8700eb70/journal', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { user, error } = await getUserFromToken(accessToken);
    
    if (error || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { title, content, mood } = await c.req.json();
    const journalId = `${user.id}:${Date.now()}`;
    
    const journalEntry = {
      id: journalId,
      userId: user.id,
      title,
      content,
      mood,
      timestamp: new Date().toISOString(),
    };

    await kv.set(`journal:${journalId}`, journalEntry);

    return c.json({ journal: journalEntry });
  } catch (error) {
    console.error('❌ Journal save error:', error);
    return c.json({ error: 'Failed to save journal' }, 500);
  }
});

app.get('/make-server-8700eb70/journals', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { user, error } = await getUserFromToken(accessToken);
    
    if (error || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const journals = await kv.getByPrefix(`journal:${user.id}:`);
    
    const sortedJournals = journals.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return c.json({ journals: sortedJournals });
  } catch (error) {
    console.error('❌ Journals fetch error:', error);
    return c.json({ error: 'Failed to fetch journals' }, 500);
  }
});

app.delete('/make-server-8700eb70/journal/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { user, error } = await getUserFromToken(accessToken);
    
    if (error || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const journalId = c.req.param('id');
    await kv.del(`journal:${journalId}`);

    return c.json({ success: true });
  } catch (error) {
    console.error('❌ Journal delete error:', error);
    return c.json({ error: 'Failed to delete journal' }, 500);
  }
});

// Community posts
app.post('/make-server-8700eb70/post', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { user, error } = await getUserFromToken(accessToken);
    
    if (error || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { content, anonymous } = await c.req.json();
    const postId = `post:${Date.now()}`;
    
    const profile = await kv.get(`user:${user.id}`);
    
    const post = {
      id: postId,
      userId: user.id,
      userName: anonymous ? 'Anonymous' : profile?.name || 'User',
      content,
      anonymous,
      timestamp: new Date().toISOString(),
      likes: 0,
    };

    await kv.set(postId, post);

    return c.json({ post });
  } catch (error) {
    console.error('❌ Post create error:', error);
    return c.json({ error: 'Failed to create post' }, 500);
  }
});

app.get('/make-server-8700eb70/posts', async (c) => {
  try {
    const posts = await kv.getByPrefix('post:');
    
    const sortedPosts = posts.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return c.json({ posts: sortedPosts });
  } catch (error) {
    console.error('❌ Posts fetch error:', error);
    return c.json({ error: 'Failed to fetch posts' }, 500);
  }
});

console.log('🚀 Server starting...');
Deno.serve(app.fetch);
console.log('✅ Server started successfully!');