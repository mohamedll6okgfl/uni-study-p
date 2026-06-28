import React from 'react';
import { usePlannerData } from '../../context/PlannerContext';
import { useCourseStats } from '../../hooks/useCourseStats';
import type { CourseStats } from '../../hooks/useCourseStats';
import { getCourseColorClasses } from '../../utils/color';
import ProgressBar from '../../components/ui/ProgressBar';

export const WeeklyProgressBar: React.FC = () => {
  const { data } = usePlannerData();
  const stats = useCourseStats() as Record<string, CourseStats>;

  const courseList = Object.values(data.courses).filter(c => !c.isArchived);

  if (courseList.length === 0) {
    return (
      <div className="py-4 text-xs text-[--text-secondary] text-center">
        No courses added yet.
      </div>
    );
  }

  return (
    <div className="space-y-4 select-none">
      {courseList.map(course => {
        const courseStat = stats[course.id] || {
          completedAssignments: 0,
          totalAssignments: 0,
          completionRate: 0,
        };

        const colors = getCourseColorClasses(course.color);

        return (
          <div key={course.id} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${colors.solid.split(' ')[0]}`} />
                <span className="text-xs font-bold text-[--text-primary] truncate">
                  {course.name}
                </span>
                <span className="text-[10px] text-[--text-secondary] font-mono shrink-0">
                  {course.code}
                </span>
              </div>
              
              <span className="text-2xs font-semibold text-[--text-secondary] shrink-0">
                {courseStat.completedAssignments}/{courseStat.totalAssignments} done
              </span>
            </div>

            <ProgressBar
              value={courseStat.completionRate}
              color={course.color as any} // map colors or use default
              size="sm"
            />
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyProgressBar;
