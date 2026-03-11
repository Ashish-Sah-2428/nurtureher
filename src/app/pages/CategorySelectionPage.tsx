import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Baby, Syringe, Flower2, ArrowRight, CheckCircle2, Heart } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { localDB } from '../utils/localDatabase';
import { db } from '../utils/database';

export function CategorySelectionPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, getValidToken } = useAuth();

  // If user already completed assessment, redirect to home
  useEffect(() => {
    if (!user) return;
    // Check both in-memory user and fresh DB record
    const hasCategory = user.category;
    if (!hasCategory) {
      // Double-check from database in case AuthContext state is stale
      try {
        const freshUser = localDB.getUser(user.id);
        if (freshUser?.category) {
          console.log('✅ Patient already assessed (DB check), redirecting to home');
          navigate('/home', { replace: true });
          return;
        }
      } catch {}
    }
    if (hasCategory) {
      console.log('✅ Patient already assessed, redirecting to home');
      navigate('/home', { replace: true });
    }
  }, [user, navigate]);

  const categories = [
    {
      id: 'post-maternity',
      title: 'Post-Maternity',
      description: 'Support for postpartum mental health, anxiety, and depression after childbirth',
      icon: Baby,
      color: 'from-[#e8967a] to-[#d4806a]',
      textColor: 'text-pink-600',
    },
    {
      id: 'ivf',
      title: 'IVF',
      description: 'Mental wellness support during fertility treatments and IVF journey',
      icon: Syringe,
      color: 'from-purple-400 to-indigo-400',
      textColor: 'text-purple-600',
    },
    {
      id: 'menopause',
      title: 'Menopause',
      description: 'Compassionate care through emotional transitions and hormonal changes',
      icon: Flower2,
      color: 'from-indigo-400 to-blue-400',
      textColor: 'text-indigo-600',
    },
  ];

  const handleCategorySelect = (categoryId: string) => {
    console.log('Category selected:', categoryId);
    setSelectedCategory(categoryId);
  };

  const handleContinue = async () => {
    if (!selectedCategory) {
      toast.error('Please select a category to continue');
      return;
    }

    // Save category to localStorage for assessment page
    localStorage.setItem('selectedCategory', selectedCategory);

    console.log('✅ Category selected and saved locally:', selectedCategory);
    toast.success('Category selected! 💜');
    navigate(`/care-journey?category=${selectedCategory}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-[#fdf0ec] to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Heart className="w-4 h-4 text-[#e8967a]" fill="currentColor" />
            <span className="text-sm font-medium text-purple-900">Step 1 of 2</span>
          </div>
          <h1 className="text-5xl font-bold text-purple-900 mb-4">
            Tell Us About Your Journey
          </h1>
          <p className="text-xl text-gray-700">
            Select the area where you need support so we can provide personalized care
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {categories.map((category, index) => {
            const isSelected = selectedCategory === category.id;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`p-8 cursor-pointer transition-all duration-300 rounded-xl border-4 ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50/80 shadow-2xl shadow-purple-200/50'
                      : 'border-gray-200 bg-white/80 hover:border-purple-300 hover:shadow-lg hover:bg-purple-50/30'
                  } backdrop-blur-sm relative overflow-hidden`}
                >
                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-4 right-4 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </motion.div>
                  )}
                  
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-md transition-transform ${isSelected ? 'scale-110' : ''}`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-3 text-center ${category.textColor} transition-all ${isSelected ? 'scale-105' : ''}`}>
                    {category.title}
                  </h3>
                  <p className="text-gray-700 text-center leading-relaxed">
                    {category.description}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Button
            onClick={handleContinue}
            disabled={!selectedCategory}
            className="bg-gradient-to-r from-purple-500 to-[#e8967a] hover:from-purple-600 hover:to-[#d4806a] text-white px-12 py-6 text-lg rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Assessment
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          {selectedCategory && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-purple-600 mt-3 font-medium"
            >
              ✓ {categories.find(c => c.id === selectedCategory)?.title} selected
            </motion.p>
          )}
          <p className="text-sm text-gray-600 mt-2">
            Your information is confidential and secure
          </p>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <Card className="p-6 bg-purple-100/60 backdrop-blur-sm border-2 border-purple-200">
            <h3 className="text-lg font-bold text-purple-900 mb-2">
              What happens next?
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">1.</span>
                <span>Complete a brief mental health assessment questionnaire</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">2.</span>
                <span>Upload any existing prescriptions or medical reports (optional)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">3.</span>
                <span>Our doctors will review your information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">4.</span>
                <span>If needed, you'll be connected with a psychiatrist for specialized care</span>
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}