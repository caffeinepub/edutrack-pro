export type AttendanceStatus = 'present' | 'absent';

export interface AttendanceRecord {
  date: string;
  studentId: string;
  status: AttendanceStatus;
}

export interface AttendanceSummary {
  date: string;
  totalPresent: number;
  totalAbsent: number;
  attendancePercentage: number;
}
