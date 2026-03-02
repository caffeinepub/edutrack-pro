import React, { useState, useEffect, useMemo } from 'react';
import { useStudents } from '../hooks/useStudents';
import { useAttendance } from '../hooks/useAttendance';
import { AttendanceStatus } from '../types/attendance';
import AttendanceSummaryComponent from '../components/attendance/AttendanceSummary';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Save, Download, CheckCircle, XCircle } from 'lucide-react';
import RoleGuard from '../components/RoleGuard';

export default function AttendancePage() {
  const { students } = useStudents();
  const { saveAttendance, getAttendanceByDate, calculateSummary } = useAttendance();

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [saved, setSaved] = useState(false);
  const [summary, setSummary] = useState<ReturnType<typeof calculateSummary> | null>(null);

  useEffect(() => {
    const existing = getAttendanceByDate(selectedDate);
    if (existing.length > 0) {
      const map: Record<string, AttendanceStatus> = {};
      existing.forEach((r) => { map[r.studentId] = r.status; });
      setAttendance(map);
      setSummary(calculateSummary(selectedDate, students.length));
      setSaved(true);
    } else {
      const defaultMap: Record<string, AttendanceStatus> = {};
      students.forEach((s) => { defaultMap[s.id] = 'present'; });
      setAttendance(defaultMap);
      setSummary(null);
      setSaved(false);
    }
  }, [selectedDate, students]);

  const toggle = (studentId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
    }));
    setSaved(false);
  };

  const markAll = (status: AttendanceStatus) => {
    const map: Record<string, AttendanceStatus> = {};
    students.forEach((s) => { map[s.id] = status; });
    setAttendance(map);
    setSaved(false);
  };

  const handleSave = () => {
    const entries = students.map((s) => ({ studentId: s.id, status: attendance[s.id] || 'absent' }));
    saveAttendance(selectedDate, entries);
    const s = calculateSummary(selectedDate, students.length);
    setSummary(s);
    setSaved(true);
  };

  const handleExport = () => {
    const lines = [
      `EduTrack Pro - Attendance Report`,
      `Date: ${selectedDate}`,
      ``,
      `Roll No | Name | Status`,
      `--------|------|-------`,
      ...students.map((s) => `${s.rollNumber} | ${s.name} | ${attendance[s.id] || 'absent'}`),
      ``,
      `Total Present: ${Object.values(attendance).filter((v) => v === 'present').length}`,
      `Total Absent: ${Object.values(attendance).filter((v) => v === 'absent').length}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${selectedDate}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const presentCount = useMemo(() => Object.values(attendance).filter((v) => v === 'present').length, [attendance]);
  const absentCount = useMemo(() => Object.values(attendance).filter((v) => v === 'absent').length, [attendance]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-navy-900 dark:text-white font-bold text-lg">Attendance Tracker</h2>
          <p className="text-navy-500 dark:text-navy-400 text-sm">Mark and track daily attendance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2 text-xs">
            <Download className="w-3.5 h-3.5" />
            Export Report
          </Button>
          <RoleGuard allowedRoles={['teacher']}>
            <Button onClick={handleSave} className="bg-edu-accent hover:bg-edu-accent-dark text-white gap-2 text-sm" size="sm">
              <Save className="w-3.5 h-3.5" />
              Save Attendance
            </Button>
          </RoleGuard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Date + Student List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Date picker */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-navy-100 dark:border-navy-700 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                <Calendar className="w-4 h-4 text-navy-400" />
                <label className="text-navy-700 dark:text-navy-200 text-sm font-medium">Select Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-navy-200 dark:border-navy-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-navy-700 text-navy-800 dark:text-white focus:outline-none focus:border-edu-accent"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => markAll('present')} className="text-xs gap-1 text-green-600 border-green-200 hover:bg-green-50">
                  <CheckCircle className="w-3 h-3" /> All Present
                </Button>
                <Button variant="outline" size="sm" onClick={() => markAll('absent')} className="text-xs gap-1 text-red-500 border-red-200 hover:bg-red-50">
                  <XCircle className="w-3 h-3" /> All Absent
                </Button>
              </div>
            </div>
            {saved && (
              <div className="mt-2 flex items-center gap-2 text-green-600 text-xs">
                <CheckCircle className="w-3.5 h-3.5" />
                Attendance saved for {selectedDate}
              </div>
            )}
          </div>

          {/* Live count */}
          <div className="flex gap-3">
            <div className="flex-1 bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center border border-green-100 dark:border-green-800/30">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{presentCount}</p>
              <p className="text-xs text-navy-500 dark:text-navy-400">Present</p>
            </div>
            <div className="flex-1 bg-red-50 dark:bg-red-900/20 rounded-xl p-3 text-center border border-red-100 dark:border-red-800/30">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{absentCount}</p>
              <p className="text-xs text-navy-500 dark:text-navy-400">Absent</p>
            </div>
            <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-center border border-blue-100 dark:border-blue-800/30">
              <p className="text-2xl font-bold text-edu-accent">
                {students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0}%
              </p>
              <p className="text-xs text-navy-500 dark:text-navy-400">Rate</p>
            </div>
          </div>

          {/* Student list */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-navy-100 dark:border-navy-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-navy-50 dark:border-navy-700">
              <h3 className="text-navy-800 dark:text-white font-semibold text-sm">Student List</h3>
            </div>
            <div className="divide-y divide-navy-50 dark:divide-navy-700">
              {students.map((student) => {
                const status = attendance[student.id] || 'absent';
                const isPresent = status === 'present';
                return (
                  <div key={student.id} className="flex items-center justify-between px-4 py-3 hover:bg-navy-50/50 dark:hover:bg-navy-700/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-edu-accent/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-edu-accent font-bold text-xs">{student.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-navy-800 dark:text-white text-sm font-medium">{student.name}</p>
                        <p className="text-navy-400 text-xs">Roll #{student.rollNumber}</p>
                      </div>
                    </div>
                    <RoleGuard allowedRoles={['teacher']}>
                      <button
                        onClick={() => toggle(student.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                          isPresent
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {isPresent ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {isPresent ? 'Present' : 'Absent'}
                      </button>
                    </RoleGuard>
                    {/* Principal view */}
                    <div className="hidden">
                      <Badge variant={isPresent ? 'default' : 'destructive'} className="text-xs">
                        {isPresent ? 'Present' : 'Absent'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="space-y-4">
          {summary ? (
            <AttendanceSummaryComponent summary={summary} />
          ) : (
            <div className="bg-white dark:bg-navy-800 rounded-2xl border border-navy-100 dark:border-navy-700 p-5 text-center">
              <Calendar className="w-10 h-10 text-navy-300 mx-auto mb-3" />
              <p className="text-navy-500 dark:text-navy-400 text-sm font-medium">No saved data</p>
              <p className="text-navy-400 text-xs mt-1">Save attendance to see the summary chart</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
