import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { usePlannerUI } from '../../context/PlannerContext';

export const ThemeToggle: React.FC = () => {
  const { ui, dispatch } = usePlannerUI();

  const handleToggle = () => {
    // Cycle: light -> dark -> system -> light
    const currentTheme = ui.theme;
    let nextTheme: 'light' | 'dark' | 'system';

    if (currentTheme === 'light') {
      nextTheme = 'dark';
    } else if (currentTheme === 'dark') {
      nextTheme = 'system';
    } else {
      nextTheme = 'light';
    }

    dispatch({ type: 'SET_THEME', payload: nextTheme });
  };

  const renderIcon = () => {
    switch (ui.theme) {
      case 'light':
        return <Sun className="w-5 h-5 text-amber-500 transition-transform hover:rotate-45" />;
      case 'dark':
        return <Moon className="w-5 h-5 text-indigo-400 transition-transform hover:-rotate-12" />;
      case 'system':
        return <Laptop className="w-5 h-5 text-slate-500 dark:text-slate-400" />;
    }
  };

  const getThemeLabel = () => {
    switch (ui.theme) {
      case 'light': return 'Light theme';
      case 'dark': return 'Dark theme';
      case 'system': return 'System theme';
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-150 relative group"
      aria-label={getThemeLabel()}
      title={`Current: ${ui.theme}. Click to change.`}
    >
      <div className="relative z-10">{renderIcon()}</div>
      
      {/* Subtle tooltip */}
      <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 shadow-md">
        {ui.theme.charAt(0).toUpperCase() + ui.theme.slice(1)} Mode
      </span>
    </button>
  );
};

export default ThemeToggle;
