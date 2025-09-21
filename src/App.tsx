import React, { useState } from 'react';
import Layout from './components/Layout';
import WelcomeScreen from './components/WelcomeScreen';
import AdminPanel from './components/AdminPanel';
import StudentDashboard from './components/StudentDashboard';
import VerificationPage from './components/VerificationPage';
import { UserRole } from './types';

function App() {
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);

  const renderContent = () => {
    if (!currentRole) {
      return <WelcomeScreen />;
    }

    switch (currentRole.type) {
      case 'admin':
        return <AdminPanel />;
      case 'student':
        return <StudentDashboard />;
      case 'verifier':
        return <VerificationPage />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <Layout currentRole={currentRole} onRoleChange={setCurrentRole}>
      {renderContent()}
    </Layout>
  );
}

export default App;