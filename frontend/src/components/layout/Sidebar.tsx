import React from 'react';
import { LayoutDashboard, Users, CalendarCheck, BookOpen, User, ChevronRight, GraduationCap, Moon, Sun, ClipboardList, Award } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useAuth } from '../../contexts/AuthContext';

type Page = 'dashboard' | 'students' | 'attendance' | 'weekly-test' | 'midterm' | 'profile';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students' as Page, label: 'Students', icon: Users },
  { id: 'attendance' as Page, label: 'Attendance', icon: CalendarCheck },
  { id: 'weekly-test' as Page, label: 'Weekly Test', icon: ClipboardList },
  { id: 'midterm' as Page, label: 'Midterm Exam', icon: Award },
  { id: 'profile' as Page, label: 'Profile', icon: User },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { isDark, toggleDarkMode } = useDarkMode();
  const { user } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-navy-900 dark:bg-navy-950 flex flex-col shadow-xl flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-navy-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-edu-accent flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-tight">EduTrack Pro</h1>
            <p className="text-navy-400 text-xs">Management System</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-navy-700/50">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-navy-800/60">
          <div className="w-8 h-8 rounded-full bg-edu-accent/20 flex items-center justify-center flex-shrink-0">
            <span className="text-edu-accent font-bold text-sm">
              {user?.displayName?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.displayName}</p>
            <p className="text-navy-400 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-navy-500 text-xs font-semibold uppercase tracking-wider px-3 mb-3">Navigation</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-edu-accent text-white shadow-md shadow-edu-accent/30'
                  : 'text-navy-300 hover:bg-navy-800 hover:text-white'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-navy-400 group-hover:text-white'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
            </button>
          );
        })}
      </nav>

      {/* Dark mode toggle */}
      <div className="px-4 py-4 border-t border-navy-700/50">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-navy-300 hover:bg-navy-800 hover:text-white transition-all duration-200 text-sm font-medium"
        >
          {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-navy-400" />}
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </aside>
  );
}
