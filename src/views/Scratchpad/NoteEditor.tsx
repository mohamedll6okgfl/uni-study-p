import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Edit3, Eye, Save } from 'lucide-react';
import type { Note } from '../../types';
import { usePlannerData } from '../../context/PlannerContext';

export interface NoteEditorProps {
  note: Note;
  onClose: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onClose }) => {
  const { dispatch } = usePlannerData();
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [content, setContent] = useState(note.content);
  const [isSaved, setIsSaved] = useState(true);
  const saveTimeoutRef = useRef<number | null>(null);

  // Reset on note change
  useEffect(() => {
    setContent(note.content);
    setIsSaved(true);
    setMode('edit');
  }, [note.id]);

  // Debounced autosave
  const scheduleAutosave = useCallback((newContent: string) => {
    if (saveTimeoutRef.current !== null) {
      clearTimeout(saveTimeoutRef.current);
    }
    setIsSaved(false);
    saveTimeoutRef.current = window.setTimeout(() => {
      dispatch({ type: 'UPDATE_NOTE', payload: { id: note.id, changes: { content: newContent } } });
      setIsSaved(true);
    }, 800);
  }, [note.id, dispatch]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    scheduleAutosave(val);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current !== null) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Editor Panel */}
      <div className="relative bg-[--bg-card] border border-[--border] rounded-2xl shadow-card-hover w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[--border]">
          <h2 className="text-base font-bold text-[--text-primary] truncate flex-1 mr-4">
            {note.title}
          </h2>

          {/* Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-1 shrink-0">
            <button
              onClick={() => setMode('edit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                mode === 'edit'
                  ? 'bg-white dark:bg-slate-700 text-[--text-primary] shadow-sm'
                  : 'text-[--text-secondary] hover:text-[--text-primary]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                mode === 'preview'
                  ? 'bg-white dark:bg-slate-700 text-[--text-primary] shadow-sm'
                  : 'text-[--text-secondary] hover:text-[--text-primary]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
          </div>

          {/* Save status + Close */}
          <div className="flex items-center gap-3 ml-4 shrink-0">
            <span className={`flex items-center gap-1 text-[10px] font-semibold transition-opacity ${isSaved ? 'text-success-600 opacity-100' : 'text-[--text-muted] opacity-70'}`}>
              <Save className="w-3 h-3" />
              {isSaved ? 'Saved' : 'Saving...'}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[--text-muted] hover:text-[--text-primary] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close editor"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {mode === 'edit' ? (
            <textarea
              value={content}
              onChange={handleContentChange}
              className="w-full h-full min-h-[400px] p-5 bg-[--bg-page] text-[--text-primary] text-sm font-mono resize-none focus:outline-none leading-relaxed"
              placeholder="Write your notes here... Markdown is supported!

# Heading
**Bold text**, *italic text*
- List item
- [ ] Checkbox

```code block```"
              spellCheck
            />
          ) : (
            <div className="h-full overflow-y-auto p-5">
              {content ? (
                <div className="prose prose-slate dark:prose-invert prose-sm max-w-none
                  prose-headings:font-bold prose-headings:text-[--text-primary]
                  prose-p:text-[--text-secondary] prose-p:leading-relaxed
                  prose-li:text-[--text-secondary]
                  prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-brand-600 dark:prose-code:text-brand-400
                  prose-pre:bg-slate-100 dark:prose-pre:bg-slate-800 prose-pre:border prose-pre:border-[--border] prose-pre:rounded-xl
                ">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-[--text-muted] italic">Nothing to preview yet. Switch to Edit mode to write.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
