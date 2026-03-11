import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { BookOpen, Plus, Trash2, Sparkles } from 'lucide-react';
import { db } from '../utils/database';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  timestamp: string;
}

export function JournalPage() {
  const { user } = useAuth();
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);

  const prompts = [
    'What am I grateful for today?',
    'What made me smile today?',
    'What challenge did I overcome?',
    'How do I want to feel tomorrow?',
  ];

  useEffect(() => {
    fetchJournals();
  }, [user]);

  const fetchJournals = async () => {
    if (!user) return;

    try {
      const userJournals = db.getUserJournals(user.id);
      setJournals(userJournals);
    } catch (error) {
      console.error('Error fetching journals:', error);
    }
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      if (!user) {
        toast.error('Session expired. Please sign in again.');
        return;
      }

      const newJournal = db.saveJournal({
        userId: user.id,
        title,
        content,
        mood,
      });

      toast.success('Journal entry saved! 📝');
      setTitle('');
      setContent('');
      setMood('');
      setIsDialogOpen(false);
      fetchJournals();
    } catch (error) {
      console.error('Error saving journal:', error);
      toast.error('Failed to save journal');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!user) {
        toast.error('Session expired. Please sign in again.');
        return;
      }

      db.deleteJournal(id);
      toast.success('Journal entry deleted');
      fetchJournals();
    } catch (error) {
      console.error('Error deleting journal:', error);
      toast.error('Failed to delete journal');
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-purple-900 mb-2">
                Your Journal 📖
              </h1>
              <p className="text-lg text-gray-700">
                A safe space to express your thoughts and feelings
              </p>
            </div>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-[#e8967a] hover:from-purple-600 hover:to-[#d4806a] text-white rounded-full"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Entry
            </Button>
          </div>

          {/* Writing Prompts */}
          <Card className="p-6 mb-8 bg-gradient-to-r from-purple-500 to-[#e8967a]">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">
                Writing Prompts
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {prompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setTitle(prompt);
                    setIsDialogOpen(true);
                  }}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-4 rounded-xl text-left transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </Card>

          {/* Journal Entries */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-purple-900 mb-6">
              Your Entries
            </h2>

            {journals.length === 0 ? (
              <Card className="p-12 text-center bg-white/80 backdrop-blur-sm">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  No journal entries yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start writing to capture your thoughts and feelings
                </p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-[#e8967a] hover:from-purple-600 hover:to-[#d4806a] text-white"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Write Your First Entry
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {journals.map((journal) => (
                  <motion.div
                    key={journal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow group relative">
                      <button
                        onClick={() => handleDelete(journal.id)}
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <h3 className="text-xl font-bold text-purple-900 mb-2 pr-8">
                        {journal.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        {new Date(journal.timestamp).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-gray-700 line-clamp-4">
                        {journal.content}
                      </p>
                      {journal.mood && (
                        <div className="mt-4 inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                          {journal.mood}
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* New Entry Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-purple-900">
                New Journal Entry
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Title
                </label>
                <Input
                  placeholder="Give your entry a title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-gray-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  How are you feeling? (optional)
                </label>
                <Input
                  placeholder="e.g., Happy, Thoughtful, Grateful..."
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="border-gray-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Your thoughts
                </label>
                <Textarea
                  placeholder="Write your thoughts here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-64 border-gray-200"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-[#e8967a] hover:from-purple-600 hover:to-[#d4806a] text-white"
                >
                  {loading ? 'Saving...' : 'Save Entry'}
                </Button>
                <Button
                  onClick={() => setIsDialogOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}