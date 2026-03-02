import { useState, useCallback } from 'react';
import { MidtermExam, MidtermResult, RankListEntry, Grade } from '../types/midtermExam';
import { Student } from '../types/student';
import { getItem, setItem, STORAGE_KEYS } from '../utils/storage';

function loadExams(): MidtermExam[] {
  return getItem<MidtermExam[]>(STORAGE_KEYS.MIDTERM_EXAMS) || [];
}

function computeGrade(percentage: number): Grade {
  if (percentage >= 80) return 'A';
  if (percentage >= 60) return 'B';
  if (percentage >= 40) return 'C';
  return 'Fail';
}

export function useMidtermExam() {
  const [exams, setExams] = useState<MidtermExam[]>(loadExams);

  const persist = useCallback((updated: MidtermExam[]) => {
    setExams(updated);
    setItem(STORAGE_KEYS.MIDTERM_EXAMS, updated);
  }, []);

  const saveMidtermExam = useCallback(
    (exam: MidtermExam) => {
      const current = loadExams();
      const existing = current.findIndex((e) => e.studentId === exam.studentId);
      if (existing >= 0) {
        const updated = [...current];
        updated[existing] = exam;
        persist(updated);
      } else {
        persist([...current, exam]);
      }
    },
    [persist]
  );

  const saveAllExams = useCallback(
    (newExams: MidtermExam[]) => {
      persist(newExams);
    },
    [persist]
  );

  const calculateResults = useCallback((examsData: MidtermExam[]): MidtermResult[] => {
    return examsData.map((exam) => {
      const totalMarks = exam.subjectMarks.reduce((sum, sm) => sum + sm.mark, 0);
      const maxTotalMarks = exam.subjectMarks.reduce((sum, sm) => sum + sm.maxMark, 0);
      const percentage = maxTotalMarks > 0 ? Math.round((totalMarks / maxTotalMarks) * 100) : 0;
      const grade = computeGrade(percentage);
      return { studentId: exam.studentId, totalMarks, maxTotalMarks, percentage, grade };
    });
  }, []);

  const generateRankList = useCallback(
    (examsData: MidtermExam[], students: Student[]): RankListEntry[] => {
      const results = calculateResults(examsData);
      const sorted = [...results].sort((a, b) => b.totalMarks - a.totalMarks);
      return sorted.map((r, idx) => {
        const student = students.find((s) => s.id === r.studentId);
        return {
          rank: idx + 1,
          studentId: r.studentId,
          studentName: student?.name || 'Unknown',
          totalMarks: r.totalMarks,
          maxTotalMarks: r.maxTotalMarks,
          percentage: r.percentage,
          grade: r.grade,
        };
      });
    },
    [calculateResults]
  );

  const getMidtermClassAverage = useCallback((): number => {
    const allExams = loadExams();
    if (allExams.length === 0) return 0;
    const results = calculateResults(allExams);
    const total = results.reduce((sum, r) => sum + r.percentage, 0);
    return Math.round(total / results.length);
  }, [calculateResults]);

  return { exams, saveMidtermExam, saveAllExams, calculateResults, generateRankList, getMidtermClassAverage };
}
