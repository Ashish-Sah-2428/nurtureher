import { Heart, Sparkles, Users, BookOpen, ArrowRight, Target, Eye, Lightbulb, Award, Home, Syringe } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';

// Team images - Using actual founder and team photos
const founderImage = "/65e16cc05e7faa2cf213be9969ac1a066e684995.png";
const cofounderImage = "/dc18dae1f1d4dca7b0de304d6fb066a961da5bd6.png";
const teamImage = "/787461b130e4726f2fa23b5078c3de584b1349e1.png";
const siteLogo = "/3417faa7ffe484720a74e044251ea8057b0011dc.png";

export function LandingPage() {
  const features = [
    {
      icon: Sparkles,
      title: 'Post-Maternity Care',
      description: 'Specialized support for new mothers navigating postpartum mental health',
    },
    {
      icon: Syringe,
      title: 'IVF Support',
      description: 'Mental wellness support during fertility treatments and IVF journey',
    },
    {
      icon: Users,
      title: 'Menopause Journey',
      description: 'Compassionate support through the emotional transitions of menopause',
    },
    {
      icon: Heart,
      title: 'Expert Medical Care',
      description: 'Professional psychiatric and medical evaluation when needed',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-[#fdf0ec] to-blue-50">
      {/* Sticky Top Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <img src={siteLogo} alt="NurtureHer Logo" className="w-10 h-10 rounded-full object-cover" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                NurtureHer
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Link to="/bulletin-board">
                <Button variant="ghost" className="hidden sm:inline-flex text-[#c0705a] hover:bg-[#fdf0ec] rounded-full">
                  Our Vision
                </Button>
              </Link>
              <Link to="/updates">
                <Button variant="ghost" className="hidden sm:inline-flex text-[#c0705a] hover:bg-[#fdf0ec] rounded-full">
                  Updates
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-purple-500 to-[#e8967a] hover:from-purple-600 hover:to-[#d4806a] text-white rounded-full px-6">
                  Sign In / Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                NurtureHer
              </span>
              <br />
              <span className="text-purple-900 text-3xl md:text-4xl">Women's Mental Wellness</span>
            </h1>
            
            <p className="text-xl text-gray-700 mb-3 font-medium italic text-purple-800">
              "From Preconception to Postpartum Care, For the Women by the Women."
            </p>
            
            <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
              A comprehensive mental health platform designed specifically for women's unique needs - 
              we're here for every stage of your journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-purple-500 to-[#e8967a] hover:from-purple-600 hover:to-[#d4806a] text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/bulletin-board">
                <Button variant="outline" className="px-8 py-6 text-lg rounded-full border-2 border-[#e8967a] text-[#c0705a] hover:bg-[#fdf0ec]">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-300 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#f4a991] rounded-full blur-3xl opacity-30"></div>
      </div>

      {/* Quick Links Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-[#d4806a] to-purple-600 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-6 text-white">
            <Link to="/bulletin-board" className="flex items-center gap-2 hover:underline">
              <Lightbulb className="w-5 h-5" />
              <span className="font-medium">Our Vision & Mission</span>
            </Link>
            <Link to="/updates" className="flex items-center gap-2 hover:underline">
              <Award className="w-5 h-5" />
              <span className="font-medium">Latest Updates</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Founder and Co-Founder Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Meet Our Expert Medical Team
          </h2>
          <p className="text-lg text-gray-700">
            Led by passionate women physicians dedicated to women's mental health
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Founder - Dr. Sanjana */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white">
              <img
                src={founderImage}
                alt="Dr. Sanjana Sao - Founder"
                className="w-full h-[500px] object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-2xl font-bold text-purple-900">Dr. Sanjana Sao</h3>
                      <p className="text-purple-700 font-semibold text-lg">MD Physician</p>
                      <p className="text-purple-600 text-sm italic">Fellowship in Obs and Gynae</p>
                      <p className="text-pink-600 font-medium mt-1">Founder & Medical Director</p>
                    </div>
                    <Heart className="w-8 h-8 text-[#e8967a]" fill="currentColor" />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    A passionate advocate for women's mental health, dedicated to empowering women 
                    through compassionate, evidence-based care at every life stage.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Co-Founder - Dr. Nishchita */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white">
              <div className="w-full h-[500px] overflow-hidden bg-gray-50 flex justify-center items-start">
                <img
                  src={cofounderImage}
                  alt="Dr. Nishchita - Co-Founder"
                  className="h-full object-contain scale-[0.65] origin-top"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-2xl font-bold text-purple-900">Dr. Nishchita</h3>
                      <p className="text-purple-700 font-semibold text-lg">MD Psychiatry</p>
                      <p className="text-pink-600 font-medium">Co-Founder & Mental Health Expert</p>
                    </div>
                    <Sparkles className="w-8 h-8 text-purple-500" />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Expert psychiatrist specializing in women's mental health, bringing deep clinical 
                    expertise and empathy to support women through their unique mental health journeys.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Team Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="rounded-3xl overflow-hidden shadow-2xl max-w-5xl mx-auto bg-white grid md:grid-cols-2 items-center">
            {/* Left side - Details */}
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-[#e8967a] rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-purple-900 mb-4">
                Together, Building a Healthier Future
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Our dedicated team works tirelessly to provide compassionate, professional mental health 
                care for women across all life stages.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-[#e8967a] flex-shrink-0" />
                  <span>Women-led expert medical team</span>
                </li>
                <li className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  <span>Evidence-based mental health care</span>
                </li>
                <li className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-[#e8967a] flex-shrink-0" />
                  <span>Compassionate support at every stage</span>
                </li>
              </ul>
            </div>
            {/* Right side - Image */}
            <div className="bg-gray-50 flex justify-center items-center p-6 h-full">
              <img
                src={teamImage}
                alt="NurtureHer Team"
                className="max-h-[340px] w-auto object-contain rounded-2xl"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Specialized Care Areas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Specialized Care for Women
          </h2>
          <p className="text-lg text-gray-700">
            Comprehensive mental health support tailored to your unique journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all border border-purple-100"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-[#e8967a] rounded-2xl flex items-center justify-center mb-4">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-purple-900 mb-2">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white/60 backdrop-blur-sm py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-purple-900">
              Your Journey to Wellness
            </h2>
            <p className="text-lg text-gray-700">
              A simple, supportive process designed for your comfort
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Sign Up', description: 'Create your secure account' },
              { step: '2', title: 'Select Category', description: 'Choose your care area' },
              { step: '3', title: 'Assessment', description: 'Complete mental health evaluation' },
              { step: '4', title: 'Get Care', description: 'Receive personalized support' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-[#e8967a] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-600 via-[#d4806a] to-purple-600 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">
              Begin Your Wellness Journey Today
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Professional mental health support designed for women, by women
            </p>
            <Link to="/auth">
              <Button className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg rounded-full shadow-lg font-semibold">
                Join NurtureHer
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        </motion.div>
      </div>
    </div>
  );
}
