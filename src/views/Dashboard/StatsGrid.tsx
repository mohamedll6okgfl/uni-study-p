import React, { useMemo } from 'react';
import { ClipboardList, Calendar, Timer, CheckCircle2 } from 'lucide-react';
import { usePlannerData } from '../../context/PlannerContext';
import { daysUntil } from '../../utils/date';
import Card from '../../components/ui/Card';

export const StatsGrid: React.FC = () => {
  const { data } = usePlannerData();

  const dueSoonCount = useMemo(() => {
    return Object.values(data.assignments).filter(
      a => a.status !== 'done' && daysUntil(a.dueDate) >= 0 && daysUntil(a.dueDate) <= 7
    ).length;
  }, [data.assignments]);

  const upcomingExamsCount = useMemo(() => {
    return Object.values(data.exams).filter(
      e => daysUntil(e.date) >= 0 && daysUntil(e.date) <= 14
    ).length;
  }, [data.exams]);

  const todayStudyHours = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const mins = Object.values(data.assignments)
      .flatMap(a => a.studySessions)
      .filter(s => s.startTime.startsWith(today))
      .reduce((sum, s) => sum + s.durationMins, 0);
    return (mins / 60).toFixed(1);
  }, [data.assignments]);

  const completionRate = useMemo(() => {
    const assignments = Object.values(data.assignments);
    if (assignments.length === 0) return 0;
    const done = assignments.filter(a => a.status === 'done').length;
    return Math.round((done / assignments.length) * 100);
  }, [data.assignments]);

  const statCards = [
    {
      title: 'Due Soon',
      value: dueSoonCount,
      subtitle: 'Assignments in 7 days',
      icon: <ClipboardList className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />,
      bgIcon: 'bg-indigo-50 dark:bg-indigo-950/30',
    },
    {
      title: 'Upcoming Exams',
      value: upcomingExamsCount,
      subtitle: 'Scheduled in 14 days',
      icon: <Calendar className="w-5 h-5 text-teal-500 dark:text-teal-400" />,
      bgIcon: 'bg-teal-50 dark:bg-teal-950/30',
    },
    {
      title: 'Study Today',
      value: `${todayStudyHours}h`,
      subtitle: 'Total focus logged today',
      icon: <Timer className="w-5 h-5 text-amber-500 dark:text-amber-400" />,
      bgIcon: 'bg-amber-50 dark:bg-amber-950/30',
    },
    {
      title: 'Task Progress',
      value: `${completionRate}%`,
      subtitle: 'Assignments completed',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />,
      bgIcon: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, idx) => (
        <Card key={idx} padding="md" className="flex flex-col justify-between h-32 relative overflow-hidden group hover:border-brand-300 dark:hover:border-brand-800 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[--text-secondary]">
              {stat.title}
            </span>
            <div className={`p-2 rounded-xl shrink-0 ${stat.bgIcon}`}>
              {stat.icon}
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl md:text-3xl font-bold text-[--text-primary] tracking-tight tabular-nums">
              {stat.value}
            </span>
            <p className="text-[10px] text-[--text-secondary] mt-1 truncate">
              {stat.subtitle}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsGrid;
