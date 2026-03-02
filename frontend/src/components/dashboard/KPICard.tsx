import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'purple';
  animationDelay?: number;
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'bg-edu-accent text-white',
    value: 'text-edu-accent',
    border: 'border-blue-100 dark:border-blue-800/30',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    icon: 'bg-green-500 text-white',
    value: 'text-green-600 dark:text-green-400',
    border: 'border-green-100 dark:border-green-800/30',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    icon: 'bg-orange-500 text-white',
    value: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-100 dark:border-orange-800/30',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    icon: 'bg-purple-500 text-white',
    value: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-100 dark:border-purple-800/30',
  },
};

export default function KPICard({ title, value, subtitle, icon: Icon, color, animationDelay = 0 }: KPICardProps) {
  const colors = colorMap[color];
  return (
    <div
      className={`rounded-2xl border ${colors.border} ${colors.bg} p-5 flex items-start gap-4 animate-slide-up shadow-sm hover:shadow-md transition-shadow duration-200`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className={`w-12 h-12 rounded-xl ${colors.icon} flex items-center justify-center flex-shrink-0 shadow-sm`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="min-w-0">
        <p className="text-navy-500 dark:text-navy-400 text-xs font-medium uppercase tracking-wide">{title}</p>
        <p className={`text-2xl font-bold mt-0.5 ${colors.value}`}>{value}</p>
        {subtitle && <p className="text-navy-400 dark:text-navy-500 text-xs mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
