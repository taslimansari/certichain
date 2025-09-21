import React, { useState } from 'react';
import { Upload, FileText, Hash, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { CertificateForm } from '../types';
import { ipfsService } from '../services/ipfs';
import { blockchainService } from '../services/blockchain';

const AdminPanel: React.FC = () => {
  const [form, setForm] = useState<CertificateForm>({
    studentId: '',
    studentName: '',
    course: '',
    grade: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; hash?: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
        setResult(null);
      } else {
        setResult({
          success: false,
          message: 'Please select a PDF file or image'
        });
      }
    }
  };

  const generateCertificateHash = (studentId: string, course: string, timestamp: number): string => {
    return `cert_${studentId}_${course.replace(/\s+/g, '_')}_${timestamp}`.toLowerCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setResult({
        success: false,
        message: 'Please select a certificate file to upload'
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      // Upload file to IPFS
      const ipfsHash = await ipfsService.uploadFile(file);
      
      // Generate unique certificate hash
      const certificateHash = generateCertificateHash(form.studentId, form.course, Date.now());
      
      // Store on blockchain
      await blockchainService.issueCertificate(
        certificateHash,
        form.studentId,
        form.studentName,
        form.course,
        form.grade,
        ipfsHash
      );

      setResult({
        success: true,
        message: 'Certificate issued successfully!',
        hash: certificateHash
      });

      // Reset form
      setForm({
        studentId: '',
        studentName: '',
        course: '',
        grade: '',
      });
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('certificate-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to issue certificate'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Admin Panel</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Issue new academic certificates with blockchain security. Upload certificate files, enter student details, 
          and create immutable records on the blockchain.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <FileText className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-bold text-gray-900">Issue New Certificate</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID *
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={form.studentId}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., ST2024001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name *
                </label>
                <input
                  type="text"
                  id="studentName"
                  name="studentName"
                  value={form.studentName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                Course *
              </label>
              <input
                type="text"
                id="course"
                name="course"
                value={form.course}
                onChange={handleInputChange}
                required
                placeholder="e.g., Computer Science"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                Grade *
              </label>
              <select
                id="grade"
                name="grade"
                value={form.grade}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select Grade</option>
                <option value="A+">A+ (90-100)</option>
                <option value="A">A (85-89)</option>
                <option value="A-">A- (80-84)</option>
                <option value="B+">B+ (77-79)</option>
                <option value="B">B (73-76)</option>
                <option value="B-">B- (70-72)</option>
                <option value="C+">C+ (67-69)</option>
                <option value="C">C (63-66)</option>
                <option value="C-">C- (60-62)</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
              </select>
            </div>

            <div>
              <label htmlFor="certificate-file" className="block text-sm font-medium text-gray-700 mb-2">
                Certificate File *
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="certificate-file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  required
                  className="hidden"
                />
                <label
                  htmlFor="certificate-file"
                  className="w-full flex items-center justify-center px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-400 hover:bg-red-50 transition-all duration-200"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {file ? file.name : 'Click to upload certificate (PDF or Image)'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Max file size: 10MB</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Issuing Certificate...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Issue Certificate</span>
                </>
              )}
            </button>
          </form>

          {result && (
            <div className={`mt-6 p-4 rounded-lg border ${
              result.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start space-x-3">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className={`font-medium ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.message}
                  </p>
                  {result.success && result.hash && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Hash className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Certificate Hash:</span>
                      </div>
                      <code className="text-xs bg-green-100 text-green-700 p-2 rounded block break-all">
                        {result.hash}
                      </code>
                      <p className="text-xs text-green-600 mt-2">
                        Share this hash with the student for verification purposes.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;