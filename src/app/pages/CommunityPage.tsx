import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Users, Heart, MessageCircle, Send } from 'lucide-react';
import { db } from '../utils/database';

interface Post {
  id: string;
  userName: string;
  content: string;
  timestamp: string;
  likes: number;
  anonymous: boolean;
  likedBy?: string[];
}

export function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    try {
      if (!user) return;

      const allPosts = db.getAllPosts();
      setPosts(allPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Please write something');
      return;
    }

    setLoading(true);
    try {
      if (!user) {
        toast.error('Session expired');
        setLoading(false);
        return;
      }

      db.createPost({
        userId: user.id,
        userName: user.name || 'Anonymous',
        content,
        anonymous,
      });

      toast.success('Post shared! 💜');
      setContent('');
      setAnonymous(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      if (!user) {
        toast.error('Please sign in to like posts');
        return;
      }

      db.likePost(postId, user.id);
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
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
            Community Support 💬
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Share your journey and connect with others who understand
          </p>

          {/* Community Guidelines */}
          <Card className="p-6 mb-8 bg-gradient-to-r from-purple-100 to-[#fce8e0] border-2 border-purple-200">
            <div className="flex items-start gap-4">
              <Heart className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" fill="currentColor" />
              <div>
                <h3 className="text-lg font-bold text-purple-900 mb-2">
                  Safe Space Guidelines
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Be kind and supportive to everyone</li>
                  <li>• Respect privacy and confidentiality</li>
                  <li>• No judgment - we're all on our own journey</li>
                  <li>• Share from the heart, listen with empathy</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Create Post */}
          <Card className="p-6 mb-8 bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-purple-900 mb-4">
              Share Your Thoughts
            </h2>
            <Textarea
              placeholder="What's on your mind? Share your experiences, ask for support, or offer encouragement..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mb-4 min-h-32 border-gray-200"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  id="anonymous"
                  checked={anonymous}
                  onCheckedChange={setAnonymous}
                />
                <Label htmlFor="anonymous" className="text-gray-700 cursor-pointer">
                  Post anonymously
                </Label>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={loading || !content.trim()}
                className="bg-gradient-to-r from-purple-500 to-[#e8967a] hover:from-purple-600 hover:to-[#d4806a] text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? 'Posting...' : 'Share'}
              </Button>
            </div>
          </Card>

          {/* Community Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <Users className="w-8 h-8 mb-2" />
              <p className="text-2xl font-bold">Community</p>
              <p className="text-purple-100 text-sm">Growing Together</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-[#e8967a] to-[#d4806a] text-white">
              <MessageCircle className="w-8 h-8 mb-2" />
              <p className="text-2xl font-bold">{posts.length}</p>
              <p className="text-[#fce8e0] text-sm">Shared Stories</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-purple-500 to-[#e8967a] text-white">
              <Heart className="w-8 h-8 mb-2" fill="currentColor" />
              <p className="text-2xl font-bold">{posts.reduce((sum, p) => sum + (p.likes || 0), 0)}</p>
              <p className="text-purple-100 text-sm">Support Given</p>
            </Card>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">
              Community Posts
            </h2>

            {posts.length === 0 ? (
              <Card className="p-12 text-center bg-white/80 backdrop-blur-sm">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-600">
                  Be the first to share your story with the community!
                </p>
              </Card>
            ) : (
              posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-[#e8967a] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {post.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-purple-900">
                              {post.userName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {new Date(post.timestamp).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-4">
                          <button
                            className="flex items-center gap-2 text-gray-600 hover:text-[#d4806a] transition-colors"
                            onClick={() => handleLike(post.id)}
                          >
                            <Heart className="w-5 h-5" />
                            <span className="text-sm font-medium">
                              {post.likes} Support
                            </span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">Reply</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}