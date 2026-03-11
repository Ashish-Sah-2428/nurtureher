import { Heart, BookOpen, Smile, Users, Sparkles, User, LogOut, Home } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import siteLogo from 'figma:asset/3417faa7ffe484720a74e044251ea8057b0011dc.png';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { to: '/home', icon: Heart, label: 'Home' },
    { to: '/mood', icon: Smile, label: 'Mood' },
    { to: '/journal', icon: BookOpen, label: 'Journal' },
    { to: '/resources', icon: Sparkles, label: 'Resources' },
    { to: '/community', icon: Users, label: 'Community' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-[#fdf0ec] to-blue-50">
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2" title="Go to Landing Page">
              <img src={siteLogo} alt="NurtureHer Logo" className="w-10 h-10 rounded-full object-cover" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                NurtureHer
              </span>
            </Link>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      location.pathname === item.to
                        ? 'bg-gradient-to-r from-purple-500 to-[#e8967a] text-white'
                        : 'text-gray-700 hover:bg-purple-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Link to="/profile">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="w-5 h-5 text-purple-600" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-5 h-5 text-gray-600" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-purple-100 z-50">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                location.pathname === item.to
                  ? 'text-purple-600'
                  : 'text-gray-500'
              }`}
            >
              <item.icon className={`w-5 h-5 ${location.pathname === item.to ? 'fill-purple-600' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-20 md:pb-8">
        {children}
      </main>
    </div>
  );
}