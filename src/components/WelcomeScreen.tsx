import React from 'react';
import { Shield, GraduationCap, CheckCircle, ArrowRight, Lock, Globe, FileText } from 'lucide-react';

const WelcomeScreen: React.FC = () => {
  return (
    <div className="text-center space-y-12">
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-blue-100 rounded-full">
            <Shield className="w-16 h-16 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Welcome to <span className="text-blue-600">CertiChain</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A revolutionary blockchain-based system for issuing, managing, and verifying academic certificates. 
          Eliminate fraud, ensure authenticity, and provide instant verification.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6 mx-auto">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Admin Panel</h3>
          <p className="text-gray-600 mb-6">
            Issue and manage academic certificates with blockchain security. Upload documents to IPFS and create immutable records.
          </p>
          <ul className="space-y-3 text-left">
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">Upload certificate files</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">Store on blockchain</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">Generate unique hashes</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 mx-auto">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Student Portal</h3>
          <p className="text-gray-600 mb-6">
            Access your certified academic credentials and share secure verification links with employers or other institutions.
          </p>
          <ul className="space-y-3 text-left">
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">View all certificates</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">Share verification links</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">Download certificates</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
          <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Verification</h3>
          <p className="text-gray-600 mb-6">
            Instantly verify the authenticity of any academic certificate using blockchain technology. No need to contact institutions.
          </p>
          <ul className="space-y-3 text-left">
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Instant verification</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Tamper-proof records</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Global accessibility</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="flex items-center space-x-4">
            <Lock className="w-12 h-12 text-white" />
            <div>
              <h4 className="font-bold text-lg">Secure</h4>
              <p className="text-blue-100">Blockchain technology ensures immutable records</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Globe className="w-12 h-12 text-white" />
            <div>
              <h4 className="font-bold text-lg">Global</h4>
              <p className="text-blue-100">Accessible worldwide, 24/7 verification</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <FileText className="w-12 h-12 text-white" />
            <div>
              <h4 className="font-bold text-lg">Transparent</h4>
              <p className="text-blue-100">Open ledger for complete transparency</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <span>Select a role above to get started</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;