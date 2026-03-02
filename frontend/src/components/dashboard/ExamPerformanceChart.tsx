import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface ExamPerformanceChartProps {
  gradeData: { grade: string; count: number }[];
}

const GRADE_COLORS: Record<string, string> = {
  A: '#22c55e',
  B: '#3b82f6',
  C: '#f59e0b',
  Fail: '#ef4444',
};

const chartConfig = {
  A: { label: 'Grade A', color: '#22c55e' },
  B: { label: 'Grade B', color: '#3b82f6' },
  C: { label: 'Grade C', color: '#f59e0b' },
  Fail: { label: 'Fail', color: '#ef4444' },
};

export default function ExamPerformanceChart({ gradeData }: ExamPerformanceChartProps) {
  if (gradeData.length === 0 || gradeData.every((d) => d.count === 0)) {
    return (
      <div className="flex items-center justify-center h-48 text-navy-400 text-sm">
        No exam data available
      </div>
    );
  }

  const filtered = gradeData.filter((d) => d.count > 0);

  return (
    <ChartContainer config={chartConfig} className="h-52 w-full">
      <PieChart>
        <Pie
          data={filtered}
          dataKey="count"
          nameKey="grade"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ grade, percent }) => `${grade} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {filtered.map((entry) => (
            <Cell key={entry.grade} fill={GRADE_COLORS[entry.grade] || '#94a3b8'} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltipContent />} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ChartContainer>
  );
}
