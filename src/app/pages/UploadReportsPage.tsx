import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Upload, X, FileText, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export function UploadReportsPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
      toast.success(`${newFiles.length} file(s) added`);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    toast.info('File removed');
  };

  const handleSubmit = () => {
    if (files.length > 0) {
      console.log('📎 Files uploaded:', files.map(f => f.name));
      console.log('📝 Notes:', notes);
      toast.success(`${files.length} file(s) uploaded successfully!`);
    }
    
    // Navigate to prescriptions list
    setTimeout(() => {
      navigate('/prescriptions-list');
    }, 1000);
  };

  const handleSkip = () => {
    toast.info('Skipping file upload');
    navigate('/prescriptions-list');
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
              <span className="text-sm font-medium text-purple-900">Optional Step - Upload Reports</span>
            </div>
            <h1 className="text-4xl font-bold text-purple-900 mb-2">
              Upload Medical Reports
            </h1>
            <p className="text-lg text-gray-700">
              Share any existing prescriptions or medical documents (optional)
            </p>
          </div>

          {/* Upload Card */}
          <Card className="p-8 mb-6 bg-white/80 backdrop-blur-sm">
            {/* File Upload Area */}
            <div className="mb-8">
              <Label className="text-lg font-semibold text-purple-900 mb-4 block">
                Upload Files
              </Label>
              
              <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center bg-purple-50/50 hover:bg-purple-50 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <p className="text-lg font-medium text-purple-900 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-600">
                    PDF, JPG, PNG, DOC (Max 10MB each)
                  </p>
                </label>
              </div>
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
              <div className="mb-8">
                <Label className="text-lg font-semibold text-purple-900 mb-4 block">
                  Uploaded Files ({files.length})
                </Label>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
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
                placeholder="Add any notes about these reports or your medical history..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-32 border-gray-200"
              />
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleSkip}
              variant="outline"
              className="flex-1 h-14 text-lg rounded-xl"
            >
              Skip this Step
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 h-14 text-lg bg-gradient-to-r from-purple-500 to-[#e8967a] hover:from-purple-600 hover:to-[#d4806a] text-white rounded-xl"
            >
              {files.length > 0 ? 'Upload & Continue' : 'Continue'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Info Cards */}
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Card className="p-4 bg-white/60 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Secure Upload</p>
                  <p className="text-sm text-gray-600">
                    All files are encrypted and stored securely
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-white/60 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Doctor Review</p>
                  <p className="text-sm text-gray-600">
                    Our medical team will review your reports
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            You can always upload reports later from your dashboard
          </p>
        </motion.div>
      </div>
    </div>
  );
}