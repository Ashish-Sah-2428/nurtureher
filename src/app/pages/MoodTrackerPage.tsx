import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { localDB } from '../utils/localDatabase';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Calendar, TrendingUp } from 'lucide-react';

interface MoodEntry {
  id: string;
  mood: string;
  emoji: string;
  note: string;
  activities: string[];
  timestamp: string;
}

export function MoodTrackerPage() {
  const { getValidToken } = useAuth();
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const moodOptions = [
    { mood: 'amazing', emoji: '😍', label: 'Amazing', color: 'from-green-400 to-emerald-400' },
    { mood: 'happy', emoji: '😊', label: 'Happy', color: 'from-yellow-400 to-orange-400' },
    { mood: 'okay', emoji: '😐', label: 'Okay', color: 'from-blue-400 to-cyan-400' },
    { mood: 'sad', emoji: '😢', label: 'Sad', color: 'from-indigo-400 to-purple-400' },
    { mood: 'anxious', emoji: '😰', label: 'Anxious', color: 'from-orange-400 to-red-400' },
    { mood: 'angry', emoji: '😠', label: 'Angry', color: 'from-red-400 to-[#e8967a]' },
  ];

  const activities = [
    'Exercise', 'Meditation', 'Reading', 'Socializing',
    'Work', 'Relaxing', 'Nature', 'Music',
  ];

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    const token = await getValidToken();
    if (!token) return;

    try {
      const currentUser = localDB.verifyToken(token);
      if (!currentUser) return;

      const userMoods = localDB.getUserMoods(currentUser.id);
      setMoods(userMoods as any);
      console.log('✅ Loaded moods:', userMoods.length);
    } catch (error) {
      console.error('Error fetching moods:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast.error('Please select a mood');
      return;
    }

    setLoading(true);
    try {
      const token = await getValidToken();
      if (!token) {
        toast.error('Session expired. Please sign in again.');
        return;
      }

      const currentUser = localDB.verifyToken(token);
      if (!currentUser) {
        toast.error('Session expired. Please sign in again.');
        return;
      }

      const moodData = moodOptions.find((m) => m.mood === selectedMood);
      
      localDB.saveMood({
        userId: currentUser.id,
        mood: selectedMood,
        emoji: moodData?.emoji || '',
        note,
        activities: selectedActivities,
      });

      console.log('✅ Mood saved locally');
      toast.success('Mood tracked successfully! 💜');
      setSelectedMood('');
      setNote('');
      setSelectedActivities([]);
      fetchMoods();
    } catch (error) {
      console.error('Error saving mood:', error);
      toast.error('Failed to save mood');
    } finally {
      setLoading(false);
    }
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-purple-900 mb-2">
            How are you feeling? 💭
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Track your emotions and discover patterns in your wellness journey
          </p>

          {/* Mood Selection */}
          <Card className="p-8 mb-8 bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-purple-900 mb-6">
              Select Your Mood
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
              {moodOptions.map((mood) => (
                <motion.button
                  key={mood.mood}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMood(mood.mood)}
                  className={`p-4 rounded-2xl transition-all ${
                    selectedMood === mood.mood
                      ? `bg-gradient-to-br ${mood.color} shadow-lg`
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-4xl mb-2">{mood.emoji}</div>
                  <div
                    className={`text-sm font-medium ${
                      selectedMood === mood.mood ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {mood.label}
                  </div>
                </motion.button>
              ))}
            </div>

            <h3 className="text-lg font-bold text-purple-900 mb-4">
              What activities did you do today?
            </h3>
            <div className="flex flex-wrap gap-3 mb-6">
              {activities.map((activity) => (
                <button
                  key={activity}
                  onClick={() => toggleActivity(activity)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedActivities.includes(activity)
                      ? 'bg-gradient-to-r from-purple-500 to-[#e8967a] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {activity}
                </button>
              ))}
            </div>

            <h3 className="text-lg font-bold text-purple-900 mb-4">
              Add a note (optional)
            </h3>
            <Textarea
              placeholder="What's on your mind? Share your thoughts..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mb-6 min-h-32 border-gray-200"
            />

            <Button
              onClick={handleSubmit}
              disabled={loading || !selectedMood}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-[#e8967a] hover:from-purple-600 hover:to-[#d4806a] text-white font-semibold"
            >
              {loading ? 'Saving...' : 'Track Mood'}
            </Button>
          </Card>

          {/* Mood History */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-purple-900">
                Your Mood History
              </h2>
            </div>

            {moods.length === 0 ? (
              <Card className="p-8 text-center bg-white/80 backdrop-blur-sm">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No mood entries yet. Start tracking to see your patterns!
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {moods.map((mood) => {
                  const moodOption = moodOptions.find((m) => m.mood === mood.mood);
                  return (
                    <motion.div
                      key={mood.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${moodOption?.color} flex items-center justify-center text-2xl flex-shrink-0`}
                          >
                            {mood.emoji}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-bold text-purple-900 capitalize">
                                {mood.mood}
                              </h3>
                              <span className="text-sm text-gray-500">
                                {new Date(mood.timestamp).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            {mood.note && (
                              <p className="text-gray-700 mb-3">{mood.note}</p>
                            )}
                            {mood.activities && mood.activities.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {mood.activities.map((activity) => (
                                  <span
                                    key={activity}
                                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                                  >
                                    {activity}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}