import React from 'react';
import { Edit2, Trash2, Calendar, MapPin, User, GraduationCap, Clock } from 'lucide-react';
import type { Course } from '../../types';
import { getCourseColorClasses } from '../../utils/color';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';
import { useCourseStats } from '../../hooks/useCourseStats';
import type { CourseStats } from '../../hooks/useCourseStats';

export interface CourseCardProps {
  course: Course;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onClick,
  onEdit,
  onDelete,
}) => {
  const colors = getCourseColorClasses(course.color);
  const stats = useCourseStats(course.id) as CourseStats | null;

  const displayStats = stats || {
    totalAssignments: 0,
    completedAssignments: 0,
    completionRate: 0,
    upcomingExamsCount: 0,
    totalActualHrs: 0,
  };

  const formatScheduleDays = (days: string[]) => {
    if (days.length === 0) return 'No days scheduled';
    return days.join('/');
  };

  return (
    <Card
      hover
      onClick={onClick}
      padding="md"
      className="flex flex-col justify-between h-72 border-t-4 hover:border-brand-500 transition-all duration-200 group"
      style={{ borderTopColor: colors.solid.split(' ')[0] ? undefined : 'var(--accent)' }}
    >
      <div>
        {/* Top Header info */}
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0">
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1.5 ${colors.bg} ${colors.text}`}>
              {course.code}
            </span>
            <h3 className="text-base font-bold text-[--text-primary] truncate group-hover:text-brand-500 transition-colors">
              {course.name}
            </h3>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(e);
              }}
              className="p-1.5 rounded-lg text-[--text-secondary] hover:text-[--text-primary] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Course"
              aria-label="Edit Course"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(e);
              }}
              className="p-1.5 rounded-lg text-danger-500 hover:text-danger-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              title="Delete Course"
              aria-label="Delete Course"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Schedule Info */}
        <div className="mt-4 space-y-2 text-xs text-[--text-secondary]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[--text-muted]" />
            <span>
              {formatScheduleDays(course.schedule.days)} · {course.schedule.startTime}–{course.schedule.endTime}
            </span>
          </div>
          {course.schedule.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[--text-muted]" />
              <span className="truncate">{course.schedule.location}</span>
            </div>
          )}
          {course.instructor && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[--text-muted]" />
              <span className="truncate">{course.instructor}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress & Credits */}
      <div className="mt-6 space-y-3">
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold text-[--text-secondary]">
            <span>ASSIGNMENTS</span>
            <span>{displayStats.completedAssignments}/{displayStats.totalAssignments} DONE</span>
          </div>
          <ProgressBar value={displayStats.completionRate} color={course.color as any} size="xs" />
        </div>

        {/* Footer info: credits & exams */}
        <div className="flex items-center justify-between text-[10px] font-semibold text-[--text-secondary] border-t border-[--border] pt-2">
          <span className="flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-[--text-muted]" />
            {course.credits} Credits
          </span>
          {displayStats.upcomingExamsCount > 0 && (
            <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-bold">
              <Clock className="w-3.5 h-3.5" />
              {displayStats.upcomingExamsCount} Exam{displayStats.upcomingExamsCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
