import { useState, useEffect, useRef } from 'react';
import { Heart, Mail, Lock, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { db } from '../utils/database';
import { localDB } from '../utils/localDatabase';
const siteLogo = "/3417faa7ffe484720a74e044251ea8057b0011dc.png";
export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const hasNavigated = useRef(false); // Prevent navigation loop
  const [isNewPlatform, setIsNewPlatform] = useState(false);

  // Check if database has any users
  useEffect(() => {
    const checkUsers = async () => {
      try {
        const users = await db.getAllUsers();
        if (!users || users.length === 0) {
          setIsNewPlatform(true);
        }
      } catch {
        setIsNewPlatform(true);
      }
    };
    checkUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgotPassword) {
        // Handle forgot password
        toast.success('Password reset link sent to your email! 📧');
        setIsForgotPassword(false);
        setLoading(false);
      } else if (isLogin) {
        console.log('Attempting login...');
        await signIn(email, password);
        console.log('Sign in completed');
        toast.success('Welcome back! 💜');
        // Don't set loading to false - let navigation happen
      } else {
        console.log('Attempting signup...');
        await signUp(email, password, name, role);
        console.log('Sign up completed');
        toast.success('Account created successfully! 🎉');
        // Don't set loading to false - let navigation happen
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      const errorMsg = error.message || 'Authentication failed';
      
      // If account exists and auto sign-in succeeded, don't show error
      if (errorMsg.toLowerCase().includes('account exists but sign-in failed')) {
        toast.error('This email is already registered. Please sign in with your existing password.');
        setIsLogin(true);
      } else if (errorMsg.toLowerCase().includes('invalid credentials') || errorMsg.toLowerCase().includes('invalid login credentials')) {
        if (isLogin) {
          toast.error('Invalid email or password. If you are new, please create an account first.', { duration: 5000 });
        } else {
          toast.error('Invalid credentials. Please try again.');
        }
      } else if (errorMsg.toLowerCase().includes('user already exists')) {
        toast.error('This email is already registered. Please sign in instead.');
        setIsLogin(true);
      } else {
        toast.error(errorMsg);
      }
      setLoading(false);
    }
  };

  // Role-based navigation after login - runs when user is set OR on mount if already logged in
  useEffect(() => {
    // Early return if already navigated
    if (hasNavigated.current) {
      return;
    }

    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    // No user, nothing to do
    if (!user) {
      return;
    }

    // All conditions met - navigate once
    console.log('✅ User authenticated, navigating based on role:', user.role);
    hasNavigated.current = true; // Set FIRST to prevent any re-entry
    
    // Navigate immediately - no delay needed
    switch (user.role) {
      case 'super_admin':
        console.log('➡️ Navigating to admin dashboard');
        navigate('/admin/dashboard', { replace: true });
        break;
      case 'doctor':
      case 'psychiatrist':
        console.log('➡️ Navigating to doctor dashboard');
        navigate('/doctor-dashboard', { replace: true });
        break;
      case 'patient':
      default:
        // Check if patient already completed assessment (has category)
        let hasCompletedAssessment = !!user.category;
        
        // Double-check from database in case AuthContext state is stale
        if (!hasCompletedAssessment) {
          try {
            const freshUser = localDB.getUser(user.id);
            if (freshUser?.category) hasCompletedAssessment = true;
          } catch {}
        }
        
        if (hasCompletedAssessment) {
          console.log('➡️ Patient already assessed, navigating to home dashboard');
          navigate('/home', { replace: true });
        } else {
          console.log('➡️ New patient, navigating to category selection');
          navigate('/category-selection', { replace: true });
        }
        break;
    }
  }, [user, authLoading]); // Removed navigate from deps - it's stable from useNavigate

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Image */}
        <div className="hidden md:block">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1598601065215-751bf8798a2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHdvbWFuJTIwc3VucmlzZSUyMHdlbGxuZXNzfGVufDF8fHx8MTc3MjQ2MzU1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Wellness"
              className="w-full h-[600px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#e8967a]/60 to-transparent flex flex-col justify-end p-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Your Safe Space for Mental Wellness
              </h2>
              <p className="text-orange-100">
                Professional mental health support designed for women's unique needs
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl">
          <Link to="/" className="flex items-center gap-2 justify-center mb-8">
            <img src={siteLogo} alt="NurtureHer Logo" className="w-12 h-12 rounded-full object-cover" />
            <span className="text-2xl font-bold bg-gradient-to-r from-[#e8967a] to-[#f4a991] bg-clip-text text-transparent">
              NurtureHer
            </span>
          </Link>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#c0705a] mb-2">
              {isForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back!' : 'Join NurtureHer'}
            </h2>
            <p className="text-gray-600">
              {isForgotPassword
                ? 'Enter your email to receive a reset link'
                : isLogin
                ? 'Continue your wellness journey'
                : 'Start your mental wellness journey today'}
            </p>
          </div>

          {/* New platform notice */}
          {isLogin && isNewPlatform && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm text-amber-800 font-medium mb-1">New to NurtureHer?</p>
              <p className="text-xs text-amber-700">
                No accounts exist yet. Please{' '}
                <button
                  type="button"
                  onClick={() => { setIsLogin(false); setIsNewPlatform(false); }}
                  className="text-[#e8967a] font-semibold underline hover:text-[#d4806a]"
                >
                  create an account
                </button>{' '}
                to get started.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && !isForgotPassword && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Your Name
                </Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-[#e8967a]"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-gray-200 focus:border-[#e8967a]"
                  required
                />
              </div>
            </div>

            {!isForgotPassword && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-[#e8967a]"
                    required
                  />
                </div>
              </div>
            )}

            {isLogin && !isForgotPassword && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-sm text-[#e8967a] hover:text-[#d4806a] font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-[#e8967a] to-[#f4a991] hover:from-[#d4806a] hover:to-[#e8967a] text-white font-semibold rounded-xl"
            >
              {loading
                ? 'Please wait...'
                : isForgotPassword
                ? 'Send Reset Link'
                : isLogin
                ? 'Sign In'
                : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            {isForgotPassword ? (
              <button
                onClick={() => setIsForgotPassword(false)}
                className="text-[#e8967a] hover:text-[#d4806a] font-medium"
              >
                Back to Sign In
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#e8967a] hover:text-[#d4806a] font-medium"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Sign in'}
                </button>
                
                {/* Help text */}
                {!isLogin && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-rose-50 rounded-lg border border-[#f4a991]/40">
                     <p className="text-sm text-[#c0705a] font-semibold mb-2">✨ Getting Started:</p>
                     <ol className="text-xs text-[#d4806a] text-left space-y-1 list-decimal list-inside">
                       <li>Enter your name, email, and password</li>
                       <li>Click &quot;Create Account&quot;</li>
                       <li>You&apos;ll be automatically signed in</li>
                       <li>Select your category (Post-Maternity, PCOD/PCOS, or Menopause)</li>
                       <li>Complete the assessment to get personalized care</li>
                     </ol>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
