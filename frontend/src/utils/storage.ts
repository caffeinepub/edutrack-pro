import { Student } from '../types/student';
import { AttendanceRecord } from '../types/attendance';
import { WeeklyTest } from '../types/weeklyTest';
import { MidtermExam } from '../types/midtermExam';
import { User } from '../types/auth';

export const STORAGE_KEYS = {
  AUTH: 'edutrack_auth',
  STUDENTS: 'edutrack_students',
  ATTENDANCE: 'edutrack_attendance',
  WEEKLY_TESTS: 'edutrack_weekly_tests',
  MIDTERM_EXAMS: 'edutrack_midterm_exams',
  DARK_MODE: 'edutrack_dark_mode',
  REGISTERED_TEACHERS: 'edutrack_registered_teachers',
};

export function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function removeItem(key: string): void {
  localStorage.removeItem(key);
}

export interface RegisteredTeacher {
  username: string;
  password: string;
  displayName: string;
  classSection: string;
}

export function getRegisteredTeachers(): RegisteredTeacher[] {
  return getItem<RegisteredTeacher[]>(STORAGE_KEYS.REGISTERED_TEACHERS) ?? [];
}

export function saveRegisteredTeachers(teachers: RegisteredTeacher[]): void {
  setItem(STORAGE_KEYS.REGISTERED_TEACHERS, teachers);
}

const SAMPLE_STUDENTS: Student[] = [
  { id: '1', name: 'Aarav Sharma', rollNumber: '001', class: '10-A', parentContact: '+91 98765 43210' },
  { id: '2', name: 'Priya Patel', rollNumber: '002', class: '10-A', parentContact: '+91 87654 32109' },
  { id: '3', name: 'Rohan Mehta', rollNumber: '003', class: '10-A', parentContact: '+91 76543 21098' },
  { id: '4', name: 'Sneha Gupta', rollNumber: '004', class: '10-A', parentContact: '+91 65432 10987' },
  { id: '5', name: 'Arjun Singh', rollNumber: '005', class: '10-A', parentContact: '+91 54321 09876' },
  { id: '6', name: 'Kavya Nair', rollNumber: '006', class: '10-A', parentContact: '+91 43210 98765' },
  { id: '7', name: 'Vikram Reddy', rollNumber: '007', class: '10-A', parentContact: '+91 32109 87654' },
  { id: '8', name: 'Ananya Joshi', rollNumber: '008', class: '10-A', parentContact: '+91 21098 76543' },
  { id: '9', name: 'Kiran Kumar', rollNumber: '009', class: '10-A', parentContact: '+91 10987 65432' },
  { id: '10', name: 'Divya Iyer', rollNumber: '010', class: '10-A', parentContact: '+91 09876 54321' },
];

function generateSampleAttendance(students: Student[]): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  for (let d = 6; d >= 0; d--) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    const dateStr = date.toISOString().split('T')[0];
    students.forEach((s, idx) => {
      records.push({
        date: dateStr,
        studentId: s.id,
        status: idx % 5 === 0 && d % 2 === 0 ? 'absent' : 'present',
      });
    });
  }
  return records;
}

function generateSampleWeeklyTests(students: Student[]): WeeklyTest[] {
  const subjects = ['Mathematics', 'Science', 'English'];
  const today = new Date();
  return subjects.map((subject, si) => {
    const date = new Date(today);
    date.setDate(today.getDate() - si * 7);
    return {
      id: `wt-${si + 1}`,
      subject,
      date: date.toISOString().split('T')[0],
      studentMarks: students.map((s, idx) => ({
        studentId: s.id,
        mark: Math.min(100, 55 + ((idx * 7 + si * 13) % 45)),
      })),
    };
  });
}

function generateSampleMidtermExams(students: Student[]): MidtermExam[] {
  const subjects = [
    { subject: 'Mathematics', maxMark: 100 },
    { subject: 'Science', maxMark: 100 },
    { subject: 'English', maxMark: 100 },
    { subject: 'Social Studies', maxMark: 100 },
    { subject: 'Hindi', maxMark: 100 },
  ];
  return students.map((s, idx) => ({
    studentId: s.id,
    subjectMarks: subjects.map((sub, si) => ({
      subject: sub.subject,
      mark: Math.min(sub.maxMark, 40 + ((idx * 11 + si * 7) % 55)),
      maxMark: sub.maxMark,
    })),
  }));
}

export function seedDemoData(): void {
  const existingStudents = getItem<Student[]>(STORAGE_KEYS.STUDENTS);
  if (!existingStudents || existingStudents.length === 0) {
    setItem(STORAGE_KEYS.STUDENTS, SAMPLE_STUDENTS);

    const attendance = generateSampleAttendance(SAMPLE_STUDENTS);
    setItem(STORAGE_KEYS.ATTENDANCE, attendance);

    const weeklyTests = generateSampleWeeklyTests(SAMPLE_STUDENTS);
    setItem(STORAGE_KEYS.WEEKLY_TESTS, weeklyTests);

    const midtermExams = generateSampleMidtermExams(SAMPLE_STUDENTS);
    setItem(STORAGE_KEYS.MIDTERM_EXAMS, midtermExams);
  }
}
