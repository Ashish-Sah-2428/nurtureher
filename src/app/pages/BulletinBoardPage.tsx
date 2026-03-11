import { Heart, ArrowLeft, Target, Eye, Lightbulb, Users, Award } from 'lucide-react';
import { Link } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';

// Team images - Using actual founder and team photos
import founderImage from 'figma:asset/65e16cc05e7faa2cf213be9969ac1a066e684995.png';
import cofounderImage from 'figma:asset/dc18dae1f1d4dca7b0de304d6fb066a961da5bd6.png';

export function BulletinBoardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-[#fdf0ec] to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-[#e8967a] rounded-full flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              NurtureHer
            </span>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-6 text-center">
              Our Mission & Vision
            </h1>
            <p className="text-xl text-gray-700 text-center mb-12">
              Transforming women's mental healthcare through compassion, expertise, and innovation
            </p>
          </motion.div>

          {/* Founder Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <Heart className="w-8 h-8 text-[#e8967a]" fill="currentColor" />
              <h2 className="text-3xl font-bold text-purple-900">Meet Dr. Sanjana Sao</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p className="text-lg">
                    A passionate advocate for women's mental health, Dr. Sanjana Sao founded NurtureHer 
                    with a vision to transform mental healthcare for women across all life stages.
                  </p>
                  <p>
                    With years of experience as an MD Physician, Dr. Sao recognized the critical gap in 
                    specialized mental health support for women. Her mission is to create a safe, 
                    supportive environment where every woman feels heard, understood, and empowered.
                  </p>
                  <p>
                    "Every woman deserves compassionate, professional mental health support tailored to 
                    her unique journey. NurtureHer is my commitment to making that a reality."
                  </p>
                  <p className="italic text-purple-700 font-medium">
                    - Dr. Sanjana Sao, MD Physician<br/>Founder & Medical Director
                  </p>
                </div>
              </div>
              <div className="order-first md:order-last">
                <img
                  src={founderImage}
                  alt="Dr. Sanjana Sao"
                  className="rounded-2xl shadow-lg w-full h-[400px] object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Co-Founder Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <ArrowLeft className="w-8 h-8 text-purple-500" />
              <h2 className="text-3xl font-bold text-purple-900">Meet Dr. Nishchita</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center items-center bg-gray-50 rounded-2xl overflow-hidden">
                <img
                  src={cofounderImage}
                  alt="Dr. Nishchita"
                  className="w-full h-[400px] object-contain scale-75"
                />
              </div>
              <div>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p className="text-lg">
                    As an expert psychiatrist with MD Psychiatry credentials, Dr. Nishchita brings 
                    specialized mental health expertise to NurtureHer as Co-Founder and Mental Health Expert.
                  </p>
                  <p>
                    Dr. Nishchita's deep understanding of women's mental health challenges, combined with 
                    her clinical expertise in psychiatry, ensures that every patient receives comprehensive, 
                    evidence-based psychiatric care.
                  </p>
                  <p>
                    "Women's mental health deserves specialized attention and expert care. I'm dedicated 
                    to providing the psychiatric expertise that empowers women to thrive."
                  </p>
                  <p className="italic text-purple-700 font-medium">
                    - Dr. Nishchita, MD Psychiatry<br/>Co-Founder & Mental Health Expert
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Vision & Mission */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-8 bg-gradient-to-br from-purple-500 to-purple-600 text-white h-full">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                <p className="text-lg text-purple-100 leading-relaxed">
                  To create a world where every woman has access to comprehensive, compassionate mental 
                  health care throughout all stages of her life - from motherhood to menopause and beyond. 
                  We envision a future where women's mental health is prioritized, understood, and supported 
                  with the same dedication as physical health.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-8 bg-gradient-to-br from-[#e8967a] to-[#d4806a] text-white h-full">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-lg text-[#fce8e0] leading-relaxed">
                  To provide specialized, evidence-based mental health support for women facing unique 
                  challenges including post-maternity mental health, IVF and fertility journey support, 
                  and menopause transitions. We deliver integrated care combining professional psychiatric 
                  evaluation, medical support, and holistic wellness resources.
                </p>
              </Card>
            </motion.div>
          </div>

          {/* Founder's Idea */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <Card className="p-10 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-[#e8967a] rounded-2xl flex items-center justify-center">
                  <Lightbulb className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-purple-900">The Founding Idea</h2>
              </div>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  NurtureHer was born from a simple observation: women face unique mental health challenges 
                  that require specialized care, yet finding accessible, comprehensive support remains difficult.
                </p>
                <p>
                  Dr. Sanjana Sao envisioned a platform that would:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide immediate access to professional mental health assessment</li>
                  <li>Offer specialized support for post-maternity, IVF fertility journey, and menopause-related mental health</li>
                  <li>Connect women with psychiatrists and medical professionals when needed</li>
                  <li>Create a safe, judgment-free space for women to share their experiences</li>
                  <li>Integrate holistic wellness resources with professional medical care</li>
                </ul>
                <p>
                  The result is NurtureHer - a comprehensive mental health platform that meets women wherever 
                  they are in their journey, providing the right level of care at the right time.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Our Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                {
                  title: 'Compassion',
                  description: 'We approach every woman\'s journey with empathy and understanding',
                  icon: Heart,
                },
                {
                  title: 'Excellence',
                  description: 'We provide evidence-based, professional care at every touchpoint',
                  icon: Award,
                },
                {
                  title: 'Community',
                  description: 'We foster a supportive environment where women feel heard and valued',
                  icon: Users,
                },
              ].map((value, index) => (
                <Card key={value.title} className="p-6 bg-white/80 backdrop-blur-sm text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-[#e8967a] rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-900 mb-2">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <Card className="p-12 bg-gradient-to-r from-purple-600 via-[#d4806a] to-purple-600">
              <h2 className="text-3xl font-bold text-white mb-4">
                Join Us in Our Mission
              </h2>
              <p className="text-xl text-purple-100 mb-8">
                Be part of a community that's transforming women's mental health
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg rounded-full font-semibold">
                    Get Started Today
                  </Button>
                </Link>
                <Link to="/updates">
                  <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full font-semibold">
                    View Updates
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}