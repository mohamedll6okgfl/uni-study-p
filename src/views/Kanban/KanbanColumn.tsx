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
        flex flex-col flex-1 min-w-[260px] max-w-[340px] bg-slate-50/50 dark:bg-slate-900/10 border border-[--border] rounded-2xl p-4 transition-all duration-150
        ${isOver ? 'bg-slate-100/80 dark:bg-slate-800/20 border-brand-400 dark:border-brand-850' : ''}
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
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[--text-secondary] tabular-nums shadow-sm">
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
