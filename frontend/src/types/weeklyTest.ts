export interface StudentMark {
  studentId: string;
  mark: number | null;
}

export interface WeeklyTest {
  id: string;
  subject: string;
  date: string;
  studentMarks: StudentMark[];
}

export interface WeeklyTestSummary {
  subject: string;
  classAverage: number;
  topperStudentId: string;
  topperMark: number;
}
