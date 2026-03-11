import { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, Calendar, Heart } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/card';
import { motion } from 'motion/react';
import { Link } from 'react-router';

export function HomePage() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const quickActions = [
    {
      to: '/mood',
      icon: Sparkles,
      title: 'Track Mood',
      description: 'How are you feeling?',
      color: 'from-yellow-400 to-orange-400',
    },
    {
      to: '/journal',
      icon: Heart,
      title: 'Write Journal',
      description: 'Express yourself',
      color: 'from-[#e8967a] to-[#d4806a]',
    },
    {
      to: '/resources',
      icon: TrendingUp,
      title: 'Self-Care',
      description: 'Wellness activities',
      color: 'from-purple-400 to-indigo-400',
    },
    {
      to: '/bulletin-board',
      icon: Calendar,
      title: 'Our Mission',
      description: 'Vision & Values',
      color: 'from-blue-400 to-cyan-400',
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-purple-900 mb-2">
            {greeting}, {user?.name || 'Beautiful'} 💜
          </h1>
          <p className="text-lg text-gray-700">
            Welcome back to your safe space for mental wellness
          </p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link to={action.to}>
                <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-transparent hover:border-purple-300 transition-all cursor-pointer hover:shadow-xl group">
                  <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-900 mb-1">
                    {action.title}
                  </h3>
                  <p className="text-gray-600">{action.description}</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Daily Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-purple-500 via-[#e8967a] to-purple-500 p-8 mb-12 relative overflow-hidden">
            <div className="relative z-10">
              <Sparkles className="w-8 h-8 text-white mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Daily Inspiration
              </h3>
              <p className="text-xl text-purple-100 italic leading-relaxed">
                "You are braver than you believe, stronger than you seem, and more capable than you imagine."
              </p>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          </Card>
        </motion.div>

        {/* Featured Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-purple-900 mb-6">
            Recommended for You
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="overflow-hidden bg-white/80 backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1758274526406-4c3a319da0bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxtJTIwd29tYW4lMjB5b2dhJTIwbWluZGZ1bG5lc3N8ZW58MXx8fHwxNzcyNDYzNTU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Mindfulness"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">
                  5-Minute Mindfulness
                </h3>
                <p className="text-gray-600 mb-4">
                  Quick meditation to center yourself and find peace
                </p>
                <Link to="/resources">
                  <button className="text-purple-600 font-semibold hover:text-purple-700">
                    Start Now →
                  </button>
                </Link>
              </div>
            </Card>

            <Card className="overflow-hidden bg-white/80 backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1701743802478-83a7cefa3bb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGpvdXJuYWwlMjB3cml0aW5nJTIwdGhlcmFweXxlbnwxfHx8fDE3NzI0NjM1NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Journaling"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">
                  Gratitude Practice
                </h3>
                <p className="text-gray-600 mb-4">
                  Discover the power of gratitude for mental wellness
                </p>
                <Link to="/journal">
                  <button className="text-purple-600 font-semibold hover:text-purple-700">
                    Write Now →
                  </button>
                </Link>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}