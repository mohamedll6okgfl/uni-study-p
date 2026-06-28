import React from 'react';
import { useCountdown } from '../../hooks/useCountdown';

export interface CountdownBadgeProps {
  targetDate:  string;   // ISO 8601 datetime
  label?:      string;   // overrides auto-generated text
  compact?:    boolean;  // shows only "3d 4h" instead of full breakdown
  showSeconds?: boolean; // default: false
  className?: string;
}

export const CountdownBadge: React.FC<CountdownBadgeProps> = ({
  targetDate,
  label,
  compact = false,
  showSeconds = false,
  className = '',
}) => {
  const { days, hours, minutes, seconds, urgency, expired } = useCountdown(targetDate);

  if (expired) {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 animate-pulse ${className}`}>
        Overdue
      </span>
    );
  }

  const urgencyClasses = {
    safe:     'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
    warning:  'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400',
    critical: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400 animate-pulse',
  }[urgency];

  const renderText = () => {
    if (label) return `${label} ${days}d ${hours}h`;

    if (compact) {
      if (days > 0) return `${days}d ${hours}h`;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    }

    let text = `${days}d ${hours}h ${minutes}m`;
    if (showSeconds) {
      text += ` ${seconds}s`;
    }
    return text;
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold ${urgencyClasses} ${className}`}>
      {renderText()}
    </span>
  );
};

export default CountdownBadge;
