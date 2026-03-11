import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { motion } from 'motion/react';
import { Heart, Brain, Moon, Flower, Play, Book, Headphones } from 'lucide-react';

export function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('meditation');

  const meditations = [
    {
      title: '5-Minute Morning Calm',
      duration: '5 min',
      description: 'Start your day with peace and positivity',
      category: 'Morning',
      image: 'https://images.unsplash.com/photo-1758274526406-4c3a319da0bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxtJTIwd29tYW4lMjB5b2dhJTIwbWluZGZ1bG5lc3N8ZW58MXx8fHwxNzcyNDYzNTU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      title: 'Anxiety Relief',
      duration: '10 min',
      description: 'Calm your mind and ease anxious thoughts',
      category: 'Anxiety',
      image: 'https://images.unsplash.com/photo-1765732023579-9c158916da7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMHdvbWFuJTIwbWVkaXRhdGlvbiUyMG5hdHVyZXxlbnwxfHx8fDE3NzI0NjM1NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      title: 'Sleep Meditation',
      duration: '15 min',
      description: 'Drift into peaceful, restful sleep',
      category: 'Sleep',
      image: 'https://images.unsplash.com/photo-1598601065215-751bf8798a2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHdvbWFuJTIwc3VucmlzZSUyMHdlbGxuZXNzfGVufDF8fHx8MTc3MjQ2MzU1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
  ];

  const exercises = [
    {
      title: 'Breathing Techniques',
      description: 'Learn powerful breathing exercises for instant calm',
      icon: Heart,
      steps: ['Box Breathing (4-4-4-4)', 'Deep Belly Breathing', '4-7-8 Technique'],
    },
    {
      title: 'Grounding Exercise',
      description: 'Use the 5-4-3-2-1 technique to center yourself',
      icon: Brain,
      steps: ['5 things you see', '4 things you touch', '3 things you hear', '2 things you smell', '1 thing you taste'],
    },
    {
      title: 'Progressive Muscle Relaxation',
      description: 'Release physical tension throughout your body',
      icon: Flower,
      steps: ['Start with toes', 'Move up through legs', 'Relax core and back', 'Release shoulders', 'Relax face'],
    },
  ];

  const articles = [
    {
      title: 'Understanding Your Emotions',
      category: 'Mental Health',
      readTime: '5 min read',
      excerpt: 'Learn how to identify and process your emotions in healthy ways.',
    },
    {
      title: 'Self-Care Isn\'t Selfish',
      category: 'Self-Care',
      readTime: '4 min read',
      excerpt: 'Discover why taking care of yourself is essential for wellbeing.',
    },
    {
      title: 'Managing Stress Daily',
      category: 'Stress',
      readTime: '6 min read',
      excerpt: 'Practical tips for incorporating stress management into your routine.',
    },
    {
      title: 'Building Resilience',
      category: 'Growth',
      readTime: '7 min read',
      excerpt: 'Develop the mental strength to overcome life\'s challenges.',
    },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-purple-900 mb-2">
            Wellness Resources ✨
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Tools and guides to support your mental health journey
          </p>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/80 backdrop-blur-sm p-1">
              <TabsTrigger value="meditation" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-[#e8967a] data-[state=active]:text-white">
                <Headphones className="w-4 h-4 mr-2" />
                Meditation
              </TabsTrigger>
              <TabsTrigger value="exercises" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-[#e8967a] data-[state=active]:text-white">
                <Heart className="w-4 h-4 mr-2" />
                Exercises
              </TabsTrigger>
              <TabsTrigger value="articles" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-[#e8967a] data-[state=active]:text-white">
                <Book className="w-4 h-4 mr-2" />
                Articles
              </TabsTrigger>
            </TabsList>

            <TabsContent value="meditation">
              <div className="grid md:grid-cols-3 gap-6">
                {meditations.map((meditation, index) => (
                  <motion.div
                    key={meditation.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow group cursor-pointer">
                      <div className="relative">
                        <img
                          src={meditation.image}
                          alt={meditation.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
                            <Play className="w-6 h-6 text-purple-600 ml-1" fill="currentColor" />
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {meditation.duration}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold mb-3">
                          {meditation.category}
                        </div>
                        <h3 className="text-lg font-bold text-purple-900 mb-2">
                          {meditation.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {meditation.description}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="exercises">
              <div className="space-y-6">
                {exercises.map((exercise, index) => (
                  <motion.div
                    key={exercise.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                      <div className="flex gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-[#e8967a] rounded-2xl flex items-center justify-center flex-shrink-0">
                          <exercise.icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-purple-900 mb-2">
                            {exercise.title}
                          </h3>
                          <p className="text-gray-700 mb-4">{exercise.description}</p>
                          <div className="space-y-2">
                            {exercise.steps.map((step, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                                  {i + 1}
                                </div>
                                <span className="text-gray-700">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="articles">
              <div className="grid md:grid-cols-2 gap-6">
                {articles.map((article, index) => (
                  <motion.div
                    key={article.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow cursor-pointer group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                          {article.category}
                        </div>
                        <span className="text-sm text-gray-500">{article.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold text-purple-900 mb-3 group-hover:text-purple-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-700">{article.excerpt}</p>
                      <button className="mt-4 text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                        Read more →
                      </button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Crisis Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-r from-red-500 to-[#e8967a] p-8 text-white">
              <Heart className="w-10 h-10 mb-4" />
              <h2 className="text-2xl font-bold mb-3">
                Need Immediate Support?
              </h2>
              <p className="text-lg mb-4">
                If you're in crisis or need immediate help, please reach out:
              </p>
              <div className="space-y-2">
                <p className="font-semibold">National Crisis Hotline: 988</p>
                <p className="font-semibold">Crisis Text Line: Text "HELLO" to 741741</p>
              </div>
              <p className="mt-4 text-red-100 text-sm">
                You're not alone. Help is available 24/7.
              </p>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}