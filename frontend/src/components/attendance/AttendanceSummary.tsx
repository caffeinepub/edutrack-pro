import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { AttendanceSummary as AttendanceSummaryType } from '../../types/attendance';
import { CheckCircle, XCircle, Percent } from 'lucide-react';

interface AttendanceSummaryProps {
  summary: AttendanceSummaryType;
}

const chartConfig = {
  present: { label: 'Present', color: '#22c55e' },
  absent: { label: 'Absent', color: '#ef4444' },
};

export default function AttendanceSummaryComponent({ summary }: AttendanceSummaryProps) {
  const data = [
    { name: 'Present', value: summary.totalPresent },
    { name: 'Absent', value: summary.totalAbsent },
  ].filter((d) => d.value > 0);

  return (
    <div className="bg-white dark:bg-navy-800 rounded-2xl border border-navy-100 dark:border-navy-700 p-5">
      <h3 className="text-navy-800 dark:text-white font-semibold text-sm mb-4">Attendance Summary</h3>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
          <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{summary.totalPresent}</p>
          <p className="text-xs text-navy-500 dark:text-navy-400">Present</p>
        </div>
        <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
          <XCircle className="w-5 h-5 text-red-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{summary.totalAbsent}</p>
          <p className="text-xs text-navy-500 dark:text-navy-400">Absent</p>
        </div>
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <Percent className="w-5 h-5 text-edu-accent mx-auto mb-1" />
          <p className="text-2xl font-bold text-edu-accent">{summary.attendancePercentage}%</p>
          <p className="text-xs text-navy-500 dark:text-navy-400">Rate</p>
        </div>
      </div>
      {data.length > 0 && (
        <ChartContainer config={chartConfig} className="h-44 w-full">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
              <Cell fill="#22c55e" />
              <Cell fill="#ef4444" />
            </Pie>
            <Tooltip content={<ChartTooltipContent />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ChartContainer>
      )}
    </div>
  );
}
