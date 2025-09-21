import React, { useState, useEffect } from 'react';
import { GraduationCap, FileText, Share2, Download, Copy, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Certificate } from '../types';
import { blockchainService } from '../services/blockchain';
import { ipfsService } from '../services/ipfs';

const StudentDashboard: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const certificateHashes = await blockchainService.getStudentCertificates(studentId);
      
      if (certificateHashes.length === 0) {
        setError('No certificates found for this student ID');
        setCertificates([]);
        return;
      }

      const certificateDetails = await Promise.all(
        certificateHashes.map(async (hash) => {
          const cert = await blockchainService.verifyCertificate(hash);
          return { ...cert, hash };
        })
      );

      setCertificates(certificateDetails.filter(cert => cert.exists));
    } catch (err) {
      setError('Failed to fetch certificates');
      setCertificates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHash(text);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (err) {
      console.error('Failed to copy text');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGradeColor = (grade: string) => {
    const gradeColors: Record<string, string> = {
      'A+': 'bg-green-100 text-green-800',
      'A': 'bg-green-100 text-green-800',
      'A-': 'bg-green-100 text-green-800',
      'B+': 'bg-blue-100 text-blue-800',
      'B': 'bg-blue-100 text-blue-800',
      'B-': 'bg-blue-100 text-blue-800',
      'C+': 'bg-yellow-100 text-yellow-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'C-': 'bg-yellow-100 text-yellow-800',
      'Pass': 'bg-purple-100 text-purple-800',
      'Fail': 'bg-red-100 text-red-800'
    };
    return gradeColors[grade] || 'bg-gray-100 text-gray-800';
  };

  // Pre-populate for demo
  useEffect(() => {
    setStudentId('ST2024001');
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Student Dashboard</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Access your blockchain-verified academic certificates. View details, share verification links, 
          and download your credentials securely.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Student ID Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8">
          <form onSubmit={handleSearch} className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Student ID
              </label>
              <input
                type="text"
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g., ST2024001"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Certificates Grid */}
        {certificates.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Your Certificates ({certificates.length})
              </h3>
            </div>

            <div className="grid gap-6">
              {certificates.map((cert, index) => (
                <div
                  key={cert.hash}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">{cert.course}</h4>
                          <p className="text-sm text-gray-600">Student: {cert.studentName}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(cert.grade)}`}>
                        Grade: {cert.grade}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-600">Student ID</p>
                        <p className="font-medium text-gray-900">{cert.studentId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Issue Date</p>
                        <p className="font-medium text-gray-900">{formatDate(cert.timestamp)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Issuer</p>
                        <p className="font-medium text-gray-900 font-mono text-xs">
                          {cert.issuer.substring(0, 10)}...{cert.issuer.substring(38)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Verification Status</p>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-green-600 font-medium">Verified</span>
                        </div>
                      </div>
                    </div>

                    {/* Certificate Hash */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-700">Certificate Hash</p>
                        <button
                          onClick={() => copyToClipboard(cert.hash)}
                          className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 transition-colors duration-200"
                        >
                          {copiedHash === cert.hash ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <code className="text-xs bg-white p-2 rounded border block break-all">
                        {cert.hash}
                      </code>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                      <button
                        onClick={() => copyToClipboard(`${window.location.origin}/verify?hash=${cert.hash}`)}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share Verification Link</span>
                      </button>
                      
                      <a
                        href={ipfsService.getFileUrl(cert.ipfsHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View Certificate</span>
                      </a>
                      
                      <button className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && !error && certificates.length === 0 && studentId && (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Certificates Found</h3>
            <p className="text-gray-600">
              No certificates have been issued for this student ID yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;