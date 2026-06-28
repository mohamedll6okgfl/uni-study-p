import React from 'react';
import { Pin, PinOff, Edit2, Trash2, Tag } from 'lucide-react';
import type { Note } from '../../types';
import { usePlannerData } from '../../context/PlannerContext';
import { getCourseColorClasses } from '../../utils/color';

export interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

const noteColorMap: Record<Note['color'], { bg: string; border: string; accent: string }> = {
  default: {
    bg: 'bg-[--bg-card]',
    border: 'border-[--border]',
    accent: 'bg-slate-200 dark:bg-slate-700',
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-950/20',
    border: 'border-yellow-200 dark:border-yellow-800/60',
    accent: 'bg-yellow-200 dark:bg-yellow-700/40',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-800/60',
    accent: 'bg-blue-200 dark:bg-blue-700/40',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950/20',
    border: 'border-green-200 dark:border-green-800/60',
    accent: 'bg-green-200 dark:bg-green-700/40',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950/20',
    border: 'border-red-200 dark:border-red-800/60',
    accent: 'bg-red-200 dark:bg-red-700/40',
  },
};

export const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  const { data, dispatch } = usePlannerData();
  const colorStyles = noteColorMap[note.color];
  const course = note.courseId ? data.courses[note.courseId] : null;
  const courseColors = course ? getCourseColorClasses(course.color) : null;

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'UPDATE_NOTE', payload: { id: note.id, changes: { isPinned: !note.isPinned } } });
  };

  // Strip markdown for preview
  const previewText = note.content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/[#*_~\->\[\]!]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);

  return (
    <div
      className={`note-card rounded-xl border p-4 cursor-pointer group transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 ${colorStyles.bg} ${colorStyles.border}`}
      onClick={onEdit}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          {/* Course tag */}
          {course && courseColors && (
            <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider mb-1.5 ${courseColors.bg} ${courseColors.text}`}>
              {course.code}
            </span>
          )}

          <h3 className="text-sm font-bold text-[--text-primary] line-clamp-2 leading-snug group-hover:text-brand-500 transition-colors">
            {note.isPinned && <span className="text-brand-500 mr-1">📌</span>}
            {note.title}
          </h3>
        </div>

        {/* Actions (shown on hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={handleTogglePin}
            className="p-1.5 rounded-lg text-[--text-secondary] hover:text-brand-500 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
            title={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            {note.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-1.5 rounded-lg text-[--text-secondary] hover:text-[--text-primary] hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
            title="Edit note"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 rounded-lg text-danger-500 hover:text-danger-600 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
            title="Delete note"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content Preview */}
      {previewText && (
        <p className="text-xs text-[--text-secondary] leading-relaxed line-clamp-4 mb-3">
          {previewText}
          {note.content.length > 160 && <span className="text-[--text-muted] italic">…</span>}
        </p>
      )}

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex items-center flex-wrap gap-1 mt-2">
          <Tag className="w-3 h-3 text-[--text-muted] shrink-0" />
          {note.tags.slice(0, 4).map(tag => (
            <span
              key={tag}
              className={`px-1.5 py-0.5 text-[9px] font-semibold rounded ${colorStyles.accent} text-[--text-secondary]`}
            >
              {tag}
            </span>
          ))}
          {note.tags.length > 4 && (
            <span className="text-[9px] font-semibold text-[--text-muted]">+{note.tags.length - 4}</span>
          )}
        </div>
      )}

      {/* Footer: Last updated */}
      <p className="text-[10px] text-[--text-muted] mt-3 border-t border-current/10 pt-2">
        {new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </p>
    </div>
  );
};

export default NoteCard;
