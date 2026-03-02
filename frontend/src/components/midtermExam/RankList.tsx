import React from 'react';
import { RankListEntry } from '../../types/midtermExam';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface RankListProps {
  entries: RankListEntry[];
}

const GRADE_STYLES: Record<string, string> = {
  A: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400',
  B: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
  C: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400',
  Fail: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400',
};

const RANK_BADGES: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function RankList({ entries }: RankListProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-navy-400 text-sm">
        No exam data available. Enter marks to generate the rank list.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-navy-100 dark:border-navy-700">
      <Table>
        <TableHeader>
          <TableRow className="bg-navy-50 dark:bg-navy-700/50">
            <TableHead className="text-navy-600 dark:text-navy-300 font-semibold text-xs w-16">Rank</TableHead>
            <TableHead className="text-navy-600 dark:text-navy-300 font-semibold text-xs">Student Name</TableHead>
            <TableHead className="text-navy-600 dark:text-navy-300 font-semibold text-xs text-center">Total Marks</TableHead>
            <TableHead className="text-navy-600 dark:text-navy-300 font-semibold text-xs text-center">Percentage</TableHead>
            <TableHead className="text-navy-600 dark:text-navy-300 font-semibold text-xs text-center">Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow
              key={entry.studentId}
              className={`transition-colors ${entry.rank <= 3 ? 'bg-yellow-50/50 dark:bg-yellow-900/5' : 'hover:bg-navy-50/50 dark:hover:bg-navy-700/30'}`}
            >
              <TableCell className="font-bold text-sm">
                <span className="flex items-center gap-1.5">
                  {RANK_BADGES[entry.rank] || <span className="text-navy-500 dark:text-navy-400">#{entry.rank}</span>}
                  {entry.rank > 3 && ''}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-edu-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-edu-accent font-bold text-xs">{entry.studentName.charAt(0)}</span>
                  </div>
                  <span className="text-navy-800 dark:text-white text-sm font-medium">{entry.studentName}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <span className="text-navy-800 dark:text-white font-semibold text-sm">
                  {entry.totalMarks}/{entry.maxTotalMarks}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <span className={`text-sm font-bold ${entry.percentage >= 80 ? 'text-green-600 dark:text-green-400' : entry.percentage >= 60 ? 'text-blue-600 dark:text-blue-400' : entry.percentage >= 40 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                  {entry.percentage}%
                </span>
              </TableCell>
              <TableCell className="text-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${GRADE_STYLES[entry.grade]}`}>
                  {entry.grade}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
