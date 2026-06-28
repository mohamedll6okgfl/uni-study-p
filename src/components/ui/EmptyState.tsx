import React from 'react';
import Button from './Button';

export interface EmptyStateProps {
  icon:        React.ReactNode;  // Lucide icon
  title:       string;
  description: string;
  action?: {
    label:   string;
    onClick: () => void;
  };
  secondaryAction?: {
    label:   string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center select-none max-w-md mx-auto">
      {/* Icon Wrapper */}
      <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl p-4 w-16 h-16 mb-5 shrink-0 shadow-sm">
        {React.isValidElement(icon) ? (
          React.cloneElement(icon as React.ReactElement<any>, { className: 'w-8 h-8' })
        ) : (
          icon
        )}
      </div>

      {/* Title & Description */}
      <h3 className="text-base font-semibold text-[--text-primary] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[--text-secondary] mb-6 leading-relaxed">
        {description}
      </p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {secondaryAction && (
            <Button
              variant="secondary"
              size="sm"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
          {action && (
            <Button
              variant="primary"
              size="sm"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
