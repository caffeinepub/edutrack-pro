import { useMemo } from 'react';
import { useStudents } from './useStudents';
import { useAttendance } from './useAttendance';
import { useWeeklyTest } from './useWeeklyTest';
import { useMidtermExam } from './useMidtermExam';

export function useDashboardData() {
  const { students } = useStudents();
  const { getOverallAttendancePercentage, records } = useAttendance();
  const { getWeeklyAverage } = useWeeklyTest();
  const { getMidtermClassAverage } = useMidtermExam();

  const totalStudents = students.length;
  const attendancePercentage = getOverallAttendancePercentage();
  const weeklyAverage = getWeeklyAverage();
  const midtermAverage = getMidtermClassAverage();

  const attendanceTrend = useMemo(() => {
    const dateMap: Record<string, { present: number; absent: number }> = {};
    records.forEach((r) => {
      if (!dateMap[r.date]) dateMap[r.date] = { present: 0, absent: 0 };
      if (r.status === 'present') dateMap[r.date].present++;
      else dateMap[r.date].absent++;
    });
    return Object.entries(dateMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7)
      .map(([date, counts]) => ({
        date: date.slice(5),
        present: counts.present,
        absent: counts.absent,
      }));
  }, [records]);

  return { totalStudents, attendancePercentage, weeklyAverage, midtermAverage, attendanceTrend };
}
