export interface SubjectMark {
  subject: string;
  mark: number;
  maxMark: number;
}

export interface MidtermExam {
  studentId: string;
  subjectMarks: SubjectMark[];
}

export type Grade = 'A' | 'B' | 'C' | 'Fail';

export interface MidtermResult {
  studentId: string;
  totalMarks: number;
  maxTotalMarks: number;
  percentage: number;
  grade: Grade;
}

export interface RankListEntry {
  rank: number;
  studentId: string;
  studentName: string;
  totalMarks: number;
  maxTotalMarks: number;
  percentage: number;
  grade: Grade;
}
