import React, { useState, useEffect } from 'react';
import { Shield, GraduationCap, CheckCircle, Menu, X } from 'lucide-react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentRole: UserRole | null;
  onRoleChange: (role: UserRole | null) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentRole, onRoleChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const roles: UserRole[] = [
    { type: 'admin', address: '0x1234567890123456789012345678901234567890', name: 'University Admin' },
    { type: 'student', address: '0x2345678901234567890123456789012345678901', name: 'Student Portal' },
    { type: 'verifier', address: '0x3456789012345678901234567890123456789012', name: 'Certificate Verifier' }
  ];

  const getRoleIcon = (type: string) => {
    switch (type) {
      case 'admin': return <Shield className="w-5 h-5" />;
      case 'student': return <GraduationCap className="w-5 h-5" />;
      case 'verifier': return <CheckCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  const getRoleColor = (type: string) => {
    switch (type) {
      case 'admin': return 'bg-red-500 hover:bg-red-600';
      case 'student': return 'bg-blue-500 hover:bg-blue-600';
      case 'verifier': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">CertiChain</h1>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Blockchain Verified
              </span>
            </div>

            {/* Desktop Role Selector */}
            <div className="hidden md:flex items-center space-x-2">
              {roles.map((role) => (
                <button
                  key={role.type}
                  onClick={() => onRoleChange(currentRole?.type === role.type ? null : role)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 ${
                    currentRole?.type === role.type
                      ? `${getRoleColor(role.type)} ring-2 ring-offset-2 ring-opacity-50`
                      : `${getRoleColor(role.type)} opacity-70 hover:opacity-100`
                  }`}
                >
                  {getRoleIcon(role.type)}
                  <span className="capitalize">{role.type}</span>
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Role Selector */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-2">
                {roles.map((role) => (
                  <button
                    key={role.type}
                    onClick={() => {
                      onRoleChange(currentRole?.type === role.type ? null : role);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 ${
                      currentRole?.type === role.type
                        ? `${getRoleColor(role.type)} ring-2 ring-offset-2 ring-opacity-50`
                        : `${getRoleColor(role.type)} opacity-70 hover:opacity-100`
                    }`}
                  >
                    {getRoleIcon(role.type)}
                    <span className="capitalize">{role.type}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;