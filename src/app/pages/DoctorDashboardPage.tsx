import { useState, useEffect } from 'react';
import { Heart, User, AlertCircle, CheckCircle, Clock, FileText, Eye } from 'lucide-react';
import { Link } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { projectId } from '/utils/supabase/info';

interface Assessment {
  id: string;
  userId: string;
  category: string;
  answers: Record<number, string>;
  additionalNotes: string;
  depressionLevel: string;
  timestamp: string;
  reviewStatus: string;
  reviewNotes?: string;
  reviewedBy?: string;
}

export function DoctorDashboardPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const { getValidToken } = useAuth();

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const token = await getValidToken();
      if (!token) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8700eb70/assessments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAssessments(data.assessments || []);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
      toast.error('Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (assessmentId: string, status: string, notes: string) => {
    try {
      const token = await getValidToken();
      if (!token) {
        toast.error('Session expired');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8700eb70/assessment/${assessmentId}/review`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status, notes }),
        }
      );

      if (response.ok) {
        toast.success('Review updated successfully! ✅');
        fetchAssessments();
        setSelectedAssessment(null);
      } else {
        toast.error('Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('An error occurred');
    }
  };

  const filteredAssessments = assessments.filter(
    (a) => a.reviewStatus === activeTab
  );

  const getDepressionBadge = (level: string) => {
    const colors = {
      mild: 'bg-green-100 text-green-700',
      moderate: 'bg-yellow-100 text-yellow-700',
      severe: 'bg-red-100 text-red-700',
    };
    return colors[level as keyof typeof colors] || colors.mild;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-[#fdf0ec] to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link to="/home" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-[#e8967a] rounded-full flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              NurtureHer
            </span>
          </Link>
          <h1 className="text-4xl font-bold text-purple-900 mb-2">
            Doctor Dashboard
          </h1>
          <p className="text-lg text-gray-700">
            Review and manage patient assessments
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {assessments.filter((a) => a.reviewStatus === 'pending').length}
                </p>
                <p className="text-sm text-gray-600">Pending Review</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {assessments.filter((a) => a.depressionLevel === 'severe').length}
                </p>
                <p className="text-sm text-gray-600">Severe Cases</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {assessments.filter((a) => a.reviewStatus === 'reviewed').length}
                </p>
                <p className="text-sm text-gray-600">Reviewed</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm mb-6">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
            <TabsTrigger value="urgent">Urgent</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {loading ? (
              <Card className="p-12 text-center bg-white/80 backdrop-blur-sm">
                <p className="text-gray-600">Loading assessments...</p>
              </Card>
            ) : filteredAssessments.length === 0 ? (
              <Card className="p-12 text-center bg-white/80 backdrop-blur-sm">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No assessments found</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredAssessments.map((assessment) => (
                  <Card
                    key={assessment.id}
                    className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 capitalize">
                            {assessment.category.replace('-', ' ')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(assessment.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={getDepressionBadge(assessment.depressionLevel)}>
                        {assessment.depressionLevel}
                      </Badge>
                    </div>

                    {assessment.additionalNotes && (
                      <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                        {assessment.additionalNotes}
                      </p>
                    )}

                    <Button
                      onClick={() => setSelectedAssessment(assessment)}
                      variant="outline"
                      className="w-full"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Review Assessment
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Assessment Detail Modal */}
        {selectedAssessment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-purple-900">
                  Assessment Details
                </h2>
                <button
                  onClick={() => setSelectedAssessment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Badge className={getDepressionBadge(selectedAssessment.depressionLevel)}>
                    {selectedAssessment.depressionLevel} Depression
                  </Badge>
                  <span className="text-sm text-gray-600 capitalize">
                    Category: {selectedAssessment.category.replace('-', ' ')}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Responses:</h3>
                  <div className="space-y-2">
                    {selectedAssessment.answers && Object.entries(selectedAssessment.answers).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Question {parseInt(key) + 1}</p>
                        <p className="text-gray-900">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedAssessment.additionalNotes && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Additional Notes:</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {selectedAssessment.additionalNotes}
                    </p>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={() => updateReviewStatus(selectedAssessment.id, 'reviewed', 'Reviewed and approved for treatment')}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  {selectedAssessment.depressionLevel === 'severe' && (
                    <Button
                      onClick={() => updateReviewStatus(selectedAssessment.id, 'urgent', 'Referred to psychiatrist')}
                      className="flex-1 bg-red-500 hover:bg-red-600"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Refer to Psychiatrist
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}