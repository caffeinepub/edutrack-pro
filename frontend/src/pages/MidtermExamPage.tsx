import React, { useState, useMemo } from 'react';
import { useStudents } from '../hooks/useStudents';
import { useMidtermExam } from '../hooks/useMidtermExam';
import { MidtermExam } from '../types/midtermExam';
import RankList from '../components/midtermExam/RankList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Save, Trash2, Award, BarChart2, Trophy } from 'lucide-react';
import RoleGuard from '../components/RoleGuard';
import { useAuth } from '../contexts/AuthContext';

const DEFAULT_SUBJECTS = ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'];

export default function MidtermExamPage() {
  const { students } = useStudents();
  const { exams, saveAllExams, calculateResults, generateRankList } = useMidtermExam();
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';

  const [subjects, setSubjects] = useState<string[]>(() => {
    if (exams.length > 0 && exams[0].subjectMarks.length > 0) {
      return exams[0].subjectMarks.map((sm) => sm.subject);
    }
    return DEFAULT_SUBJECTS;
  });

  const [newSubject, setNewSubject] = useState('');

  const [localMarks, setLocalMarks] = useState<Record<string, Record<string, number>>>(() => {
    const init: Record<string, Record<string, number>> = {};
    exams.forEach((exam) => {
      init[exam.studentId] = {};
      exam.subjectMarks.forEach((sm) => {
        init[exam.studentId][sm.subject] = sm.mark;
      });
    });
    return init;
  });

  const handleMarkChange = (studentId: string, subject: string, value: string) => {
    const num = value === '' ? 0 : Math.min(100, Math.max(0, Number(value)));
    setLocalMarks((prev) => ({
      ...prev,
      [studentId]: { ...(prev[studentId] || {}), [subject]: num },
    }));
  };

  const handleSave = () => {
    const newExams: MidtermExam[] = students.map((s) => ({
      studentId: s.id,
      subjectMarks: subjects.map((sub) => ({
        subject: sub,
        mark: localMarks[s.id]?.[sub] ?? 0,
        maxMark: 100,
      })),
    }));
    saveAllExams(newExams);
  };

  const addSubject = () => {
    const trimmed = newSubject.trim();
    if (!trimmed || subjects.includes(trimmed)) return;
    setSubjects((prev) => [...prev, trimmed]);
    setNewSubject('');
  };

  const removeSubject = (sub: string) => {
    setSubjects((prev) => prev.filter((s) => s !== sub));
  };

  const currentExams: MidtermExam[] = useMemo(() => {
    return students.map((s) => ({
      studentId: s.id,
      subjectMarks: subjects.map((sub) => ({
        subject: sub,
        mark: localMarks[s.id]?.[sub] ?? 0,
        maxMark: 100,
      })),
    }));
  }, [students, subjects, localMarks]);

  const rankList = useMemo(
    () => generateRankList(currentExams, students),
    [currentExams, students, generateRankList]
  );

  const results = useMemo(() => calculateResults(currentExams), [currentExams, calculateResults]);

  const classAvg = useMemo(() => {
    if (results.length === 0) return 0;
    return Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length);
  }, [results]);

  const topStudent = rankList[0];

  const gradeCount = useMemo(() => {
    const counts = { A: 0, B: 0, C: 0, Fail: 0 };
    results.forEach((r) => {
      counts[r.grade]++;
    });
    return counts;
  }, [results]);

  const GRADE_STYLES: Record<string, string> = {
    A: 'text-green-600 dark:text-green-400',
    B: 'text-blue-600 dark:text-blue-400',
    C: 'text-yellow-600 dark:text-yellow-400',
    Fail: 'text-red-600 dark:text-red-400',
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-navy-900 dark:text-white font-bold text-lg">Midterm Examination</h2>
          <p className="text-navy-500 dark:text-navy-400 text-sm">
            Enter subject-wise marks and view rank analysis
          </p>
        </div>
        <RoleGuard allowedRoles={['teacher']}>
          <Button
            onClick={handleSave}
            className="bg-edu-accent hover:bg-edu-accent-dark text-white gap-2 self-start sm:self-auto"
            size="sm"
          >
            <Save className="w-3.5 h-3.5" /> Save All Marks
          </Button>
        </RoleGuard>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="w-4 h-4 text-edu-accent" />
            <span className="text-xs text-navy-500 dark:text-navy-400">Class Average</span>
          </div>
          <p className="text-2xl font-bold text-edu-accent">{classAvg}%</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-100 dark:border-yellow-800/30">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-navy-500 dark:text-navy-400">Top Student</span>
          </div>
          <p className="text-sm font-bold text-yellow-700 dark:text-yellow-400 truncate">
            {topStudent?.studentName || '—'}
          </p>
          <p className="text-xs text-navy-400">
            {topStudent?.totalMarks || 0}/{topStudent?.maxTotalMarks || subjects.length * 100}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800/30">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-green-500" />
            <span className="text-xs text-navy-500 dark:text-navy-400">Grade A Students</span>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{gradeCount.A}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-100 dark:border-red-800/30">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-red-500" />
            <span className="text-xs text-navy-500 dark:text-navy-400">Failing Students</span>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{gradeCount.Fail}</p>
        </div>
      </div>

      <Tabs defaultValue="marks">
        <TabsList className="bg-navy-100 dark:bg-navy-700">
          <TabsTrigger value="marks" className="text-sm">
            Enter Marks
          </TabsTrigger>
          <TabsTrigger value="ranks" className="text-sm">
            Rank List 🏆
          </TabsTrigger>
        </TabsList>

        {/* Marks Entry Tab */}
        <TabsContent value="marks" className="mt-4 space-y-4">
          {/* Subject management */}
          <RoleGuard allowedRoles={['teacher']}>
            <Card className="border-navy-100 dark:border-navy-700 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-navy-800 dark:text-white">Manage Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {subjects.map((sub) => (
                    <span
                      key={sub}
                      className="flex items-center gap-1.5 px-3 py-1 bg-edu-accent/10 text-edu-accent rounded-full text-xs font-medium"
                    >
                      {sub}
                      <button
                        onClick={() => removeSubject(sub)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add subject..."
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSubject()}
                    className="text-sm max-w-xs"
                  />
                  <Button
                    onClick={addSubject}
                    size="sm"
                    className="bg-edu-accent hover:bg-edu-accent-dark text-white gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          </RoleGuard>

          {/* Marks table */}
          <Card className="border-navy-100 dark:border-navy-700 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-navy-800 dark:text-white">Student Marks Entry</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-navy-50 dark:bg-navy-700/50 border-b border-navy-100 dark:border-navy-700">
                      <th className="text-left px-4 py-3 text-navy-600 dark:text-navy-300 font-semibold text-xs w-48 sticky left-0 bg-navy-50 dark:bg-navy-700/50">
                        Student
                      </th>
                      {subjects.map((sub) => (
                        <th
                          key={sub}
                          className="text-center px-3 py-3 text-navy-600 dark:text-navy-300 font-semibold text-xs min-w-[100px]"
                        >
                          {sub}
                        </th>
                      ))}
                      <th className="text-center px-3 py-3 text-navy-600 dark:text-navy-300 font-semibold text-xs">
                        Total
                      </th>
                      <th className="text-center px-3 py-3 text-navy-600 dark:text-navy-300 font-semibold text-xs">
                        %
                      </th>
                      <th className="text-center px-3 py-3 text-navy-600 dark:text-navy-300 font-semibold text-xs">
                        Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-50 dark:divide-navy-700">
                    {students.map((student) => {
                      const result = results.find((r) => r.studentId === student.id);
                      const rank = rankList.find((r) => r.studentId === student.id);
                      const isTop3 = rank && rank.rank <= 3;
                      return (
                        <tr
                          key={student.id}
                          className={`transition-colors ${
                            isTop3
                              ? 'bg-yellow-50/30 dark:bg-yellow-900/5'
                              : 'hover:bg-navy-50/50 dark:hover:bg-navy-700/30'
                          }`}
                        >
                          <td className="px-4 py-2.5 sticky left-0 bg-white dark:bg-navy-800">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-edu-accent/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-edu-accent font-bold text-xs">
                                  {student.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="text-navy-800 dark:text-white font-medium text-xs leading-tight">
                                  {student.name}
                                </p>
                                <p className="text-navy-400 text-xs">#{student.rollNumber}</p>
                              </div>
                            </div>
                          </td>
                          {subjects.map((sub) => (
                            <td key={sub} className="px-3 py-2.5 text-center">
                              {isTeacher ? (
                                <Input
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={localMarks[student.id]?.[sub] ?? ''}
                                  onChange={(e) => handleMarkChange(student.id, sub, e.target.value)}
                                  className="w-16 text-center text-xs font-semibold mx-auto h-8"
                                  placeholder="0"
                                />
                              ) : (
                                <span className="text-navy-700 dark:text-navy-200 font-semibold text-sm">
                                  {localMarks[student.id]?.[sub] ?? 0}
                                </span>
                              )}
                            </td>
                          ))}
                          <td className="px-3 py-2.5 text-center">
                            <span className="text-navy-800 dark:text-white font-bold text-sm">
                              {result?.totalMarks ?? 0}/{result?.maxTotalMarks ?? subjects.length * 100}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <span
                              className={`font-bold text-sm ${
                                GRADE_STYLES[result?.grade ?? 'Fail']
                              }`}
                            >
                              {result?.percentage ?? 0}%
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                                result?.grade === 'A'
                                  ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                  : result?.grade === 'B'
                                  ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
                                  : result?.grade === 'C'
                                  ? 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
                                  : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                              }`}
                            >
                              {result?.grade ?? 'Fail'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rank List Tab */}
        <TabsContent value="ranks" className="mt-4">
          <Card className="border-navy-100 dark:border-navy-700 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-navy-800 dark:text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Class Rank List
                </CardTitle>
                <span className="text-xs text-navy-400">{rankList.length} students ranked</span>
              </div>
            </CardHeader>
            <CardContent>
              <RankList entries={rankList} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
