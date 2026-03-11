import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Upload, FileText, Heart, ArrowRight, CheckCircle, X } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { projectId } from '/utils/supabase/info';

export function PrescriptionUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { accessToken, getValidToken } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSkip = () => {
    navigate('/home');
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }

    setLoading(true);
    try {
      const token = await getValidToken();
      if (!token) {
        toast.error('Session expired. Please sign in again.');
        navigate('/auth');
        return;
      }

      // Convert files to base64
      const fileData = await Promise.all(
        files.map(async (file) => {
          const reader = new FileReader();
          return new Promise<{ name: string; type: string; data: string }>((resolve) => {
            reader.onload = (e) => {
              resolve({
                name: file.name,
                type: file.type,
                data: e.target?.result as string,
              });
            };
            reader.readAsDataURL(file);
          });
        })
      );

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8700eb70/prescriptions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            files: fileData,
            notes,
          }),
        }
      );

      if (response.ok) {
        toast.success('Prescriptions uploaded successfully! 🎉');
        navigate('/home');
      } else {
        toast.error('Failed to upload prescriptions');
      }
    } catch (error) {
      console.error('Error uploading prescriptions:', error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

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
              <span className="text-sm font-medium text-purple-900">Optional - Upload Medical Documents</span>
            </div>
            <h1 className="text-4xl font-bold text-purple-900 mb-2">
              Upload Prescriptions
            </h1>
            <p className="text-lg text-gray-700">
              Share any existing prescriptions or medical reports (Optional)
            </p>
          </div>

          {/* Upload Card */}
          <Card className="p-8 mb-6 bg-white/80 backdrop-blur-sm">
            <div className="mb-6">
              <Label className="text-lg font-semibold text-purple-900 mb-3 block">
                Medical Documents
              </Label>
              
              {/* Upload Area */}
              <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-purple-900 mb-2">
                    Click to upload files
                  </p>
                  <p className="text-sm text-gray-600">
                    Supported formats: Images (JPG, PNG) and PDF
                  </p>
                </label>
              </div>
            </div>

            {/* Files List */}
            {files.length > 0 && (
              <div className="mb-6">
                <Label className="text-lg font-semibold text-purple-900 mb-3 block">
                  Uploaded Files ({files.length})
                </Label>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg"
                    >
                      <FileText className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <span className="flex-1 text-gray-700 truncate">{file.name}</span>
                      <span className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Notes */}
            <div>
              <Label className="text-lg font-semibold text-purple-900 mb-3 block">
                Additional Notes (Optional)
              </Label>
              <Textarea
                placeholder="Any additional information about your medications or treatment history..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-32 border-gray-200"
              />
            </div>
          </Card>

          {/* Info Card */}
          <Card className="p-6 mb-6 bg-blue-50/60 backdrop-blur-sm border-2 border-blue-200">
            <div className="flex gap-3">
              <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  What happens next?
                </h3>
                <ul className="space-y-1 text-blue-800 text-sm">
                  <li>• Our medical team will review your assessment</li>
                  <li>• Your prescriptions will be evaluated by qualified doctors</li>
                  <li>• If severe depression is detected, you'll be referred to a psychiatrist</li>
                  <li>• For other medical concerns, our general practitioners will assist</li>
                  <li>• You'll receive personalized care recommendations</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleSkip}
              variant="outline"
              className="flex-1 h-14 text-lg rounded-xl border-2 border-purple-300 hover:bg-purple-50"
            >
              Skip for Now
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || files.length === 0}
              className="flex-1 h-14 text-lg bg-gradient-to-r from-purple-500 to-[#e8967a] hover:from-purple-600 hover:to-[#d4806a] text-white rounded-xl disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Submit & Continue'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            All uploads are secure and HIPAA compliant
          </p>
        </motion.div>
      </div>
    </div>
  );
}