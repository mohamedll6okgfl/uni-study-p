import React, { useMemo } from 'react';
import { Play, Calendar, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { usePlannerData } from '../../context/PlannerContext';
import { usePomodoro } from '../../hooks/usePomodoro';
import { daysUntil, formatDate } from '../../utils/date';
import { getCourseColorClasses } from '../../utils/color';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import CountdownBadge from '../../components/shared/CountdownBadge';

export const UpcomingList: React.FC = () => {
  const { data, dispatch: dataDispatch } = usePlannerData();
  const { start: startPomodoro, isActive: isPomodoroActive, assignmentId: activePomodoroId } = usePomodoro();

  const upcomingItems = useMemo(() => {
    const list: Array<
      | { type: 'assignment'; id: string; date: string; time: string; item: any }
      | { type: 'exam'; id: string; date: string; time: string; item: any }
    > = [];

    // Add active assignments due in next 14 days
    Object.values(data.assignments).forEach(a => {
      const days = daysUntil(a.dueDate);
      if (a.status !== 'done' && days >= -2 && days <= 14) {
        list.push({
          type: 'assignment',
          id: a.id,
          date: a.dueDate,
          time: a.dueTime,
          item: a,
        });
      }
    });

    // Add exams in next 14 days
    Object.values(data.exams).forEach(e => {
      const days = daysUntil(e.date);
      if (days >= 0 && days <= 14) {
        list.push({
          type: 'exam',
          id: e.id,
          date: e.date,
          time: e.startTime,
          item: e,
        });
      }
    });

    // Sort by date then time
    list.sort((a, b) => {
      const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return a.time.localeCompare(b.time);
    });

    return list.slice(0, 5); // Show top 5 urgent items
  }, [data.assignments, data.exams]);

  const handleToggleComplete = (assignmentId: string) => {
    const isDone = data.assignments[assignmentId]?.status === 'done';
    dataDispatch({
      type: 'UPDATE_ASSIGNMENT',
      payload: {
        id: assignmentId,
        changes: { status: isDone ? 'todo' : 'done' },
      },
    });
  };

  if (upcomingItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-[--bg-card] border border-[--border] rounded-2xl text-center">
        <span className="text-3xl mb-2">🎉</span>
        <h4 className="text-sm font-semibold text-[--text-primary]">You're all caught up!</h4>
        <p className="text-xs text-[--text-secondary] mt-1">No assignments or exams in the next 14 days.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {upcomingItems.map(item => {
        if (item.type === 'assignment') {
          const a = item.item;
          const course = data.courses[a.courseId];
          const colors = getCourseColorClasses(course?.color || 'indigo');
          const isCurrentlyTicking = isPomodoroActive && activePomodoroId === a.id;

          return (
            <Card
              key={a.id}
              padding="sm"
              className="flex items-center justify-between gap-4 hover:border-brand-300 dark:hover:border-brand-800 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Custom Checkbox */}
                <button
                  onClick={() => handleToggleComplete(a.id)}
                  className="flex items-center justify-center w-5 h-5 rounded-md border border-[--border] hover:border-brand-500 text-transparent hover:text-brand-500 transition-all"
                  aria-label="Mark assignment as done"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div className="min-w-0">
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider mb-1 ${colors.bg} ${colors.text}`}>
                    {course?.code || 'GEN'}
                  </span>
                  <h4 className="text-sm font-semibold text-[--text-primary] truncate">
                    {a.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-2xs text-[--text-secondary]">
                    <span className="flex items-center gap-0.5 shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      Due {formatDate(a.dueDate)} at {a.dueTime}
                    </span>
                    <span>•</span>
                    <Badge variant="priority" value={a.priority} className="py-0" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Live Countdown */}
                <CountdownBadge targetDate={`${a.dueDate}T${a.dueTime}`} compact />

                {/* Quick Pomodoro Trigger */}
                <button
                  onClick={() => startPomodoro(a.id)}
                  disabled={isCurrentlyTicking}
                  className={`
                    p-2 rounded-xl border border-[--border] transition-all
                    ${isCurrentlyTicking
                      ? 'bg-brand-50 border-brand-200 text-brand-500 dark:bg-brand-950/20 dark:border-brand-900/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-brand-500 text-[--text-secondary]'
                    }
                  `}
                  title={isCurrentlyTicking ? 'Focus session active' : 'Start Focus Session'}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </Card>
          );
        } else {
          // Exam Card
          const e = item.item;
          const course = data.courses[e.courseId];
          const colors = getCourseColorClasses(course?.color || 'indigo');

          return (
            <Card
              key={e.id}
              padding="sm"
              className="flex items-center justify-between gap-4 border-l-4 hover:border-brand-300 dark:hover:border-brand-800 transition-colors"
              style={{ borderLeftColor: colors.solid.split(' ')[0] ? undefined : 'var(--accent)' }}
            >
              <div className="min-w-0">
                <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider mb-1 ${colors.bg} ${colors.text}`}>
                  {course?.code || 'GEN'}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  <h4 className="text-sm font-semibold text-[--text-primary] truncate">
                    {e.title} ({e.type.toUpperCase()})
                  </h4>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-2xs text-[--text-secondary]">
                  <span className="flex items-center gap-0.5 shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(e.date)} at {e.startTime}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                    {e.location}
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-brand-500">{e.weight}% of grade</span>
                </div>
              </div>

              <div className="shrink-0">
                {/* Live Countdown */}
                <CountdownBadge targetDate={`${e.date}T${e.startTime}`} />
              </div>
            </Card>
          );
        }
      })}
    </div>
  );
};

export default UpcomingList;
