import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/card';
import { motion } from 'motion/react';
import { User, Mail, Calendar, Heart, BookOpen, Smile, Award } from 'lucide-react';
import { localDB } from '../utils/localDatabase';

export function ProfilePage() {
  const { user } = useAuth();
  const [moodCount, setMoodCount] = useState(0);
  const [journalCount, setJournalCount] = useState(0);

  useEffect(() => {
    if (user) {
      try {
        const moods = localDB.getUserMoods(user.id);
        setMoodCount(moods.length);
      } catch { setMoodCount(0); }
      try {
        const journals = localDB.getUserJournals(user.id);
        setJournalCount(journals.length);
      } catch { setJournalCount(0); }
    }
  }, [user]);

  const memberSince = (user as any)?.createdAt
    ? new Date((user as any).createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const stats = [
    { icon: Smile, label: 'Mood Entries', value: String(moodCount), color: 'from-yellow-400 to-orange-400' },
    { icon: BookOpen, label: 'Journal Entries', value: String(journalCount), color: 'from-[#e8967a] to-[#d4806a]' },
  ];

  const achievements = [
    { title: 'First Steps', description: 'Created your first mood entry', earned: moodCount >= 1 },
    { title: 'Mood Tracker', description: 'Tracked your mood 5 times', earned: moodCount >= 5 },
    { title: 'Journal Writer', description: 'Wrote 10 journal entries', earned: journalCount >= 10 },
    { title: 'Wellness Journey', description: 'Completed your first assessment', earned: !!(user as any)?.category },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-purple-900 mb-8">
            Your Profile
          </h1>

          {/* Profile Info */}
          <Card className="p-8 mb-8 bg-white/80 backdrop-blur-sm">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-[#e8967a] rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-purple-900 mb-2">
                  {user?.name || 'Beautiful Soul'}
                </h2>
                <div className="space-y-2 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-600" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>Member since {memberSince}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">
              Your Journey
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-white/80 backdrop-blur-sm text-center">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-purple-900 mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h2 className="text-2xl font-bold text-purple-900 mb-4">
              Achievements
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className={`p-6 ${achievement.earned ? 'bg-gradient-to-br from-purple-50 to-[#fdf0ec] border-2 border-purple-200' : 'bg-white/40 backdrop-blur-sm opacity-60'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${achievement.earned ? 'bg-gradient-to-br from-purple-500 to-[#e8967a]' : 'bg-gray-300'}`}>
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-purple-900 mb-1">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {achievement.description}
                        </p>
                        {achievement.earned && (
                          <p className="text-xs text-purple-600 font-semibold mt-2">
                            ✓ Earned
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Wellness Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <Card className="p-8 bg-gradient-to-r from-purple-500 via-[#e8967a] to-purple-500 text-center">
              <Heart className="w-10 h-10 text-white mx-auto mb-4" fill="white" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Keep Growing, Beautiful Soul
              </h3>
              <p className="text-lg text-purple-100">
                Every step you take on your wellness journey matters. You're doing amazing! 💜
              </p>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}