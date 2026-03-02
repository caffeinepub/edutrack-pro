import React from 'react';
import { Student } from '../../types/student';
import { Edit2, Trash2, Phone, Hash, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RoleGuard from '../RoleGuard';

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export default function StudentCard({ student, onEdit, onDelete }: StudentCardProps) {
  return (
    <div className="bg-white dark:bg-navy-800 rounded-2xl border border-navy-100 dark:border-navy-700 p-4 hover:shadow-md transition-all duration-200 animate-slide-up">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-edu-accent/10 flex items-center justify-center flex-shrink-0">
            <span className="text-edu-accent font-bold text-sm">{student.name.charAt(0)}</span>
          </div>
          <div className="min-w-0">
            <h3 className="text-navy-900 dark:text-white font-semibold text-sm truncate">{student.name}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <Hash className="w-3 h-3 text-navy-400" />
              <span className="text-navy-500 dark:text-navy-400 text-xs">{student.rollNumber}</span>
            </div>
          </div>
        </div>
        <RoleGuard allowedRoles={['teacher']}>
          <div className="flex gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(student)}
              className="w-7 h-7 text-navy-400 hover:text-edu-accent hover:bg-edu-accent/10"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(student.id)}
              className="w-7 h-7 text-navy-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </RoleGuard>
      </div>
      <div className="mt-3 pt-3 border-t border-navy-50 dark:border-navy-700 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-navy-400 flex-shrink-0" />
          <span className="text-navy-600 dark:text-navy-300 text-xs truncate">{student.class}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-navy-400 flex-shrink-0" />
          <span className="text-navy-600 dark:text-navy-300 text-xs truncate">{student.parentContact}</span>
        </div>
      </div>
    </div>
  );
}
