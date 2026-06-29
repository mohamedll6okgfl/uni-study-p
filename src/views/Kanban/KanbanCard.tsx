import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Play, Edit2, Clock, Trash2 } from 'lucide-react';
import type { Assignment, Course } from '../../types';
import { getCourseColorClasses } from '../../utils/color';
import { formatDate } from '../../utils/date';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import CountdownBadge from '../../components/shared/CountdownBadge';
import { usePomodoro } from '../../hooks/usePomodoro';

export interface KanbanCardProps {
  assignment: Assignment;
  course: Course | null;
  onEdit: () => void;
  onDelete: () => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  assignment,
  course,
  onEdit,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: assignment.id,
  });

  const { start: startPomodoro, isActive: isPomodoroActive, assignmentId: activePomodoroId } = usePomodoro();

  const isCurrentlyTicking = isPomodoroActive && activePomodoroId === assignment.id;
  const courseColors = course ? getCourseColorClasses(course.color) : null;

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.3 : 1,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="select-none touch-none"
    >
      <Card
        padding="sm"
        className={`
          flex flex-col gap-3 hover:border-brand-500/30 dark:hover:border-brand-700/50 transition-colors relative group
          ${isCurrentlyTicking ? 'border-brand-500/40 dark:border-brand-700/60 ring-2 ring-brand-500/15 glow-pulse' : ''}
        `}
      >
        {/* Card Header: Course Code & Edit/Delete */}
        <div className="flex justify-between items-start gap-3">
          {course ? (
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${courseColors?.bg} ${courseColors?.text}`}>
              {course.code}
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
              GEN
            </span>
          )}

          {/* Hover Action Buttons */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1 rounded text-[--text-secondary] hover:text-brand-400 hover:bg-white/5 transition-colors"
              title="Edit Assignment"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 rounded text-danger-500 hover:text-danger-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              title="Delete Assignment"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-[--text-primary] line-clamp-2 leading-snug">
            {assignment.title}
          </h4>
          {assignment.description && (
            <p className="text-[10px] text-[--text-secondary] line-clamp-2 leading-relaxed">
              {assignment.description}
            </p>
          )}
        </div>

        {/* Badges and Info */}
        <div className="flex flex-wrap items-center gap-1.5 mt-1">
          <Badge variant="priority" value={assignment.priority} className="py-0" />
          
          {assignment.status !== 'done' && (
            <CountdownBadge targetDate={`${assignment.dueDate}T${assignment.dueTime}`} compact />
          )}
        </div>

        {/* Card Footer: Due Date & Focus Timer */}
        <div className="flex items-center justify-between border-t border-[--border] pt-2.5 mt-1 text-[10px] text-[--text-secondary]">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[--text-muted]" />
            {formatDate(assignment.dueDate)}
          </span>

          {assignment.status !== 'done' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                startPomodoro(assignment.id);
              }}
              disabled={isCurrentlyTicking}
              className={`
                flex items-center gap-1 px-2 py-1 rounded-lg border border-[--border] font-semibold transition-all
                ${isCurrentlyTicking
                  ? 'bg-brand-950/30 border-brand-700/40 text-brand-400'
                  : 'hover:bg-brand-950/20 dark:hover:bg-brand-950/20 hover:text-brand-400 hover:border-brand-700/40'
                }
              `}
              title={isCurrentlyTicking ? 'Focus session active' : 'Start Focus Session'}
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              <span>Focus</span>
            </button>
          )}

          {assignment.status === 'done' && assignment.actualHrs > 0 && (
            <span className="text-success-600 dark:text-success-400 font-bold">
              {assignment.actualHrs.toFixed(1)}h logged
            </span>
          )}
        </div>
      </Card>
    </div>
  );
};

export default KanbanCard;
export const KanbanCardMemo = React.memo(KanbanCard);
