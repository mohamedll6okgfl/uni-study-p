import React from 'react';
import StatsGrid from './StatsGrid';
import UpcomingList from './UpcomingList';
import WeeklyProgressBar from './WeeklyProgressBar';
import Card from '../../components/ui/Card';

export const Dashboard: React.FC = () => {
  // Get current date string: e.g. "Saturday, Jun 28"
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // Get current hour for greeting
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
  } else if (hour >= 17) {
    greeting = 'Good evening';
  }

  return (
    <div className="space-y-6 select-none animate-[fadeIn_0.3s_ease-out]">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[--text-primary]">
            {greeting}, Alex 👋
          </h1>
          <p className="text-xs text-[--text-secondary] mt-0.5">
            Here is your academic overview for today.
          </p>
        </div>
        <div className="px-3 py-1.5 bg-[--bg-card] border border-[--border] rounded-xl text-xs font-semibold text-[--text-secondary] shadow-sm self-start shrink-0">
          {formattedDate}
        </div>
      </div>

      {/* Stats KPI Grid */}
      <StatsGrid />

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upcoming Assignments/Exams */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[--text-primary] tracking-tight">
              Upcoming Schedule
            </h2>
          </div>
          <UpcomingList />
        </div>

        {/* Right Column: Weekly Progress & Quick Notes */}
        <div className="space-y-6">
          <Card padding="md" className="space-y-4">
            <h2 className="text-base font-bold text-[--text-primary] tracking-tight border-b border-[--border] pb-3">
              Weekly Progress
            </h2>
            <WeeklyProgressBar />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
