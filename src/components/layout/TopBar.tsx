import React from 'react';
import { GraduationCap } from 'lucide-react';
import ThemeToggle from '../shared/ThemeToggle';

export const TopBar: React.FC = () => {
  return (
    <header className="md:hidden sticky top-0 left-0 right-0 h-14 bg-[--bg-card]/90 backdrop-blur-md border-b border-[--border] flex items-center justify-between px-4 z-40 shadow-sm">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-sm shrink-0 transition-transform duration-200 hover:scale-105 cursor-pointer">
          <GraduationCap className="w-4 h-4" />
        </div>
        <span className="font-bold text-sm text-amber-300 tracking-tight transition-colors duration-200 hover:text-amber-200">
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
