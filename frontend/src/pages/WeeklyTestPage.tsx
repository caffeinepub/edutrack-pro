import React, { useState, useMemo } from 'react';
import { useStudents } from '../hooks/useStudents';
import { useWeeklyTest } from '../hooks/useWeeklyTest';
import { WeeklyTest } from '../types/weeklyTest';
import StudentMarkRow from '../components/weeklyTest/StudentMarkRow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, BookOpen, Trash2, BarChart2, Trophy } from 'lucide-react';
import RoleGuard from '../components/RoleGuard';
import { useAuth } from '../contexts/AuthContext';

export default function WeeklyTestPage() {
  const { students } = useStudents();
  const { tests, addWeeklyTest, updateStudentMark, deleteTest, calculateSummary } = useWeeklyTest();
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';

  const [newSubject, setNewSubject] = useState('');
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [localMarks, setLocalMarks] = useState<Record<string, number | null>>({});

  const activeTest = useMemo(() => tests.find((t) => t.id === activeTestId) || tests[0] || null, [tests, activeTestId]);

  const summary = useMemo(() => {
    if (!activeTest) return null;
    const testWithLocal: WeeklyTest = {
      ...activeTest,
      studentMarks: activeTest.studentMarks.map((sm) => ({
        ...sm,
        mark: localMarks[sm.studentId] !== undefined ? localMarks[sm.studentId] : sm.mark,
      })),
    };
    return calculateSummary(testWithLocal);
  }, [activeTest, localMarks, calculateSummary]);

  const handleAddTest = () => {
    if (!newSubject.trim()) return;
    addWeeklyTest(newSubject.trim(), students.map((s) => s.id));
    setNewSubject('');
    setLocalMarks({});
  };

  const handleMarkChange = (studentId: string, mark: number | null) => {
    setLocalMarks((prev) => ({ ...prev, [studentId]: mark }));
    if (activeTest) {
      updateStudentMark(activeTest.id, studentId, mark);
    }
  };

  const getMarkForStudent = (studentId: string): number | null => {
    if (localMarks[studentId] !== undefined) return localMarks[studentId];
    return activeTest?.studentMarks.find((sm) => sm.studentId === studentId)?.mark ?? null;
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-navy-900 dark:text-white font-bold text-lg">Weekly Test Marks</h2>
        <p className="text-navy-500 dark:text-navy-400 text-sm">Track and analyze weekly test performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Sidebar: Test list */}
        <div className="space-y-3">
          <RoleGuard allowedRoles={['teacher']}>
            <Card className="border-navy-100 dark:border-navy-700 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-navy-800 dark:text-white">Add New Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-navy-600 dark:text-navy-300">Subject Name</Label>
                  <Input
                    placeholder="e.g. Mathematics"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTest()}
                    className="text-sm"
                  />
                </div>
                <Button onClick={handleAddTest} className="w-full bg-edu-accent hover:bg-edu-accent-dark text-white text-sm gap-2" size="sm">
                  <Plus className="w-3.5 h-3.5" /> Add Test
                </Button>
              </CardContent>
            </Card>
          </RoleGuard>

          <Card className="border-navy-100 dark:border-navy-700 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-navy-800 dark:text-white">Tests ({tests.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {tests.length === 0 ? (
                <p className="text-navy-400 text-xs text-center py-4">No tests yet</p>
              ) : (
                <div className="space-y-1">
                  {tests.map((test) => (
                    <div
                      key={test.id}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        (activeTestId === test.id || (!activeTestId && tests[0]?.id === test.id))
                          ? 'bg-edu-accent text-white'
                          : 'hover:bg-navy-50 dark:hover:bg-navy-700 text-navy-700 dark:text-navy-200'
                      }`}
                      onClick={() => { setActiveTestId(test.id); setLocalMarks({}); }}
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">{test.subject}</p>
                        <p className="text-xs opacity-70">{test.date}</p>
                      </div>
                      <RoleGuard allowedRoles={['teacher']}>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteTest(test.id); }}
                          className="ml-2 opacity-60 hover:opacity-100 flex-shrink-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </RoleGuard>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main: Marks entry */}
        <div className="lg:col-span-3 space-y-4">
          {activeTest ? (
            <>
              {/* Summary cards */}
              {summary && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart2 className="w-4 h-4 text-edu-accent" />
                      <span className="text-xs text-navy-500 dark:text-navy-400 font-medium">Class Average</span>
                    </div>
                    <p className="text-2xl font-bold text-edu-accent">{summary.classAverage}/100</p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-100 dark:border-yellow-800/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs text-navy-500 dark:text-navy-400 font-medium">Class Topper</span>
                    </div>
                    <p className="text-sm font-bold text-yellow-700 dark:text-yellow-400 truncate">
                      {students.find((s) => s.id === summary.topperStudentId)?.name || '—'}
                    </p>
                    <p className="text-xs text-navy-400">{summary.topperMark}/100</p>
                  </div>
                </div>
              )}

              {/* Student marks */}
              <Card className="border-navy-100 dark:border-navy-700 shadow-sm">
                <CardHeader className="pb-2 border-b border-navy-50 dark:border-navy-700">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm text-navy-800 dark:text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-edu-accent" />
                      {activeTest.subject} — {activeTest.date}
                    </CardTitle>
                    <span className="text-xs text-navy-400">{students.length} students</span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-navy-50 dark:divide-navy-700">
                    {students.map((student) => {
                      const mark = getMarkForStudent(student.id);
                      const isTopper = summary?.topperStudentId === student.id && mark !== null;
                      return (
                        <StudentMarkRow
                          key={student.id}
                          student={student}
                          mark={mark}
                          isTopper={isTopper}
                          isTeacher={isTeacher}
                          onMarkChange={handleMarkChange}
                        />
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-navy-400">
              <BookOpen className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-medium">No tests available</p>
              <p className="text-sm">Add a new test to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
