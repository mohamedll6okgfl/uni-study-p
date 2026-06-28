import React, { useState, useMemo } from 'react';
import { Plus, Search, StickyNote, Pin } from 'lucide-react';
import { usePlannerData } from '../../context/PlannerContext';
import type { NoteColor } from '../../types';
import NoteCard from './NoteCard';
import NoteEditor from './NoteEditor';
import NoteForm from '../../components/forms/NoteForm';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

export const Scratchpad: React.FC = () => {
  const { data, dispatch } = usePlannerData();

  const [searchQuery, setSearchQuery] = useState('');
  const [colorFilter, setColorFilter] = useState<NoteColor | 'all'>('all');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [formNoteId, setFormNoteId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const allNotes = Object.values(data.notes);

  // Filter notes
  const { pinnedNotes, regularNotes } = useMemo(() => {
    let filtered = allNotes;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (colorFilter !== 'all') {
      filtered = filtered.filter(n => n.color === colorFilter);
    }

    // Sort by updatedAt desc
    filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return {
      pinnedNotes: filtered.filter(n => n.isPinned),
      regularNotes: filtered.filter(n => !n.isPinned),
    };
  }, [allNotes, searchQuery, colorFilter]);

  const handleNewNote = () => {
    setFormNoteId(null);
    setIsFormOpen(true);
  };

  const handleEditNote = (noteId: string) => {
    setEditingNoteId(noteId);
  };

  const handleDeleteNote = (noteId: string) => {
    const note = data.notes[noteId];
    if (!note) return;
    if (window.confirm(`Delete note "${note.title}"?`)) {
      dispatch({ type: 'DELETE_NOTE', payload: { id: noteId } });
    }
  };

  const COLOR_FILTERS: { value: NoteColor | 'all'; label: string; dotClass: string }[] = [
    { value: 'all',     label: 'All',     dotClass: 'bg-gradient-to-br from-indigo-400 to-teal-400' },
    { value: 'default', label: 'Default', dotClass: 'bg-slate-400' },
    { value: 'yellow',  label: 'Yellow',  dotClass: 'bg-yellow-400' },
    { value: 'blue',    label: 'Blue',    dotClass: 'bg-blue-400' },
    { value: 'green',   label: 'Green',   dotClass: 'bg-green-400' },
    { value: 'red',     label: 'Red',     dotClass: 'bg-red-400' },
  ];

  const editingNote = editingNoteId ? data.notes[editingNoteId] : null;

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[--text-primary]">Scratchpad</h1>
          <p className="text-xs text-[--text-secondary] mt-0.5">
            Markdown-powered notes linked to your courses and assignments.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleNewNote}
        >
          New Note
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-[--border] bg-[--bg-card] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs"
          />
        </div>

        {/* Color filter pills */}
        <div className="flex items-center gap-1.5">
          {COLOR_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setColorFilter(f.value)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all ${
                colorFilter === f.value
                  ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                  : 'border-[--border] text-[--text-secondary] hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${f.dotClass}`} />
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {allNotes.length === 0 && (
        <div className="py-12 border border-dashed border-[--border] rounded-2xl">
          <EmptyState
            icon={<StickyNote className="w-10 h-10 text-brand-500" />}
            title="Your scratchpad is empty"
            description="Create markdown-powered notes linked to your courses and assignments."
            action={{ label: 'Create First Note', onClick: handleNewNote }}
          />
        </div>
      )}

      {/* Pinned Section */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
            <Pin className="w-3.5 h-3.5 text-brand-500" />
            Pinned Notes ({pinnedNotes.length})
          </h2>
          <div className="note-grid">
            {pinnedNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={() => handleEditNote(note.id)}
                onDelete={() => handleDeleteNote(note.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Notes */}
      {regularNotes.length > 0 && (
        <div className="space-y-3">
          {pinnedNotes.length > 0 && (
            <h2 className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
              Other Notes ({regularNotes.length})
            </h2>
          )}
          <div className="note-grid">
            {regularNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={() => handleEditNote(note.id)}
                onDelete={() => handleDeleteNote(note.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* No search results */}
      {allNotes.length > 0 && pinnedNotes.length === 0 && regularNotes.length === 0 && (
        <div className="py-10 text-center text-sm text-[--text-secondary] border border-dashed border-[--border] rounded-2xl">
          No notes match your search or filter.
        </div>
      )}

      {/* Note Editor (full-screen overlay) */}
      {editingNote && (
        <NoteEditor
          note={editingNote}
          onClose={() => setEditingNoteId(null)}
        />
      )}

      {/* Note Metadata Form */}
      <NoteForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        noteId={formNoteId}
      />
    </div>
  );
};

export default Scratchpad;
