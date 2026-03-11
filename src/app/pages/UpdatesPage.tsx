import { useState } from 'react';
import { Award, Calendar, Heart, TrendingUp, Bell, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { motion } from 'motion/react';

export function UpdatesPage() {
  const [activeTab, setActiveTab] = useState('all');

  const updates = [
    {
      type: 'announcement',
      title: 'NurtureHer Platform is Now Live',
      description: 'We are excited to announce that NurtureHer is officially live! Our platform offers specialized mental health support for women across Post-Maternity, IVF, and Menopause care areas.',
      date: '2026-03-07',
      icon: Sparkles,
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      type: 'awareness',
      title: 'Understanding Postpartum Depression',
      description: 'Research shows that approximately 1 in 7 women experience postpartum depression. Early identification and professional support can make a significant difference in recovery.',
      date: '2026-03-05',
      icon: Heart,
      color: 'from-[#e8967a] to-[#d4806a]',
    },
    {
      type: 'announcement',
      title: 'Menopause Mental Health Support',
      description: 'Our platform now includes a dedicated menopause care pathway with specialized assessment tools and access to psychiatric consultations for menopause-related mental health challenges.',
      date: '2026-03-03',
      icon: Sparkles,
      color: 'from-[#e8967a] to-[#c0705a]',
    },
    {
      type: 'awareness',
      title: 'PCOD/PCOS and Mental Health',
      description: 'Studies suggest that women with PCOD/PCOS may be at higher risk for anxiety and depression. Recognizing the signs early and seeking support is an important step toward wellbeing.',
      date: '2026-03-01',
      icon: TrendingUp,
      color: 'from-[#e8967a] to-[#c0705a]',
    },
    {
      type: 'awareness',
      title: 'IVF Journey and Emotional Wellbeing',
      description: 'The IVF process can be emotionally demanding. Our platform provides mental health assessments and resources specifically designed to support women through their fertility journey.',
      date: '2026-02-27',
      icon: Heart,
      color: 'from-[#e8967a] to-[#d4806a]',
    },
    {
      type: 'awareness',
      title: 'Supporting Women Through Pregnancy Loss',
      description: 'Pregnancy loss can be a deeply emotional experience. Our platform offers resources and support to help women navigate this challenging time.',
      date: '2026-02-24',
      icon: Heart,
      color: 'from-[#e8967a] to-[#d4806a]',
    },
  ];

  const filteredUpdates = activeTab === 'all' 
    ? updates 
    : updates.filter(update => update.type === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-[#fce8e0] to-blue-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-[#e8967a] rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-7 h-7 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              NurtureHer
            </span>
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bell className="w-8 h-8 text-purple-600" />
            <h1 className="text-5xl font-bold text-purple-900">
              Latest Updates
            </h1>
          </div>
          <p className="text-xl text-gray-700">
            Stay informed about our achievements, announcements, and mental health awareness
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white text-center">
              <Award className="w-10 h-10 mx-auto mb-3" />
              <p className="text-3xl font-bold mb-1">For Women</p>
              <p className="text-purple-100">By Women Doctors</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-[#e8967a] to-[#d4806a] text-white text-center">
              <Heart className="w-10 h-10 mx-auto mb-3" fill="currentColor" />
              <p className="text-3xl font-bold mb-1">Compassionate</p>
              <p className="text-[#fce8e0]">Evidence-Based Care</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-center">
              <TrendingUp className="w-10 h-10 mx-auto mb-3" />
              <p className="text-3xl font-bold mb-1">24/7</p>
              <p className="text-indigo-100">Support Available</p>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-4 bg-purple-100/80 backdrop-blur-sm p-1 border border-purple-200">
            <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-[#e8967a] data-[state=active]:text-white">
              All Updates
            </TabsTrigger>
            <TabsTrigger value="achievement" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-[#e8967a] data-[state=active]:text-white">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="awareness" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-[#e8967a] data-[state=active]:text-white">
              Awareness
            </TabsTrigger>
            <TabsTrigger value="announcement" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-[#e8967a] data-[state=active]:text-white">
              Announcements
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Updates List */}
        <div className="space-y-6">
          {filteredUpdates.map((update, index) => (
            <motion.div
              key={update.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden bg-gradient-to-r from-white/90 to-[#fdf0ec]/80 backdrop-blur-sm hover:shadow-xl transition-shadow border border-[#f4a991]/30">
                <div className="flex">
                  <div className={`w-2 bg-gradient-to-b ${update.color}`}></div>
                  <div className="flex-1 p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${update.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                        <update.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold capitalize">
                            {update.type}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {new Date(update.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-purple-900 mb-2">
                          {update.title}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {update.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Subscribe Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16"
        >
          <Card className="p-10 bg-gradient-to-r from-purple-600 via-[#d4806a] to-purple-600 text-center">
            <Bell className="w-12 h-12 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-3">
              Stay Connected
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Get the latest updates, mental health tips, and announcements delivered to you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg rounded-full font-semibold">
                  Join NurtureHer
                </Button>
              </Link>
              <Link to="/bulletin-board">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full font-semibold">
                  Our Mission
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}