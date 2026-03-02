import React from 'react';
import { Users, TrendingUp, BookOpen, Award, ArrowRight, BarChart2 } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';
import { useMidtermExam } from '../hooks/useMidtermExam';
import { useStudents } from '../hooks/useStudents';
import KPICard from '../components/dashboard/KPICard';
import AttendanceChart from '../components/dashboard/AttendanceChart';
import ExamPerformanceChart from '../components/dashboard/ExamPerformanceChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';

type Page = 'dashboard' | 'students' | 'attendance' | 'weekly-test' | 'midterm' | 'profile';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { totalStudents, attendancePercentage, weeklyAverage, midtermAverage, attendanceTrend } = useDashboardData();
  const { exams, calculateResults } = useMidtermExam();
  const { students } = useStudents();
  const { user } = useAuth();

  const gradeData = React.useMemo(() => {
    const results = calculateResults(exams);
    const counts: Record<string, number> = { A: 0, B: 0, C: 0, Fail: 0 };
    results.forEach((r) => { counts[r.grade]++; });
    return Object.entries(counts).map(([grade, count]) => ({ grade, count }));
  }, [exams, calculateResults]);

  const quickActions = [
    { label: 'Manage Students', page: 'students' as Page, icon: Users, color: 'bg-edu-accent' },
    { label: 'Mark Attendance', page: 'attendance' as Page, icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Weekly Test', page: 'weekly-test' as Page, icon: BookOpen, color: 'bg-orange-500' },
    { label: 'Midterm Exam', page: 'midterm' as Page, icon: Award, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-navy-900 to-edu-accent p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Welcome back, {user?.displayName?.split(' ')[0]}! 👋</h2>
            <p className="text-white/70 text-sm mt-1">{user?.classSection} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
            <BarChart2 className="w-5 h-5" />
            <span className="text-sm font-medium">Academic Year 2025-26</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard title="Total Students" value={totalStudents} subtitle="Enrolled this year" icon={Users} color="blue" animationDelay={0} />
        <KPICard title="Attendance Rate" value={`${attendancePercentage}%`} subtitle="Overall average" icon={TrendingUp} color="green" animationDelay={100} />
        <KPICard title="Weekly Avg Marks" value={weeklyAverage > 0 ? `${weeklyAverage}/100` : 'N/A'} subtitle="Latest test average" icon={BookOpen} color="orange" animationDelay={200} />
        <KPICard title="Midterm Average" value={midtermAverage > 0 ? `${midtermAverage}%` : 'N/A'} subtitle="Class performance" icon={Award} color="purple" animationDelay={300} />
      </div>

      {/* Quick Actions */}
      <Card className="border-navy-100 dark:border-navy-700 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-navy-800 dark:text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.page}
                  onClick={() => onNavigate(action.page)}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-navy-100 dark:border-navy-700 hover:border-edu-accent/50 hover:bg-navy-50 dark:hover:bg-navy-700/50 transition-all duration-200 group"
                >
                  <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-navy-700 dark:text-navy-200 text-center leading-tight">{action.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-navy-100 dark:border-navy-700 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-navy-800 dark:text-white">Attendance Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceChart data={attendanceTrend} />
          </CardContent>
        </Card>

        <Card className="border-navy-100 dark:border-navy-700 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-navy-800 dark:text-white">Midterm Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ExamPerformanceChart gradeData={gradeData} />
          </CardContent>
        </Card>
      </div>

      {/* Recent students */}
      <Card className="border-navy-100 dark:border-navy-700 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base text-navy-800 dark:text-white">Recent Students</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('students')} className="text-edu-accent hover:text-edu-accent text-xs gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {students.slice(0, 5).map((student) => (
              <div key={student.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-navy-50 dark:hover:bg-navy-700/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-edu-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-edu-accent font-bold text-xs">{student.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-navy-800 dark:text-white text-sm font-medium truncate">{student.name}</p>
                  <p className="text-navy-400 text-xs">Roll #{student.rollNumber} · {student.class}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
