import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

type Page = 'dashboard' | 'students' | 'attendance' | 'weekly-test' | 'midterm' | 'profile';

interface LayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
}

export default function Layout({ currentPage, onNavigate, children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-navy-50 dark:bg-navy-900">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header currentPage={currentPage} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
