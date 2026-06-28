import React, { useState, useEffect } from 'react';
import { usePlannerData } from '../../context/PlannerContext';
import type { Note, NoteColor } from '../../types';
import { generateId } from '../../utils/generate';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export interface NoteFormProps {
  isOpen: boolean;
  onClose: () => void;
  noteId?: string | null;
}

const NOTE_COLORS: { value: NoteColor; label: string; classes: string }[] = [
  { value: 'default', label: 'Default', classes: 'bg-slate-200 dark:bg-slate-600' },
  { value: 'yellow',  label: 'Yellow',  classes: 'bg-yellow-300 dark:bg-yellow-600' },
  { value: 'blue',    label: 'Blue',    classes: 'bg-blue-300 dark:bg-blue-600' },
  { value: 'green',   label: 'Green',   classes: 'bg-green-300 dark:bg-green-600' },
  { value: 'red',     label: 'Red',     classes: 'bg-red-300 dark:bg-red-600' },
];

export const NoteForm: React.FC<NoteFormProps> = ({ isOpen, onClose, noteId }) => {
  const { data, dispatch } = usePlannerData();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState<NoteColor>('default');
  const [courseId, setCourseId] = useState<string>('');
  const [isPinned, setIsPinned] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  const coursesList = Object.values(data.courses).filter(c => !c.isArchived);

  useEffect(() => {
    if (isOpen) {
      if (noteId && data.notes[noteId]) {
        const n = data.notes[noteId];
        setTitle(n.title);
        setContent(n.content);
        setColor(n.color);
        setCourseId(n.courseId || '');
        setIsPinned(n.isPinned);
        setTagsInput(n.tags.join(', '));
      } else {
        setTitle('');
        setContent('');
        setColor('default');
        setCourseId('');
        setIsPinned(false);
        setTagsInput('');
      }
    }
  }, [isOpen, noteId, data.notes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);

    const noteData: Note = {
      id: noteId || generateId(),
      courseId: courseId || null,
      linkedItemId: noteId && data.notes[noteId] ? data.notes[noteId].linkedItemId : null,
      linkedItemType: noteId && data.notes[noteId] ? data.notes[noteId].linkedItemType : null,
      title: title.trim(),
      content,
      color,
      isPinned,
      tags,
      createdAt: noteId && data.notes[noteId] ? data.notes[noteId].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (noteId) {
      dispatch({ type: 'UPDATE_NOTE', payload: { id: noteId, changes: noteData } });
    } else {
      dispatch({ type: 'ADD_NOTE', payload: noteData });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={noteId ? 'Edit Note' : 'New Note'}
      description="Write markdown-powered notes and link them to your courses."
      size="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {noteId ? 'Save Changes' : 'Create Note'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">Title *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Note title..."
            autoFocus
            required
            className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm font-medium"
          />
        </div>

        {/* Content */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
            Content (Markdown supported)
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your note here... Markdown is supported!"
            rows={8}
            className="w-full p-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm resize-none font-mono"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Course Link */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">Link to Course</label>
            <select
              value={courseId}
              onChange={e => setCourseId(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm cursor-pointer"
            >
              <option value="">No Course (Global)</option>
              {coursesList.map(c => (
                <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">Tags</label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="e.g. lecture, formulas, revision"
              className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
            />
          </div>
        </div>

        {/* Color & Pin */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider block">Color</label>
            <div className="flex gap-2.5">
              {NOTE_COLORS.map(nc => (
                <button
                  key={nc.value}
                  type="button"
                  onClick={() => setColor(nc.value)}
                  title={nc.label}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${nc.classes} ${color === nc.value ? 'border-[--text-primary] scale-110 shadow' : 'border-transparent hover:scale-105'}`}
                />
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={e => setIsPinned(e.target.checked)}
              className="w-4 h-4 rounded border-[--border] text-brand-500 focus:ring-brand-500/20 cursor-pointer"
            />
            <span className="text-sm font-semibold text-[--text-primary]">📌 Pin this note</span>
          </label>
        </div>
      </form>
    </Modal>
  );
};

export default NoteForm;
