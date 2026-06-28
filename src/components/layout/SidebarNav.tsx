import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';
import { usePlannerUI } from '../../context/PlannerContext';
import NAV_ITEMS from './navigationData';
import ThemeToggle from '../shared/ThemeToggle';

export const SidebarNav: React.FC = () => {
  const { ui, dispatch } = usePlannerUI();
  const collapsed = ui.sidebarCollapsed;

  const toggleCollapse = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  return (
    <aside
      className={`
        hidden lg:flex flex-col h-screen bg-[--bg-sidebar] border-r border-[--border] transition-all duration-300 shrink-0
        ${collapsed ? 'w-20' : 'w-60'}
      `}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[--border]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-500 text-white shrink-0 shadow-md shadow-brand-500/10">
            <GraduationCap className="w-5 h-5" />
          </div>
          {!collapsed && (
            <span className="font-bold text-base text-[--text-primary] tracking-tight whitespace-nowrap animate-[fadeIn_0.2s_ease-out]">
              UniPlan
            </span>
          )}
        </div>
        
        {!collapsed && <ThemeToggle />}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative
              ${isActive
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'text-[--text-secondary] hover:text-[--text-primary] hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }
            `}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            
            {!collapsed && (
              <span className="truncate animate-[fadeIn_0.2s_ease-out]">
                {item.label}
              </span>
            )}

            {/* Tooltip on collapsed */}
            {collapsed && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 shadow-md">
                {item.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Collapse Trigger */}
      <div className="p-3 border-t border-[--border] flex items-center justify-between gap-2">
        {collapsed && (
          <div className="w-full flex justify-center">
            <ThemeToggle />
          </div>
        )}
        
        {!collapsed && (
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-brand-200 dark:bg-brand-900 flex items-center justify-center text-xs font-bold text-brand-700 dark:text-brand-300">
              U
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-xs font-semibold text-[--text-primary] truncate">User Account</p>
              <p className="text-[10px] text-[--text-secondary] truncate">Student Workspace</p>
            </div>
          </div>
        )}

        <button
          onClick={toggleCollapse}
          className="p-1.5 rounded-lg text-[--text-secondary] hover:text-[--text-primary] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};

export default SidebarNav;
