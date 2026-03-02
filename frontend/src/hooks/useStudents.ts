import { useState, useCallback } from 'react';
import { Student } from '../types/student';
import { getItem, setItem, STORAGE_KEYS } from '../utils/storage';

function loadStudents(): Student[] {
  return getItem<Student[]>(STORAGE_KEYS.STUDENTS) || [];
}

export function useStudents() {
  const [students, setStudents] = useState<Student[]>(loadStudents);

  const persist = useCallback((updated: Student[]) => {
    setStudents(updated);
    setItem(STORAGE_KEYS.STUDENTS, updated);
  }, []);

  const addStudent = useCallback((student: Omit<Student, 'id'>) => {
    const newStudent: Student = { ...student, id: Date.now().toString() };
    persist([...loadStudents(), newStudent]);
  }, [persist]);

  const updateStudent = useCallback((id: string, updates: Partial<Omit<Student, 'id'>>) => {
    const current = loadStudents();
    persist(current.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }, [persist]);

  const deleteStudent = useCallback((id: string) => {
    const current = loadStudents();
    persist(current.filter((s) => s.id !== id));
  }, [persist]);

  const refresh = useCallback(() => {
    setStudents(loadStudents());
  }, []);

  return { students, addStudent, updateStudent, deleteStudent, refresh };
}
