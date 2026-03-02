import { useState, useCallback } from 'react';
import { WeeklyTest, WeeklyTestSummary } from '../types/weeklyTest';
import { getItem, setItem, STORAGE_KEYS } from '../utils/storage';

function loadTests(): WeeklyTest[] {
  return getItem<WeeklyTest[]>(STORAGE_KEYS.WEEKLY_TESTS) || [];
}

export function useWeeklyTest() {
  const [tests, setTests] = useState<WeeklyTest[]>(loadTests);

  const persist = useCallback((updated: WeeklyTest[]) => {
    setTests(updated);
    setItem(STORAGE_KEYS.WEEKLY_TESTS, updated);
  }, []);

  const addWeeklyTest = useCallback(
    (subject: string, studentIds: string[]) => {
      const newTest: WeeklyTest = {
        id: Date.now().toString(),
        subject,
        date: new Date().toISOString().split('T')[0],
        studentMarks: studentIds.map((id) => ({ studentId: id, mark: null })),
      };
      persist([...loadTests(), newTest]);
    },
    [persist]
  );

  const updateStudentMark = useCallback(
    (testId: string, studentId: string, mark: number | null) => {
      const current = loadTests();
      persist(
        current.map((t) =>
          t.id === testId
            ? {
                ...t,
                studentMarks: t.studentMarks.map((sm) =>
                  sm.studentId === studentId ? { ...sm, mark } : sm
                ),
              }
            : t
        )
      );
    },
    [persist]
  );

  const deleteTest = useCallback(
    (testId: string) => {
      persist(loadTests().filter((t) => t.id !== testId));
    },
    [persist]
  );

  const calculateSummary = useCallback((test: WeeklyTest): WeeklyTestSummary => {
    const validMarks = test.studentMarks.filter((sm) => sm.mark !== null) as { studentId: string; mark: number }[];
    if (validMarks.length === 0) {
      return { subject: test.subject, classAverage: 0, topperStudentId: '', topperMark: 0 };
    }
    const total = validMarks.reduce((sum, sm) => sum + sm.mark, 0);
    const classAverage = Math.round((total / validMarks.length) * 10) / 10;
    const topper = validMarks.reduce((best, sm) => (sm.mark > best.mark ? sm : best), validMarks[0]);
    return { subject: test.subject, classAverage, topperStudentId: topper.studentId, topperMark: topper.mark };
  }, []);

  const getWeeklyAverage = useCallback((): number => {
    const allTests = loadTests();
    if (allTests.length === 0) return 0;
    let total = 0;
    let count = 0;
    allTests.forEach((t) => {
      t.studentMarks.forEach((sm) => {
        if (sm.mark !== null) {
          total += sm.mark;
          count++;
        }
      });
    });
    return count > 0 ? Math.round((total / count) * 10) / 10 : 0;
  }, []);

  return { tests, addWeeklyTest, updateStudentMark, deleteTest, calculateSummary, getWeeklyAverage };
}
