import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Assignment, Course } from '../../types';
import KanbanCard from './KanbanCard';

export interface KanbanColumnProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  assignments: Assignment[];
  courses: Record<string, Course>;
  onEditCard: (id: string) => void;
  onDeleteCard: (id: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  label,
  icon,
  assignments,
  courses,
  onEditCard,
  onDeleteCard,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col flex-1 min-w-[260px] max-w-[340px]
        bg-[--bg-card]/40 dark:bg-black/20
        border border-[--border] rounded-2xl p-4 transition-all duration-150
        ${isOver ? 'dark:bg-brand-950/10 border-brand-500/30 dark:border-brand-700/50' : ''}
      `}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[--border]">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400 shrink-0">
            {icon}
          </span>
          <h3 className="text-xs font-bold text-[--text-primary] tracking-wide uppercase">
            {label}
          </h3>
        </div>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/5 dark:bg-white/5 text-[--text-secondary] tabular-nums border border-[--border]">
          {assignments.length}
        </span>
      </div>

      {/* Cards List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[200px] max-h-[calc(100vh-220px)] scrollbar-thin">
        {assignments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-[--border] rounded-xl bg-white/30 dark:bg-transparent">
            <span className="text-lg opacity-50">✨</span>
            <p className="text-[10px] font-medium text-[--text-secondary] mt-1">Empty Column</p>
          </div>
        ) : (
          assignments.map((assignment) => (
            <KanbanCard
              key={assignment.id}
              assignment={assignment}
              course={courses[assignment.courseId] || null}
              onEdit={() => onEditCard(assignment.id)}
              onDelete={() => onDeleteCard(assignment.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
