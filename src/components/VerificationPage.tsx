import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Hash, Calendar, User, BookOpen, Award, Building, Search, ExternalLink } from 'lucide-react';
import { Certificate } from '../types';
import { blockchainService } from '../services/blockchain';
import { ipfsService } from '../services/ipfs';

const VerificationPage: React.FC = () => {
  const [certificateHash, setCertificateHash] = useState('');
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'verified' | 'invalid' | null>(null);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateHash.trim()) return;

    setIsLoading(true);
    setVerificationResult(null);
    setCertificate(null);

    try {
      const result = await blockchainService.verifyCertificate(certificateHash.trim());
      
      if (result.exists) {
        setCertificate({ ...result, hash: certificateHash.trim() });
        setVerificationResult('verified');
      } else {
        setVerificationResult('invalid');
      }
    } catch (error) {
      setVerificationResult('invalid');
    } finally {
      setIsLoading(false);
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
      'A+': 'bg-green-100 text-green-800 border-green-200',
      'A': 'bg-green-100 text-green-800 border-green-200',
      'A-': 'bg-green-100 text-green-800 border-green-200',
      'B+': 'bg-blue-100 text-blue-800 border-blue-200',
      'B': 'bg-blue-100 text-blue-800 border-blue-200',
      'B-': 'bg-blue-100 text-blue-800 border-blue-200',
      'C+': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'C': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'C-': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Pass': 'bg-purple-100 text-purple-800 border-purple-200',
      'Fail': 'bg-red-100 text-red-800 border-red-200'
    };
    return gradeColors[grade] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Pre-populate for demo
  useEffect(() => {
    setCertificateHash('cert123');
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Certificate Verification</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Enter a certificate hash to instantly verify its authenticity using blockchain technology. 
          No need to contact the issuing institution.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Verification Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Hash className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-gray-900">Verify Certificate</h3>
          </div>

          <form onSubmit={handleVerification} className="space-y-4">
            <div>
              <label htmlFor="certificateHash" className="block text-sm font-medium text-gray-700 mb-2">
                Certificate Hash
              </label>
              <input
                type="text"
                id="certificateHash"
                value={certificateHash}
                onChange={(e) => setCertificateHash(e.target.value)}
                placeholder="Enter certificate hash (e.g., cert_st2024001_computer_science_1234567890)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get this hash from the student or certificate issuer
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !certificateHash.trim()}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="w-5 h-5" />
              <span>{isLoading ? 'Verifying...' : 'Verify Certificate'}</span>
            </button>
          </form>
        </div>

        {/* Verification Results */}
        {verificationResult === 'verified' && certificate && (
          <div className="bg-white rounded-2xl shadow-lg border border-green-200 overflow-hidden">
            {/* Success Header */}
            <div className="bg-green-50 p-6 border-b border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-900">Certificate Verified ✅</h3>
                  <p className="text-green-700">This certificate is authentic and valid</p>
                </div>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Student Name</p>
                      <p className="font-bold text-gray-900 text-lg">{certificate.studentName}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Hash className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Student ID</p>
                      <p className="font-mono text-gray-900">{certificate.studentId}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <BookOpen className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Course</p>
                      <p className="font-medium text-gray-900">{certificate.course}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Grade Achieved</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getGradeColor(certificate.grade)}`}>
                        {certificate.grade}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Issue Date</p>
                      <p className="font-medium text-gray-900">{formatDate(certificate.timestamp)}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Building className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Issued By</p>
                      <p className="font-mono text-xs text-gray-700">
                        {certificate.issuer.substring(0, 10)}...{certificate.issuer.substring(38)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blockchain Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-3">Blockchain Details</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Certificate Hash</p>
                    <code className="bg-white p-2 rounded border block mt-1 break-all text-xs">
                      {certificate.hash}
                    </code>
                  </div>
                  <div>
                    <p className="text-gray-600">IPFS Hash</p>
                    <code className="bg-white p-2 rounded border block mt-1 break-all text-xs">
                      {certificate.ipfsHash}
                    </code>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <a
                  href={ipfsService.getFileUrl(certificate.ipfsHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Original Certificate</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {verificationResult === 'invalid' && (
          <div className="bg-white rounded-2xl shadow-lg border border-red-200 overflow-hidden">
            <div className="bg-red-50 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-900">Certificate Not Found ❌</h3>
                  <p className="text-red-700">This certificate hash is not valid or does not exist on the blockchain</p>
                </div>
              </div>
              <div className="mt-4 bg-red-100 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">Possible reasons:</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• The certificate hash is incorrect or mistyped</li>
                  <li>• The certificate was not issued through this system</li>
                  <li>• The certificate may be fraudulent</li>
                  <li>• The issuing institution has not registered this certificate</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">How Blockchain Verification Works</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Hash className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">1. Hash Lookup</h4>
              <p className="text-sm text-gray-600">System searches the blockchain for the certificate hash</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">2. Data Retrieval</h4>
              <p className="text-sm text-gray-600">If found, retrieves immutable certificate data</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">3. Instant Verification</h4>
              <p className="text-sm text-gray-600">Displays authentic certificate details instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;