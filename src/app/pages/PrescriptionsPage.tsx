import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Download, Calendar, User, Heart, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface Prescription {
  id: string;
  doctorName: string;
  date: string;
  category: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  instructions: string;
  status: 'pending' | 'active' | 'completed';
}

export function PrescriptionsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Ensure user is loaded
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-[#fdf0ec] to-blue-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  // Prescriptions will be loaded from the database when backend is ready
  const [prescriptions] = useState<Prescription[]>([]);

  const [awaitingPrescription] = useState(true);

  const handleDownload = (prescriptionId: string) => {
    toast.success('Prescription downloaded successfully!');
    console.log('Downloading prescription:', prescriptionId);
  };

  const handleContinueToDashboard = () => {
    toast.success('🎉 Assessment process completed!');
    setTimeout(() => {
      navigate('/home');
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-[#fdf0ec] to-blue-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Heart className="w-4 h-4 text-[#e8967a]" fill="currentColor" />
              <span className="text-sm font-medium text-purple-900">Your Prescriptions & Care Plan</span>
            </div>
            <h1 className="text-4xl font-bold text-purple-900 mb-2">
              Prescriptions & Medications
            </h1>
            <p className="text-lg text-gray-700">
              View and manage your prescribed treatments
            </p>
          </div>

          {/* Awaiting Prescription Card */}
          {awaitingPrescription && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-8 mb-6 bg-gradient-to-r from-purple-500 to-[#e8967a] text-white">
                <div className="flex items-start gap-4">
                  <Clock className="w-12 h-12 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">Prescription Under Review</h2>
                    <p className="text-purple-100 mb-4 text-lg">
                      Our medical team is reviewing your assessment and will provide a personalized prescription within 24-48 hours.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-medium">Assessment Completed</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">Under Doctor Review</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Previous Prescriptions */}
          {prescriptions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Previous Prescriptions
              </h2>
              
              <div className="space-y-4">
                {prescriptions.map((prescription, index) => (
                  <motion.div
                    key={prescription.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                      {/* Prescription Header */}
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-purple-900">
                              {prescription.category}
                            </h3>
                            <Badge className={`${getStatusColor(prescription.status)} border`}>
                              {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{prescription.doctorName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(prescription.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDownload(prescription.id)}
                          variant="outline"
                          className="border-purple-300 text-purple-700 hover:bg-purple-50"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>

                      {/* Medications List */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Medications:</h4>
                        <div className="space-y-3">
                          {prescription.medications.map((med, medIndex) => (
                            <div
                              key={medIndex}
                              className="p-4 bg-purple-50 rounded-lg border border-purple-100"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                <p className="font-bold text-purple-900">{med.name}</p>
                                <Badge className="bg-purple-200 text-purple-800">
                                  {med.dosage}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                                <span>📅 {med.frequency}</span>
                                <span>⏱️ {med.duration}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-blue-900 mb-1">Instructions:</p>
                            <p className="text-sm text-blue-800">{prescription.instructions}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Info Cards */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card className="p-4 bg-white/60 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Expert Review</p>
                  <p className="text-sm text-gray-600">
                    All prescriptions reviewed by licensed doctors
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-white/60 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">24/7 Support</p>
                  <p className="text-sm text-gray-600">
                    Contact us anytime for medication queries
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-white/60 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Secure & Private</p>
                  <p className="text-sm text-gray-600">
                    Your health data is fully encrypted
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Continue to Dashboard Button */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm text-center">
            <h3 className="text-xl font-bold text-purple-900 mb-2">
              Ready to Start Your Journey?
            </h3>
            <p className="text-gray-700 mb-6">
              Continue to your dashboard to track progress, mood, journal entries, and connect with the community
            </p>
            <Button
              onClick={handleContinueToDashboard}
              className="h-14 text-lg bg-gradient-to-r from-purple-500 to-[#e8967a] hover:from-purple-600 hover:to-[#d4806a] text-white rounded-xl px-8"
            >
              Continue to Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}