import React from 'react';
import { NavLink } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import NAV_ITEMS from './navigationData';
import ThemeToggle from '../shared/ThemeToggle';

export const IconRailNav: React.FC = () => {
  return (
    <aside className="hidden md:flex lg:hidden flex-col items-center w-16 h-screen bg-[--bg-sidebar] border-r border-[--border] shrink-0 py-4 justify-between">
      {/* Brand Icon */}
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/10 mb-6">
        <GraduationCap className="w-5 h-5" />
      </div>

      {/* Navigation Icons */}
      <nav className="flex-1 w-full px-2 space-y-2 flex flex-col items-center">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-150 group relative
              ${isActive
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'text-[--text-secondary] hover:text-[--text-primary] hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            
            {/* Tooltip */}
            <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 shadow-md">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / Theme Toggle */}
      <div className="flex flex-col items-center gap-4">
        <ThemeToggle />
        <div className="w-8 h-8 rounded-full bg-brand-200 dark:bg-brand-900 flex items-center justify-center text-xs font-bold text-brand-700 dark:text-brand-300">
          U
        </div>
      </div>
    </aside>
  );
};

export default IconRailNav;
