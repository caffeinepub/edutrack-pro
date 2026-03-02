import React from 'react';
import { Student } from '../../types/student';
import { Trophy } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface StudentMarkRowProps {
  student: Student;
  mark: number | null;
  isTopper: boolean;
  isTeacher: boolean;
  onMarkChange: (studentId: string, mark: number | null) => void;
}

export default function StudentMarkRow({ student, mark, isTopper, isTeacher, onMarkChange }: StudentMarkRowProps) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 transition-colors ${isTopper ? 'bg-yellow-50 dark:bg-yellow-900/10' : 'hover:bg-navy-50/50 dark:hover:bg-navy-700/30'}`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isTopper ? 'bg-yellow-400' : 'bg-edu-accent/10'}`}>
          {isTopper ? (
            <Trophy className="w-4 h-4 text-white" />
          ) : (
            <span className="text-edu-accent font-bold text-xs">{student.name.charAt(0)}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-medium truncate ${isTopper ? 'text-yellow-700 dark:text-yellow-400' : 'text-navy-800 dark:text-white'}`}>
            {student.name}
            {isTopper && <span className="ml-2 text-xs text-yellow-600 dark:text-yellow-400 font-semibold">🏆 Topper</span>}
          </p>
          <p className="text-navy-400 text-xs">Roll #{student.rollNumber}</p>
        </div>
      </div>
      {isTeacher ? (
        <Input
          type="number"
          min={0}
          max={100}
          value={mark ?? ''}
          onChange={(e) => {
            const val = e.target.value === '' ? null : Math.min(100, Math.max(0, Number(e.target.value)));
            onMarkChange(student.id, val);
          }}
          className="w-20 text-center text-sm font-semibold"
          placeholder="—"
        />
      ) : (
        <span className={`w-20 text-center text-sm font-bold ${mark !== null ? 'text-navy-800 dark:text-white' : 'text-navy-400'}`}>
          {mark !== null ? mark : '—'}
        </span>
      )}
    </div>
  );
}
