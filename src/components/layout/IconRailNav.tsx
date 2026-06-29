import React from 'react';
import { NavLink } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import NAV_ITEMS from './navigationData';
import ThemeToggle from '../shared/ThemeToggle';

export const IconRailNav: React.FC = () => {
  return (
    <aside className="hidden md:flex lg:hidden flex-col items-center w-16 h-screen bg-[--bg-sidebar] border-r border-[--border] shrink-0 py-4 justify-between">
      {/* Brand Icon */}
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-sm transition-transform duration-200 hover:scale-105 cursor-pointer mb-6 animate-[fadeIn_0.2s_ease-out]">
        <GraduationCap className="w-5 h-5" />
      </div>

      {/* Navigation Icons */}
      <nav className="flex-1 w-full px-2 space-y-2 flex flex-col items-center">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 group relative
              ${isActive
                ? 'bg-emerald-500/10 text-emerald-400 font-medium border-l-2 border-emerald-400 rounded-l-none'
                : 'text-emerald-700/70 hover:text-emerald-50 hover:bg-emerald-500/5'
              }
            `}
          >
            <item.icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
            
            {/* Tooltip */}
            <span className="absolute left-full ml-3 px-2 py-1 bg-[#0a0f0b] text-emerald-300 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 shadow-md border border-brand-900/40">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / Theme Toggle */}
      <div className="flex flex-col items-center gap-4">
        <ThemeToggle />
        <div className="w-8 h-8 rounded-full bg-brand-900/60 border border-brand-700/40 flex items-center justify-center text-xs font-bold text-brand-300">
          U
        </div>
      </div>
    </aside>
  );
};

export default IconRailNav;
