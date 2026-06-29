import React from 'react';
import type { Priority, Status } from '../../types';
import { getCourseColorClasses } from '../../utils/color';

export type BadgeVariant = 'priority' | 'status' | 'course' | 'neutral';
export type BadgeSize    = 'sm' | 'md';

export interface BadgeProps {
  variant:  BadgeVariant;
  value:    string;           // the enum value or course color name
  size?:    BadgeSize;        // default: 'sm'
  dot?:     boolean;          // show colored dot before label
  pulse?:   boolean;          // animate-pulse
  className?: string;
}

const priorityMap: Record<Priority, { label: string; classes: string; dotClass: string }> = {
  low: {
    label: 'Low',
    classes: 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-brand-300/70 dark:border dark:border-brand-900/20',
    dotClass: 'bg-slate-400 dark:bg-brand-700',
  },
  medium: {
    label: 'Medium',
    classes: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 dark:border dark:border-blue-900/20',
    dotClass: 'bg-blue-500',
  },
  high: {
    label: 'High',
    classes: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 dark:border dark:border-amber-900/20',
    dotClass: 'bg-amber-500',
  },
  critical: {
    label: 'Critical',
    classes: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300 dark:border dark:border-red-900/20',
    dotClass: 'bg-red-500',
  },
};

const statusMap: Record<Status, { label: string; classes: string; dotClass: string }> = {
  todo: {
    label: 'To Do',
    classes: 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-brand-300/60 dark:border dark:border-brand-900/20',
    dotClass: 'bg-slate-400 dark:bg-brand-800',
  },
  in_progress: {
    label: 'In Progress',
    classes: 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 dark:border dark:border-brand-800/30',
    dotClass: 'bg-brand-500',
  },
  review: {
    label: 'Review',
    classes: 'bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300 dark:border dark:border-amber-900/20',
    dotClass: 'bg-amber-500',
  },
  done: {
    label: 'Done',
    classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border dark:border-emerald-900/20',
    dotClass: 'bg-emerald-500',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  variant,
  value,
  size = 'sm',
  dot = false,
  pulse = false,
  className = '',
}) => {
  let label = value;
  let badgeClasses = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  let dotColorClass = 'bg-slate-400';

  if (variant === 'priority') {
    const config = priorityMap[value as Priority] || priorityMap.low;
    label = config.label;
    badgeClasses = config.classes;
    dotColorClass = config.dotClass;
  } else if (variant === 'status') {
    const config = statusMap[value as Status] || statusMap.todo;
    label = config.label;
    badgeClasses = config.classes;
    dotColorClass = config.dotClass;
  } else if (variant === 'course') {
    const classes = getCourseColorClasses(value);
    badgeClasses = `${classes.bg} ${classes.text} border ${classes.border}`;
    dotColorClass = classes.solid.split(' ')[0]; // Extract bg class
  }

  const sizeStyle = size === 'sm' ? 'px-2 py-0.5 text-2xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`
        inline-flex items-center font-semibold rounded-full select-none
        ${badgeClasses}
        ${sizeStyle}
        ${pulse ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`
            w-1.5 h-1.5 rounded-full mr-1 shrink-0
            ${dotColorClass}
            ${pulse ? 'animate-ping' : ''}
          `}
        />
      )}
      {label}
    </span>
  );
};

export default Badge;
