import { useState, useCallback } from 'react';
import { AttendanceRecord, AttendanceSummary, AttendanceStatus } from '../types/attendance';
import { getItem, setItem, STORAGE_KEYS } from '../utils/storage';

function loadRecords(): AttendanceRecord[] {
  return getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE) || [];
}

export function useAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>(loadRecords);

  const saveAttendance = useCallback(
    (date: string, entries: { studentId: string; status: AttendanceStatus }[]) => {
      const current = loadRecords().filter((r) => r.date !== date);
      const newRecords = entries.map((e) => ({ date, studentId: e.studentId, status: e.status }));
      const updated = [...current, ...newRecords];
      setRecords(updated);
      setItem(STORAGE_KEYS.ATTENDANCE, updated);
    },
    []
  );

  const getAttendanceByDate = useCallback(
    (date: string): AttendanceRecord[] => {
      return records.filter((r) => r.date === date);
    },
    [records]
  );

  const calculateSummary = useCallback(
    (date: string, totalStudents: number): AttendanceSummary => {
      const dayRecords = records.filter((r) => r.date === date);
      const totalPresent = dayRecords.filter((r) => r.status === 'present').length;
      const totalAbsent = dayRecords.filter((r) => r.status === 'absent').length;
      const attendancePercentage = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;
      return { date, totalPresent, totalAbsent, attendancePercentage };
    },
    [records]
  );

  const getOverallAttendancePercentage = useCallback((): number => {
    if (records.length === 0) return 0;
    const present = records.filter((r) => r.status === 'present').length;
    return Math.round((present / records.length) * 100);
  }, [records]);

  return { records, saveAttendance, getAttendanceByDate, calculateSummary, getOverallAttendancePercentage };
}
