import React from 'react';
import { LogOut, Bell, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Page = 'dashboard' | 'students' | 'attendance' | 'weekly-test' | 'midterm' | 'profile';

const PAGE_TITLES: Record<Page, string> = {
  dashboard: 'Dashboard',
  students: 'Student Management',
  attendance: 'Attendance Tracker',
  'weekly-test': 'Weekly Test Marks',
  midterm: 'Midterm Examination',
  profile: 'Profile',
};

interface HeaderProps {
  currentPage: Page;
}

export default function Header({ currentPage }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white dark:bg-navy-800 border-b border-navy-100 dark:border-navy-700 flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-navy-900 dark:text-white font-semibold text-base leading-tight">
            {PAGE_TITLES[currentPage]}
          </h2>
          <p className="text-navy-400 dark:text-navy-400 text-xs">{user?.classSection}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className={`text-xs font-semibold capitalize px-2.5 py-0.5 ${
            user?.role === 'principal'
              ? 'border-purple-300 text-purple-700 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700'
              : 'border-edu-accent/30 text-edu-accent bg-edu-accent/10'
          }`}
        >
          {user?.role === 'principal' ? '👑 Principal' : '👨‍🏫 Teacher'}
        </Badge>

        <div className="flex items-center gap-2 pl-3 border-l border-navy-100 dark:border-navy-700">
          <div className="text-right hidden sm:block">
            <p className="text-navy-800 dark:text-white text-sm font-semibold leading-tight">{user?.displayName}</p>
            <p className="text-navy-400 text-xs">{user?.classSection}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-navy-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 gap-1.5 text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
