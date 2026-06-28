import { useMemo } from 'react';
import { usePlannerData } from '../context/PlannerContext';
import type { Assignment, Exam } from '../types';
import { getWeekDays } from '../utils/date';

export interface CalendarDay {
  date:        Date;
  label:       string;       // "Mon 14"
  isToday:     boolean;
  assignments: Assignment[];
  exams:       Exam[];
  total:       number;
  overflow:    number;       // total - 3 if > 3, else 0
}

/**
 * Custom hook to generate a 7-day calendar week and populate each day with due assignments and exams.
 */
export function useWeeklyCalendar(weekStart: Date): CalendarDay[] {
  const { data } = usePlannerData();

  return useMemo(() => {
    const days = getWeekDays(weekStart);
    const todayStr = new Date().toISOString().slice(0, 10);

    return days.map(day => {
      const dayStr = day.toISOString().slice(0, 10);
      
      // Filter assignments due on this day
      const dayAssignments = Object.values(data.assignments).filter(
        a => a.dueDate === dayStr
      );

      // Filter exams scheduled on this day
      const dayExams = Object.values(data.exams).filter(
        e => e.date === dayStr
      );

      const total = dayAssignments.length + dayExams.length;
      const overflow = total > 3 ? total - 3 : 0;

      // Format label: e.g. "Mon 28"
      const label = day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });

      return {
        date: day,
        label,
        isToday: dayStr === todayStr,
        assignments: dayAssignments,
        exams: dayExams,
        total,
        overflow,
      };
    });
  }, [weekStart, data.assignments, data.exams]);
}

export default useWeeklyCalendar;
