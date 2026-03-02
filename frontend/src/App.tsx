import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { seedDemoData } from './utils/storage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import AttendancePage from './pages/AttendancePage';
import WeeklyTestPage from './pages/WeeklyTestPage';
import MidtermExamPage from './pages/MidtermExamPage';
import ProfilePage from './pages/ProfilePage';
import Layout from './components/layout/Layout';

type Page = 'dashboard' | 'students' | 'attendance' | 'weekly-test' | 'midterm' | 'profile';

// Seed demo data on first load
seedDemoData();

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setCurrentPage('dashboard')} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'students':
        return <StudentsPage />;
      case 'attendance':
        return <AttendancePage />;
      case 'weekly-test':
        return <WeeklyTestPage />;
      case 'midterm':
        return <MidtermExamPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
