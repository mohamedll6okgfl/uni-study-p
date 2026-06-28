import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarNav from './SidebarNav';
import IconRailNav from './IconRailNav';
import BottomNav from './BottomNav';
import TopBar from './TopBar';
import PomodoroWidget from '../shared/PomodoroWidget';
import GlobalSearch from '../shared/GlobalSearch';

export const AppShell: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[--bg-page] text-[--text-primary]">
      {/* Sidebar - Desktop */}
      <SidebarNav />

      {/* Icon Rail - Tablet */}
      <IconRailNav />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* TopBar - Mobile */}
        <TopBar />

        {/* Scrollable Content Pane */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-20 md:pb-6 lg:pb-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>

        {/* BottomNav - Mobile */}
        <BottomNav />
        
        {/* Floating Pomodoro Widget */}
        <PomodoroWidget />

        {/* Global Search Palette (Ctrl+K / Cmd+K) */}
        <GlobalSearch />
      </div>
    </div>
  );
};

export default AppShell;
