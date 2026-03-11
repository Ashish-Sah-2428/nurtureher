import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  Heart, ArrowRight, ArrowLeft, ClipboardList, Upload, FileText, Stethoscope,
  Brain, CheckCircle, X, AlertCircle, Sparkles, ShieldCheck, Clock
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../utils/database';

const STEPS = [
  { id: 1, title: 'Assessment', icon: ClipboardList, description: 'Brief mental health questionnaire' },
  { id: 2, title: 'Upload Reports', icon: Upload, description: 'Prescriptions & reports (optional)' },
  { id: 3, title: 'Doctor Review', icon: Stethoscope, description: 'Our doctors review your info' },
  { id: 4, title: 'Specialist Care', icon: Brain, description: 'Connect with a psychiatrist' },
];

const questionsByCategory: Record<string, { question: string; options: string[] }[]> = {
  'post-maternity': [
    { question: 'How long ago did you give birth?', options: ['Less than 1 month', '1-3 months', '3-6 months', 'More than 6 months'] },
    { question: 'How often have you felt sad or hopeless in the past 2 weeks?', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { question: 'Do you have trouble bonding with your baby?', options: ['No, bonding well', 'Sometimes struggle', 'Often struggle', 'Severe difficulty bonding'] },
    { question: 'How often do you feel overwhelmed by motherhood?', options: ['Rarely', 'Sometimes', 'Often', 'All the time'] },
    { question: 'Have you experienced thoughts of harming yourself or your baby?', options: ['Never', 'Rarely', 'Sometimes', 'Often (Please seek immediate help)'] },
    { question: 'How would you rate your sleep quality?', options: ['Good', 'Fair', 'Poor', 'Very poor/No sleep'] },
    { question: 'Do you have support from family/partner?', options: ['Strong support', 'Some support', 'Limited support', 'No support'] },
  ],
  'ivf': [
    { question: 'What stage of your IVF journey are you currently in?', options: ['Considering IVF', 'Starting treatment', 'Mid-treatment', 'Post-treatment/Waiting period'] },
    { question: 'How often do you feel anxious or stressed about the IVF process?', options: ['Rarely', 'Sometimes', 'Often', 'Nearly every day'] },
    { question: 'How has the fertility treatment affected your emotional well-being?', options: ['No significant impact', 'Mild emotional changes', 'Moderate emotional struggles', 'Severe emotional distress'] },
    { question: 'Do you experience feelings of hopelessness or sadness?', options: ['Not at all', 'Occasionally', 'Frequently', 'Almost always'] },
    { question: 'How is your relationship with your partner being affected?', options: ['Not affected/No partner', 'Minor strain', 'Moderate tension', 'Significant strain'] },
    { question: 'How do you cope with treatment failures or setbacks?', options: ['Resilient/Good coping', 'Somewhat difficult', 'Very difficult', 'Extremely difficult/Cannot cope'] },
    { question: 'Do you feel supported and understood in your journey?', options: ['Very supported', 'Somewhat supported', 'Limited support', 'Feel isolated/Alone'] },
  ],
  'pcod-pcos': [
    { question: 'How long have you been diagnosed with PCOD/PCOS?', options: ['Recently diagnosed', '6 months - 1 year', '1-3 years', 'More than 3 years'] },
    { question: 'How often do you feel anxious or worried?', options: ['Rarely', 'Sometimes', 'Often', 'Nearly every day'] },
    { question: 'Do hormonal changes affect your mood significantly?', options: ['Not at all', 'Mild effect', 'Moderate effect', 'Severe impact on mood'] },
    { question: 'How do you feel about your body image?', options: ['Positive', 'Somewhat positive', 'Negative', 'Very negative'] },
    { question: 'Have you experienced depression symptoms?', options: ['No', 'Mild symptoms', 'Moderate symptoms', 'Severe symptoms'] },
    { question: 'How is your energy level throughout the day?', options: ['Good energy', 'Moderate energy', 'Low energy', 'Extremely fatigued'] },
    { question: 'Do you feel isolated or misunderstood regarding your condition?', options: ['No, feel supported', 'Sometimes', 'Often', 'Always feel alone'] },
  ],
  'menopause': [
    { question: 'What stage of menopause are you in?', options: ['Perimenopause', 'Early menopause', 'Menopause', 'Post-menopause'] },
    { question: 'How often do you experience mood swings?', options: ['Rarely', 'Sometimes', 'Often', 'Daily/Multiple times a day'] },
    { question: 'Do you experience anxiety or panic attacks?', options: ['Never', 'Occasionally', 'Frequently', 'Daily'] },
    { question: 'How has menopause affected your sleep?', options: ['No impact', 'Mild disruption', 'Moderate disruption', 'Severe insomnia'] },
    { question: 'Have you felt depressed or lost interest in activities?', options: ['Not at all', 'Mild feelings', 'Moderate feelings', 'Severe depression'] },
    { question: 'How do hot flashes/night sweats affect your daily life?', options: ['No impact', 'Minor inconvenience', 'Moderate impact', 'Severely disruptive'] },
    { question: 'Do you feel supported in managing menopause symptoms?', options: ['Very supported', 'Somewhat supported', 'Little support', 'No support at all'] },
  ],
};

export function CareJourneyPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const navigate = useNavigate();
  const { user, getValidToken } = useAuth();

  // Step management
  const [activeStep, setActiveStep] = useState(1);

  // Step 1: Assessment state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Step 2: Upload state
  const [files, setFiles] = useState<File[]>([]);
  const [uploadNotes, setUploadNotes] = useState('');

  // Loading
  const [loading, setLoading] = useState(false);
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [uploadsSubmitted, setUploadsSubmitted] = useState(false);

  // If user already completed assessment, redirect to home
  useEffect(() => {
    if (user?.category) {
      console.log('✅ Patient already assessed, redirecting to home');
      navigate('/home', { replace: true });
    }
  }, [user, navigate]);

  const questions = questionsByCategory[category] || [];

  // --- Assessment logic ---
  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleNextQuestion = () => {
    if (!answers[currentQuestion]) {
      toast.error('Please answer the current question');
      return;
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const calculateDepressionLevel = () => {
    const answerValues = Object.values(answers || {});
    const severeCount = answerValues.filter(
      (a) => a.includes('Often') || a.includes('Severe') || a.includes('Daily') || a.includes('Nearly every day') || a.includes('No support') || a.includes('Very poor') || a.includes('Always')
    ).length;
    if (severeCount >= 4) return 'severe';
    if (severeCount >= 2) return 'moderate';
    return 'mild';
  };

  const handleSubmitAssessment = async () => {
    if (Object.keys(answers || {}).length !== questions.length) {
      toast.error('Please answer all questions');
      return;
    }
    setLoading(true);
    
    console.log('🚀 ===== CARE JOURNEY ASSESSMENT SAVE START =====');
    
    try {
      const token = await getValidToken();
      if (!token) { 
        console.error('❌ No token available');
        toast.error('Session expired. Please sign in again.'); 
        navigate('/auth'); 
        return; 
      }

      console.log('Step 1: Verifying user session...');
      const currentUser = db.verifyToken(token);
      
      if (!currentUser) {
        console.error('❌ Invalid session');
        toast.error('Session expired. Please sign in again.');
        navigate('/auth');
        return;
      }
      
      console.log('✅ User verified:', currentUser.email);

      const depressionLevel = calculateDepressionLevel();
      
      console.log('Step 2: Saving assessment...');
      const assessment = await db.saveAssessment({
        userId: currentUser.id,
        userEmail: currentUser.email!,
        category: category,
        answers,
        additionalNotes,
        depressionLevel,
      });
      
      console.log('✅ SUCCESS! Assessment saved:', assessment?.id);
      console.log('Assessment data:', {
        id: assessment?.id,
        category: assessment?.category,
        depressionLevel: assessment?.depressionLevel,
        answersCount: assessment?.answers ? Object.keys(assessment.answers).length : 0,
      });
      
      toast.success('Assessment completed! Moving to next step...');
      setAssessmentSubmitted(true);
      setActiveStep(2);
      
    } catch (error: any) {
      console.error('❌ EXCEPTION occurred:', error);
      toast.error(`Error: ${error?.message || 'Failed to save assessment'}`);
    } finally {
      setLoading(false);
      console.log('🏁 ===== CARE JOURNEY ASSESSMENT SAVE END =====\n');
    }
  };

  // --- Upload logic ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => setFiles(files.filter((_, i) => i !== index));

  const handleSubmitUploads = async () => {
    setLoading(true);
    try {
      const token = await getValidToken();
      if (!token) { 
        toast.error('Session expired.'); 
        navigate('/auth'); 
        return; 
      }

      // For now, just store file info locally without upload
      // Files will be handled in future when backend is ready
      if (files.length > 0) {
        console.log('📎 Files selected:', files.map(f => f.name));
        console.log('📝 Upload notes:', uploadNotes);
        toast.success(`${files.length} file(s) prepared for upload`);
      }
      
      toast.success('Moving to doctor review...');
      setUploadsSubmitted(true);
      setActiveStep(3);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipUpload = () => {
    setUploadsSubmitted(true);
    setActiveStep(3);
  };

  // --- Invalid category ---
  if (!category || !questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-[#fdf0ec] to-blue-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Category</h2>
          <p className="text-gray-600 mb-4">Please select a category first</p>
          <Button onClick={() => navigate('/category-selection')}>Go Back</Button>
        </Card>
      </div>
    );
  }

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;
  const isLastQuestion = currentQuestion === questions.length - 1;

  const categoryLabel = category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-[#fdf0ec] to-blue-50 py-8 px-4">
      <div className="w-full max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full mb-3">
            <Heart className="w-4 h-4 text-[#e8967a]" fill="currentColor" />
            <span className="text-sm font-medium text-purple-900">{categoryLabel} — Care Journey</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-purple-900">Your Personalized Care Path</h1>
        </motion.div>

        {/* Stepper */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {STEPS.map((step, i) => {
              const isActive = activeStep === step.id;
              const isCompleted = activeStep > step.id;
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center relative">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-200'
                        : isActive
                        ? 'bg-gradient-to-br from-purple-500 to-[#e8967a] shadow-lg shadow-purple-200 scale-110'
                        : 'bg-white border-2 border-gray-200'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <Icon className={`w-5 h-5 md:w-6 md:h-6 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      )}
                    </div>
                    <span className={`text-xs mt-2 font-medium text-center hidden md:block ${
                      isActive ? 'text-purple-700' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${
                      activeStep > step.id ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* ==================== STEP 1: ASSESSMENT ==================== */}
          {activeStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }}>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-purple-900 mb-1">Step 1: Mental Health Assessment</h2>
                <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="h-2.5 bg-white/60 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-purple-500 to-[#e8967a]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
                </div>
              </div>

              <Card className="p-6 md:p-8 mb-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-xl md:text-2xl font-bold text-purple-900 mb-6">{questions[currentQuestion].question}</h3>
                <RadioGroup value={answers[currentQuestion] || ''} onValueChange={handleAnswer} className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        answers[currentQuestion] === option ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                      }`}
                    >
                      <RadioGroupItem value={option} id={`q${currentQuestion}-opt-${index}`} />
                      <Label htmlFor={`q${currentQuestion}-opt-${index}`} className="flex-1 text-base md:text-lg cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>

                {isLastQuestion && (
                  <div className="mt-8">
                    <Label className="text-lg font-semibold text-purple-900 mb-3 block">Additional Notes (Optional)</Label>
                    <Textarea
                      placeholder="Share anything else that might help us understand your situation..."
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      className="min-h-28 border-gray-200"
                    />
                  </div>
                )}
              </Card>

              <div className="flex gap-4">
                <Button onClick={handlePrevQuestion} disabled={currentQuestion === 0} variant="outline" className="flex-1 h-13 text-base rounded-xl disabled:opacity-50">
                  <ArrowLeft className="mr-2 w-4 h-4" /> Previous
                </Button>
                {isLastQuestion ? (
                  <Button onClick={handleSubmitAssessment} disabled={loading || !answers[currentQuestion]} className="flex-1 h-13 text-base bg-gradient-to-r from-purple-500 to-[#e8967a] hover:from-purple-600 hover:to-[#d4806a] text-white rounded-xl disabled:opacity-50">
                    {loading ? 'Submitting...' : 'Submit & Next Step'}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                ) : (
                  <Button onClick={handleNextQuestion} disabled={!answers[currentQuestion]} className="flex-1 h-13 text-base bg-gradient-to-r from-purple-500 to-[#e8967a] hover:from-purple-600 hover:to-[#d4806a] text-white rounded-xl disabled:opacity-50">
                    Next Question <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* ==================== STEP 2: UPLOAD ==================== */}
          {activeStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }}>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-purple-900 mb-1">Step 2: Upload Medical Documents</h2>
                <p className="text-gray-600">Share existing prescriptions or reports — this is optional</p>
              </div>

              <Card className="p-6 md:p-8 mb-6 bg-white/80 backdrop-blur-sm">
                <Label className="text-lg font-semibold text-purple-900 mb-3 block">Prescriptions & Reports</Label>

                {/* Drop zone */}
                <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors mb-6">
                  <input type="file" id="care-file-upload" multiple accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
                  <label htmlFor="care-file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                    <p className="text-lg font-medium text-purple-900 mb-1">Click to upload files</p>
                    <p className="text-sm text-gray-500">Supported: JPG, PNG, PDF</p>
                  </label>
                </div>

                {/* File list */}
                {files.length > 0 && (
                  <div className="mb-6 space-y-2">
                    {files.map((file, index) => (
                      <motion.div key={`${file.name}-${index}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <FileText className="w-5 h-5 text-purple-600 flex-shrink-0" />
                        <span className="flex-1 text-gray-700 truncate">{file.name}</span>
                        <span className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                        <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 transition-colors"><X className="w-5 h-5" /></button>
                      </motion.div>
                    ))}
                  </div>
                )}

                <Label className="text-lg font-semibold text-purple-900 mb-3 block">Additional Notes (Optional)</Label>
                <Textarea
                  placeholder="Any additional information about your medications or treatment history..."
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  className="min-h-28 border-gray-200"
                />
              </Card>

              <div className="flex gap-4">
                <Button onClick={handleSkipUpload} variant="outline" className="flex-1 h-13 text-base rounded-xl border-2 border-purple-300 hover:bg-purple-50">
                  Skip for Now
                </Button>
                <Button onClick={handleSubmitUploads} disabled={loading} className="flex-1 h-13 text-base bg-gradient-to-r from-purple-500 to-[#e8967a] hover:from-purple-600 hover:to-[#d4806a] text-white rounded-xl disabled:opacity-50">
                  {loading ? 'Uploading...' : files.length > 0 ? 'Upload & Continue' : 'Continue'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ==================== STEP 3: DOCTOR REVIEW ==================== */}
          {activeStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }}>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-purple-900 mb-1">Step 3: Doctor Review</h2>
                <p className="text-gray-600">Your information is now with our medical team</p>
              </div>

              <Card className="p-8 md:p-10 mb-6 bg-white/80 backdrop-blur-sm text-center">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-[#e8967a] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-200">
                    <Stethoscope className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
                <h3 className="text-2xl font-bold text-purple-900 mb-3">Our Doctors Are Reviewing</h3>
                <p className="text-gray-600 max-w-lg mx-auto mb-8">
                  Your assessment and uploaded documents have been submitted to our medical team.
                  Our qualified women doctors will carefully review your information and prepare personalized care recommendations.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: ShieldCheck, title: 'Confidential', desc: 'Your data is 100% private & secure' },
                    { icon: Clock, title: 'Quick Review', desc: 'Response within 24-48 hours' },
                    { icon: Heart, title: 'Compassionate', desc: 'By women, for women' },
                  ].map((item) => (
                    <Card key={item.title} className="p-4 bg-purple-50/60 border border-purple-100">
                      <item.icon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-purple-900 text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
                    </Card>
                  ))}
                </div>

                <Button onClick={() => setActiveStep(4)} className="bg-gradient-to-r from-purple-500 to-[#e8967a] hover:from-purple-600 hover:to-[#d4806a] text-white px-10 py-6 text-base rounded-full shadow-lg">
                  Continue <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Card>
            </motion.div>
          )}

          {/* ==================== STEP 4: SPECIALIST CARE ==================== */}
          {activeStep === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }}>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-purple-900 mb-1">Step 4: Specialist Care</h2>
                <p className="text-gray-600">Connecting you with the right specialist if needed</p>
              </div>

              <Card className="p-8 md:p-10 mb-6 bg-white/80 backdrop-blur-sm text-center">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15 }}>
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
                <h3 className="text-2xl font-bold text-purple-900 mb-3">Personalized Specialist Connection</h3>
                <p className="text-gray-600 max-w-lg mx-auto mb-8">
                  Based on your assessment results, if our doctors determine that specialized psychiatric care would benefit you,
                  you'll be connected with an experienced psychiatrist from our team for comprehensive mental health support.
                </p>

                {/* What you can expect */}
                <Card className="p-6 bg-gradient-to-r from-purple-50 to-[#fdf0ec] border border-purple-200 text-left mb-8 max-w-lg mx-auto">
                  <h4 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" /> What to Expect
                  </h4>
                  <ul className="space-y-3">
                    {[
                      'Personalized care plan designed for your specific needs',
                      'One-on-one sessions with a qualified psychiatrist',
                      'Ongoing monitoring & follow-up appointments',
                      'Access to self-care tools, mood tracker & journal',
                      'Secure community support from women like you',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Completion */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2 rounded-full mb-6">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Your Care Journey is All Set!</span>
                  </div>
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => navigate('/home')} className="bg-gradient-to-r from-purple-500 to-[#e8967a] hover:from-purple-600 hover:to-[#d4806a] text-white px-10 py-6 text-base rounded-full shadow-lg">
                    Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button onClick={() => navigate('/mood')} variant="outline" className="px-8 py-6 text-base rounded-full border-2 border-purple-300 hover:bg-purple-50">
                    Track Your Mood
                  </Button>
                </div>
              </Card>

              <p className="text-center text-sm text-gray-500 mt-4">
                Remember: You are not alone. NurtureHer is here to support you every step of the way.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom info */}
        <p className="text-center text-xs text-gray-400 mt-8">
          Your information is confidential and handled with utmost care
        </p>
      </div>
    </div>
  );
}