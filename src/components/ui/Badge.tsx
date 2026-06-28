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
    classes: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    dotClass: 'bg-slate-400',
  },
  medium: {
    label: 'Medium',
    classes: 'bg-info-100 text-info-900 dark:bg-blue-900/40 dark:text-blue-300',
    dotClass: 'bg-info-500',
  },
  high: {
    label: 'High',
    classes: 'bg-warning-100 text-warning-900 dark:bg-yellow-900/40 dark:text-yellow-300',
    dotClass: 'bg-warning-500',
  },
  critical: {
    label: 'Critical',
    classes: 'bg-danger-100 text-danger-900 dark:bg-red-900/40 dark:text-red-300',
    dotClass: 'bg-danger-500',
  },
};

const statusMap: Record<Status, { label: string; classes: string; dotClass: string }> = {
  todo: {
    label: 'To Do',
    classes: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    dotClass: 'bg-slate-400',
  },
  in_progress: {
    label: 'In Progress',
    classes: 'bg-brand-100 text-brand-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    dotClass: 'bg-brand-500',
  },
  review: {
    label: 'Review',
    classes: 'bg-warning-100 text-warning-950 dark:bg-yellow-950/30 dark:text-yellow-400',
    dotClass: 'bg-warning-500',
  },
  done: {
    label: 'Done',
    classes: 'bg-success-100 text-success-900 dark:bg-green-900/40 dark:text-green-300',
    dotClass: 'bg-success-500',
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
