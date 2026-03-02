import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface AttendanceChartProps {
  data: { date: string; present: number; absent: number }[];
}

const chartConfig = {
  present: { label: 'Present', color: '#22c55e' },
  absent: { label: 'Absent', color: '#ef4444' },
};

export default function AttendanceChart({ data }: AttendanceChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-navy-400 text-sm">
        No attendance data available
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-52 w-full">
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="present" fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
