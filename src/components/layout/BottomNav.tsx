import React from 'react';
import { NavLink } from 'react-router-dom';
import NAV_ITEMS from './navigationData';

export const BottomNav: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[--bg-card]/95 backdrop-blur-md border-t border-[--border] flex items-center justify-around z-40 px-1 shadow-lg pb-safe">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-semibold transition-all duration-150
            ${isActive
              ? 'text-brand-400'
              : 'text-[--text-secondary] hover:text-[--text-primary]'
            }
          `}
        >
          <item.icon className="w-5 h-5 mb-1" />
          <span className="truncate max-w-[50px]">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
