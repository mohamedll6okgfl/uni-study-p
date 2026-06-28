import { useMemo } from 'react';
import { usePlannerData } from '../context/PlannerContext';
import type { Assignment, Exam } from '../types';
import { daysUntil } from '../utils/date';

export interface CourseStats {
  courseId: string;
  totalAssignments: number;
  completedAssignments: number;
  completionRate: number; // 0-100
  totalEstimatedHrs: number;
  totalActualHrs: number;
  upcomingExamsCount: number;
  nextExamDate: string | null;
}

/**
 * Custom hook to calculate and memoize statistics for a specific course or all courses.
 */
export function useCourseStats(courseId?: string | null): Record<string, CourseStats> | CourseStats | null {
  const { data } = usePlannerData();

  const statsMap = useMemo(() => {
    const map: Record<string, CourseStats> = {};

    // Initialize map for all courses
    Object.keys(data.courses).forEach(cid => {
      map[cid] = {
        courseId: cid,
        totalAssignments: 0,
        completedAssignments: 0,
        completionRate: 0,
        totalEstimatedHrs: 0,
        totalActualHrs: 0,
        upcomingExamsCount: 0,
        nextExamDate: null,
      };
    });

    // Aggregate assignment stats
    Object.values(data.assignments).forEach((assignment: Assignment) => {
      const cid = assignment.courseId;
      if (!map[cid]) return;

      map[cid].totalAssignments += 1;
      if (assignment.status === 'done') {
        map[cid].completedAssignments += 1;
      }
      map[cid].totalEstimatedHrs += assignment.estimatedHrs || 0;
      map[cid].totalActualHrs += assignment.actualHrs || 0;
    });

    // Aggregate exam stats
    Object.values(data.exams).forEach((exam: Exam) => {
      const cid = exam.courseId;
      if (!map[cid]) return;

      const days = daysUntil(exam.date);
      if (days >= 0) {
        map[cid].upcomingExamsCount += 1;
        
        const currentNext = map[cid].nextExamDate;
        if (!currentNext || new Date(exam.date) < new Date(currentNext)) {
          map[cid].nextExamDate = exam.date;
        }
      }
    });

    // Calculate completion rates
    Object.keys(map).forEach(cid => {
      const total = map[cid].totalAssignments;
      map[cid].completionRate = total > 0
        ? Math.round((map[cid].completedAssignments / total) * 100)
        : 0;
    });

    return map;
  }, [data.courses, data.assignments, data.exams]);

  if (courseId) {
    return statsMap[courseId] || null;
  }

  return statsMap;
}

export default useCourseStats;
