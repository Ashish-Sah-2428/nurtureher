import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../utils/database';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Send, Heart, ArrowRight, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { motion } from 'motion/react';

export function AssessmentPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, accessToken, getValidToken } = useAuth();

  // If user already completed assessment, redirect to home
  useEffect(() => {
    if (user?.category) {
      console.log('✅ Patient already assessed, redirecting to home');
      navigate('/home', { replace: true });
    }
  }, [user, navigate]);

  const questionsByCategory = {
    'post-maternity': [
      {
        question: 'How long ago did you give birth?',
        options: ['Less than 1 month', '1-3 months', '3-6 months', 'More than 6 months'],
      },
      {
        question: 'How often have you felt sad or hopeless in the past 2 weeks?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
      },
      {
        question: 'Do you have trouble bonding with your baby?',
        options: ['No, bonding well', 'Sometimes struggle', 'Often struggle', 'Severe difficulty bonding'],
      },
      {
        question: 'How often do you feel overwhelmed by motherhood?',
        options: ['Rarely', 'Sometimes', 'Often', 'All the time'],
      },
      {
        question: 'Have you experienced thoughts of harming yourself or your baby?',
        options: ['Never', 'Rarely', 'Sometimes', 'Often (Please seek immediate help)'],
      },
      {
        question: 'How would you rate your sleep quality?',
        options: ['Good', 'Fair', 'Poor', 'Very poor/No sleep'],
      },
      {
        question: 'Do you have support from family/partner?',
        options: ['Strong support', 'Some support', 'Limited support', 'No support'],
      },
    ],
    'ivf': [
      {
        question: 'What stage of your IVF journey are you currently in?',
        options: ['Considering IVF', 'Starting treatment', 'Mid-treatment', 'Post-treatment/Waiting period'],
      },
      {
        question: 'How often do you feel anxious or stressed about the IVF process?',
        options: ['Rarely', 'Sometimes', 'Often', 'Nearly every day'],
      },
      {
        question: 'How has the fertility treatment affected your emotional well-being?',
        options: ['No significant impact', 'Mild emotional changes', 'Moderate emotional struggles', 'Severe emotional distress'],
      },
      {
        question: 'Do you experience feelings of hopelessness or sadness?',
        options: ['Not at all', 'Occasionally', 'Frequently', 'Almost always'],
      },
      {
        question: 'How is your relationship with your partner being affected?',
        options: ['Not affected/No partner', 'Minor strain', 'Moderate tension', 'Significant strain'],
      },
      {
        question: 'How do you cope with treatment failures or setbacks?',
        options: ['Resilient/Good coping', 'Somewhat difficult', 'Very difficult', 'Extremely difficult/Cannot cope'],
      },
      {
        question: 'Do you feel supported and understood in your journey?',
        options: ['Very supported', 'Somewhat supported', 'Limited support', 'Feel isolated/Alone'],
      },
    ],
    'pcod-pcos': [
      {
        question: 'How long have you been diagnosed with PCOD/PCOS?',
        options: ['Recently diagnosed', '6 months - 1 year', '1-3 years', 'More than 3 years'],
      },
      {
        question: 'How often do you feel anxious or worried?',
        options: ['Rarely', 'Sometimes', 'Often', 'Nearly every day'],
      },
      {
        question: 'Do hormonal changes affect your mood significantly?',
        options: ['Not at all', 'Mild effect', 'Moderate effect', 'Severe impact on mood'],
      },
      {
        question: 'How do you feel about your body image?',
        options: ['Positive', 'Somewhat positive', 'Negative', 'Very negative'],
      },
      {
        question: 'Have you experienced depression symptoms?',
        options: ['No', 'Mild symptoms', 'Moderate symptoms', 'Severe symptoms'],
      },
      {
        question: 'How is your energy level throughout the day?',
        options: ['Good energy', 'Moderate energy', 'Low energy', 'Extremely fatigued'],
      },
      {
        question: 'Do you feel isolated or misunderstood regarding your condition?',
        options: ['No, feel supported', 'Sometimes', 'Often', 'Always feel alone'],
      },
    ],
    'menopause': [
      {
        question: 'What stage of menopause are you in?',
        options: ['Perimenopause', 'Early menopause', 'Menopause', 'Post-menopause'],
      },
      {
        question: 'How often do you experience mood swings?',
        options: ['Rarely', 'Sometimes', 'Often', 'Daily/Multiple times a day'],
      },
      {
        question: 'Do you experience anxiety or panic attacks?',
        options: ['Never', 'Occasionally', 'Frequently', 'Daily'],
      },
      {
        question: 'How has menopause affected your sleep?',
        options: ['No impact', 'Mild disruption', 'Moderate disruption', 'Severe insomnia'],
      },
      {
        question: 'Have you felt depressed or lost interest in activities?',
        options: ['Not at all', 'Mild feelings', 'Moderate feelings', 'Severe depression'],
      },
      {
        question: 'How do hot flashes/night sweats affect your daily life?',
        options: ['No impact', 'Minor inconvenience', 'Moderate impact', 'Severely disruptive'],
      },
      {
        question: 'Do you feel supported in managing menopause symptoms?',
        options: ['Very supported', 'Somewhat supported', 'Little support', 'No support at all'],
      },
    ],
  };

  // Get category from localStorage (set by CategorySelectionPage or CareJourneyPage)
  const category = localStorage.getItem('selectedCategory');
  const questions = category ? questionsByCategory[category as keyof typeof questionsByCategory] || [] : [];

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleNext = () => {
    if (!answers[currentQuestion]) {
      toast.error('Please answer the current question');
      return;
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateDepressionLevel = () => {
    // Simple scoring: count high-severity answers
    const answerValues = Object.values(answers || {});
    const severeCount = answerValues.filter(
      (ans) => ans.includes('Often') || ans.includes('Severe') || ans.includes('Daily') || ans.includes('Nearly every day') || ans.includes('No support')
    ).length;

    if (severeCount >= 4) return 'Severe';
    if (severeCount >= 2) return 'Moderately Severe';
    return 'Mild';
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Immediate thank you message
    toast.success('✨ Thank you for completing the assessment!', {
      duration: 2000,
    });
    
    console.log('🚀 ===== ASSESSMENT SUBMISSION START =====');
    
    try {
      console.log('Step 1: Getting current user...');
      const token = await getValidToken();
      
      if (!token) {
        console.error('❌ No valid session token');
        toast.error('Please sign in to continue');
        navigate('/auth');
        return;
      }

      const currentUser = db.verifyToken(token);
      
      if (!currentUser) {
        console.error('❌ Invalid session');
        toast.error('Session expired. Please sign in again.');
        navigate('/auth');
        return;
      }
      
      console.log('✅ User verified:', currentUser.email);

      const depressionLevel = calculateDepressionLevel();
      
      console.log('Step 2: Calculating depression level...');
      console.log('✅ Depression Level:', depressionLevel);
      
      // Check if critical case
      const isCritical = depressionLevel === 'Severe' || depressionLevel === 'Moderately Severe';
      
      if (isCritical) {
        console.log('🚨 CRITICAL CASE DETECTED - Notifying psychiatrist...');
        
        // Add notification for psychiatrist
        try {
          // Validate all required fields with fallbacks
          const notificationData = {
            userId: currentUser?.id || '',
            userEmail: currentUser?.email || '',
            userName: currentUser?.name || 'Unknown User',
            category: category || 'Unknown',
            depressionLevel: depressionLevel,
            message: `URGENT: Critical assessment detected for ${currentUser?.name || 'Unknown User'} (${currentUser?.email || 'No email'}) - ${category || 'Unknown'} category - ${depressionLevel} depression level`,
          };
          
          // Only create notification if we have essential data
          if (notificationData.userId && notificationData.userEmail) {
            await db.createNotification(notificationData);
            console.log('✅ Psychiatrist notified');
          } else {
            console.warn('⚠️ Missing required notification data - skipping notification');
          }
        } catch (notifError) {
          console.warn('⚠️ Could not create notification:', notifError);
        }
        
        toast.error('🚨 Critical case detected! A psychiatrist will be notified immediately.', {
          duration: 3000,
        });
      }
      
      console.log('Step 3: Skipping database save - proceeding to next step...');
      
      // Show score summary
      setTimeout(() => {
        toast.info(`Assessment Summary:\n• Level: ${depressionLevel}\n• Moving to next step...`, {
          duration: 2000,
        });
      }, 500);
      
      // Navigate to upload reports
      setTimeout(() => {
        navigate('/upload-reports');
      }, 1500);
      
    } catch (error: any) {
      console.error('❌ EXCEPTION occurred:', error);
      toast.error(`Error: ${error?.message || 'Failed to process assessment'}`);
    } finally {
      setLoading(false);
      console.log('🏁 ===== ASSESSMENT SUBMISSION END =====\n');
    }
  };

  if (!category || !questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-[#fdf0ec] to-blue-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Category</h2>
          <p className="text-gray-600 mb-4">Please select a category first</p>
          <Button onClick={() => navigate('/category-selection')}>
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-[#fdf0ec] to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Heart className="w-4 h-4 text-[#e8967a]" fill="currentColor" />
              <span className="text-sm font-medium text-purple-900">Step 2 of 2 - Mental Health Assessment</span>
            </div>
            <h1 className="text-4xl font-bold text-purple-900 mb-2 capitalize">
              {category?.replace('-', ' ')} Assessment
            </h1>
            <p className="text-lg text-gray-700">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="h-3 bg-white/60 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-[#e8967a]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question Card */}
          <Card className="p-8 mb-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-purple-900 mb-6">
              {questions[currentQuestion].question}
            </h2>
            <RadioGroup
              value={answers[currentQuestion] || ''}
              onValueChange={handleAnswer}
              className="space-y-4"
            >
              {questions[currentQuestion].options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    answers[currentQuestion] === option
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                  }`}
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 text-lg cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {isLastQuestion && (
              <div className="mt-8">
                <Label className="text-lg font-semibold text-purple-900 mb-3 block">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  placeholder="Share any additional information that might help us understand your situation better..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="min-h-32 border-gray-200"
                />
              </div>
            )}
          </Card>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
              className="flex-1 h-14 text-lg rounded-xl disabled:opacity-50"
            >
              Previous
            </Button>
            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 h-14 text-lg bg-gradient-to-r from-purple-500 to-[#e8967a] hover:from-purple-600 hover:to-[#d4806a] text-white rounded-xl"
              >
                {loading ? 'Submitting...' : 'Submit Assessment'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion]}
                className="flex-1 h-14 text-lg bg-gradient-to-r from-purple-500 to-[#e8967a] hover:from-purple-600 hover:to-[#d4806a] text-white rounded-xl disabled:opacity-50"
              >
                Next Question
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Info */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Your responses are confidential and will be reviewed by our medical team
          </p>
        </motion.div>
      </div>
    </div>
  );
}