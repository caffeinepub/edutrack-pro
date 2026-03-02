import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  GraduationCap,
  User,
  Shield,
  BookOpen,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const isTeacher = user?.role === 'teacher';

  const profileDetails = isTeacher
    ? [
        { icon: Mail, label: 'Email', value: 'rajesh.kumar@school.edu.in' },
        { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
        { icon: MapPin, label: 'School', value: 'Delhi Public School, Sector 12' },
        { icon: Calendar, label: 'Joined', value: 'August 2019' },
        { icon: BookOpen, label: 'Subject', value: 'Mathematics & Science' },
        { icon: GraduationCap, label: 'Qualification', value: 'M.Sc., B.Ed.' },
      ]
    : [
        { icon: Mail, label: 'Email', value: 'sunita.verma@school.edu.in' },
        { icon: Phone, label: 'Phone', value: '+91 87654 32109' },
        { icon: MapPin, label: 'School', value: 'Delhi Public School, Sector 12' },
        { icon: Calendar, label: 'Joined', value: 'June 2010' },
        { icon: Shield, label: 'Role', value: 'Principal / Administrator' },
        { icon: GraduationCap, label: 'Qualification', value: 'Ph.D. in Education' },
      ];

  const permissions = isTeacher
    ? [
        { label: 'Add / Edit Students', granted: true },
        { label: 'Delete Students', granted: true },
        { label: 'Mark Attendance', granted: true },
        { label: 'Enter Test Marks', granted: true },
        { label: 'Enter Exam Marks', granted: true },
        { label: 'View Analytics', granted: true },
      ]
    : [
        { label: 'Add / Edit Students', granted: false },
        { label: 'Delete Students', granted: false },
        { label: 'Mark Attendance', granted: false },
        { label: 'Enter Test Marks', granted: false },
        { label: 'Enter Exam Marks', granted: false },
        { label: 'View Analytics', granted: true },
      ];

  return (
    <div className="space-y-5 animate-fade-in max-w-3xl">
      {/* Profile header card */}
      <Card className="border-navy-100 dark:border-navy-700 shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-navy-900 to-edu-accent" />
        <CardContent className="pt-0 pb-6 px-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-navy-700 border-4 border-white dark:border-navy-700 shadow-lg flex items-center justify-center flex-shrink-0">
              <span className="text-edu-accent font-black text-3xl">
                {user?.displayName?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 pb-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="text-navy-900 dark:text-white font-bold text-xl">
                  {user?.displayName}
                </h2>
                <Badge
                  variant="outline"
                  className={`self-start text-xs font-semibold capitalize px-2.5 py-0.5 ${
                    isTeacher
                      ? 'border-edu-accent/30 text-edu-accent bg-edu-accent/10'
                      : 'border-purple-300 text-purple-700 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700'
                  }`}
                >
                  {isTeacher ? '👨‍🏫 Teacher' : '👑 Principal'}
                </Badge>
              </div>
              <p className="text-navy-500 dark:text-navy-400 text-sm mt-0.5">{user?.classSection}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 gap-1.5 self-start sm:self-auto"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Profile details */}
        <Card className="border-navy-100 dark:border-navy-700 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-navy-800 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-edu-accent" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profileDetails.map((detail, idx) => {
              const Icon = detail.icon;
              return (
                <div key={idx}>
                  <div className="flex items-center gap-3 py-1">
                    <div className="w-8 h-8 rounded-lg bg-navy-50 dark:bg-navy-700 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-navy-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-navy-400 dark:text-navy-500 text-xs">{detail.label}</p>
                      <p className="text-navy-800 dark:text-white text-sm font-medium truncate">
                        {detail.value}
                      </p>
                    </div>
                  </div>
                  {idx < profileDetails.length - 1 && (
                    <Separator className="mt-2 bg-navy-50 dark:bg-navy-700" />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card className="border-navy-100 dark:border-navy-700 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-navy-800 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-edu-accent" />
              Access Permissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {permissions.map((perm, idx) => (
              <div key={idx} className="flex items-center justify-between py-1">
                <span className="text-navy-700 dark:text-navy-200 text-sm">{perm.label}</span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    perm.granted
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {perm.granted ? '✓ Allowed' : '✗ Restricted'}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Demo credentials reminder */}
      <Card className="border-navy-100 dark:border-navy-700 shadow-sm bg-navy-50/50 dark:bg-navy-800/50">
        <CardContent className="py-4 px-5">
          <p className="text-navy-600 dark:text-navy-300 text-xs font-semibold uppercase tracking-wide mb-2">
            Demo Account Credentials
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-navy-700 rounded-lg p-3 border border-navy-100 dark:border-navy-600">
              <p className="text-xs font-semibold text-edu-accent mb-1">Teacher Account</p>
              <p className="text-xs text-navy-500 dark:text-navy-400">Username: teacher</p>
              <p className="text-xs text-navy-500 dark:text-navy-400">Password: class1</p>
            </div>
            <div className="bg-white dark:bg-navy-700 rounded-lg p-3 border border-navy-100 dark:border-navy-600">
              <p className="text-xs font-semibold text-purple-600 mb-1">Principal Account</p>
              <p className="text-xs text-navy-500 dark:text-navy-400">Username: principal</p>
              <p className="text-xs text-navy-500 dark:text-navy-400">Password: admin</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-navy-400 text-xs">
          © {new Date().getFullYear()} EduTrack Pro · Built with{' '}
          <span className="text-red-400">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.hostname : 'edutrack-pro'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-edu-accent hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
