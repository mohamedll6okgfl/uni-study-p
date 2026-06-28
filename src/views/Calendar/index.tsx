import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ClipboardList, Clock } from 'lucide-react';
import { usePlannerData } from '../../context/PlannerContext';
import { useWeeklyCalendar } from '../../hooks/useWeeklyCalendar';
import type { CalendarDay } from '../../hooks/useWeeklyCalendar';
import { getStartOfWeek } from '../../utils/date';
import { getCourseColorClasses } from '../../utils/color';
import Button from '../../components/ui/Button';
import AssignmentForm from '../../components/forms/AssignmentForm';
import ExamForm from '../../components/forms/ExamForm';

export const Calendar: React.FC = () => {
  const { data } = usePlannerData();
  
  // Initialize to Monday of the current week
  const [currentWeekMonday, setCurrentWeekMonday] = useState<Date>(() => 
    getStartOfWeek(new Date())
  );

  const [isAssignmentFormOpen, setIsAssignmentFormOpen] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

  const [isExamFormOpen, setIsExamFormOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  const weekDays = useWeeklyCalendar(currentWeekMonday);

  const handlePrevWeek = () => {
    const prev = new Date(currentWeekMonday);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekMonday(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentWeekMonday);
    next.setDate(next.getDate() + 7);
    setCurrentWeekMonday(next);
  };

  const handleToday = () => {
    setCurrentWeekMonday(getStartOfWeek(new Date()));
  };

  const handleOpenAssignment = (id: string) => {
    setSelectedAssignmentId(id);
    setIsAssignmentFormOpen(true);
  };

  const handleOpenExam = (id: string) => {
    setSelectedExamId(id);
    setIsExamFormOpen(true);
  };

  // Get week range text: e.g. "Jun 22 – Jun 28, 2026"
  const getWeekRangeLabel = () => {
    const start = weekDays[0]?.date;
    const end = weekDays[6]?.date;
    if (!start || !end) return '';

    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    const startDay = start.getDate();
    const endDay = end.getDate();
    const startYear = start.getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} – ${endDay}, ${startYear}`;
    }
    return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${startYear}`;
  };

  return (
    <div className="space-y-6 select-none animate-[fadeIn_0.3s_ease-out]">
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[--text-primary]">
            Weekly Calendar
          </h1>
          <p className="text-xs text-[--text-secondary] mt-0.5">
            Visualize and manage your class events, homework deadlines, and exams.
          </p>
        </div>
        
        {/* Calendar Nav Controls */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="xs" onClick={handleToday}>
            Today
          </Button>
          <div className="flex items-center border border-[--border] rounded-lg bg-[--bg-card] p-0.5">
            <button
              onClick={handlePrevWeek}
              className="p-1 rounded-md text-[--text-secondary] hover:text-[--text-primary] hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Previous week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextWeek}
              className="p-1 rounded-md text-[--text-secondary] hover:text-[--text-primary] hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Next week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs font-bold text-[--text-primary] tracking-tight ml-2">
            {getWeekRangeLabel()}
          </span>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 min-h-[480px]">
        {weekDays.map((day: CalendarDay, index: number) => {
          return (
            <div
              key={index}
              className={`
                flex flex-col flex-1 border border-[--border] rounded-2xl p-3 bg-slate-50/20 dark:bg-slate-900/5 transition-all
                ${day.isToday ? 'bg-brand-50/10 border-brand-300 dark:border-brand-900/30 ring-1 ring-brand-500/10' : ''}
              `}
            >
              {/* Day Header */}
              <div className="text-center pb-2.5 mb-3 border-b border-[--border]">
                <span
                  className={`
                    inline-block px-2.5 py-1 text-xs font-bold rounded-full select-none
                    ${day.isToday
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-[--text-secondary]'
                    }
                  `}
                >
                  {day.label}
                </span>
              </div>

              {/* Day Events List */}
              <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[400px] pr-0.5">
                {day.total === 0 ? (
                  <div className="h-full flex items-center justify-center py-12 text-[10px] text-[--text-muted] font-medium italic">
                    No events
                  </div>
                ) : (
                  <>
                    {/* Render Exams first (higher priority) */}
                    {day.exams.map(exam => {
                      const course = data.courses[exam.courseId];
                      const colors = getCourseColorClasses(course?.color || 'indigo');
                      
                      return (
                        <div
                          key={exam.id}
                          onClick={() => handleOpenExam(exam.id)}
                          className={`
                            p-2 rounded-xl border text-2xs cursor-pointer select-none transition-all hover:scale-[1.02] shadow-sm
                            ${colors.bg} ${colors.text} ${colors.border}
                          `}
                          title={`Exam: ${exam.title}`}
                        >
                          <div className="flex items-center gap-1 font-bold truncate">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            <span>{exam.title}</span>
                          </div>
                          <p className="text-[9px] opacity-75 mt-0.5 font-medium">
                            {exam.startTime} · {exam.location || 'No Loc'}
                          </p>
                        </div>
                      );
                    })}

                    {/* Render Assignments */}
                    {day.assignments.map(assign => {
                      const course = data.courses[assign.courseId];
                      const colors = getCourseColorClasses(course?.color || 'indigo');
                      const isDone = assign.status === 'done';

                      return (
                        <div
                          key={assign.id}
                          onClick={() => handleOpenAssignment(assign.id)}
                          className={`
                            p-2 rounded-xl border text-2xs cursor-pointer select-none transition-all hover:scale-[1.02] shadow-sm
                            ${isDone
                              ? 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800/40 dark:text-slate-500 dark:border-slate-800 line-through'
                              : `${colors.bg} ${colors.text} ${colors.border}`
                            }
                          `}
                          title={`Assignment: ${assign.title}`}
                        >
                          <div className="flex items-center gap-1 font-bold truncate">
                            <ClipboardList className="w-3.5 h-3.5 shrink-0" />
                            <span>{assign.title}</span>
                          </div>
                          <p className="text-[9px] opacity-75 mt-0.5 font-medium">
                            Due at {assign.dueTime}
                          </p>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Forms Modals */}
      <AssignmentForm
        isOpen={isAssignmentFormOpen}
        onClose={() => setIsAssignmentFormOpen(false)}
        assignmentId={selectedAssignmentId}
      />

      <ExamForm
        isOpen={isExamFormOpen}
        onClose={() => setIsExamFormOpen(false)}
        examId={selectedExamId}
      />
    </div>
  );
};

export default Calendar;
