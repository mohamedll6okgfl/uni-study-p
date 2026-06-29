import React from 'react';

export type ProgressColor = 'brand' | 'success' | 'warning' | 'danger';

export interface ProgressBarProps {
  value:      number;         // 0–100
  max?:       number;         // default: 100
  color?:     ProgressColor;  // default: 'brand'
  size?:      'xs' | 'sm' | 'md';  // height: 2px | 4px | 8px
  animated?:  boolean;        // shimmer animation
  label?:     string;         // accessible aria-label
  showValue?: boolean;        // renders "73%" text to the right
}

const colorClasses: Record<ProgressColor, string> = {
  brand:   'bg-brand-500 dark:bg-brand-400 dark:shadow-[0_0_6px_rgba(52,211,153,0.3)]',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger:  'bg-danger-500',
};

const heightClasses = {
  xs: 'h-1',
  sm: 'h-2',
  md: 'h-3',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'brand',
  size = 'sm',
  animated = false,
  label,
  showValue = false,
}) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const roundedPct = Math.round(pct);

  return (
    <div className="flex items-center w-full gap-3 select-none">
      <div
        className={`
          flex-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border dark:border-brand-900/20
          ${heightClasses[size]}
        `}
        role="progressbar"
        aria-valuenow={roundedPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          style={{ width: `${pct}%` }}
          className={`
            h-full rounded-full transition-[width] duration-500 ease-out
            ${colorClasses[color]}
            ${animated ? 'relative overflow-hidden' : ''}
          `}
        >
          {animated && (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_infinite]" />
          )}
        </div>
      </div>
      
      {showValue && (
        <span className="text-xs font-semibold text-[--text-secondary] tabular-nums shrink-0 min-w-[2.5rem] text-right">
          {roundedPct}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
