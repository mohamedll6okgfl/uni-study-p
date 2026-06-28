import React from 'react';
import { GraduationCap } from 'lucide-react';
import ThemeToggle from '../shared/ThemeToggle';

export const TopBar: React.FC = () => {
  return (
    <header className="md:hidden sticky top-0 left-0 right-0 h-14 bg-[--bg-card]/90 backdrop-blur-md border-b border-[--border] flex items-center justify-between px-4 z-40 shadow-sm">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-500 text-white shadow-md shadow-brand-500/10 shrink-0">
          <GraduationCap className="w-4 h-4" />
        </div>
        <span className="font-bold text-sm text-[--text-primary] tracking-tight">
          UniPlan
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default TopBar;
