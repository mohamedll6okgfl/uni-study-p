import React, { useState, useEffect, useMemo, useRef } from 'react';
import Fuse from 'fuse.js';
import { Search, ClipboardList, Calendar, BookOpen, StickyNote, X, Clock } from 'lucide-react';
import { usePlannerData } from '../../context/PlannerContext';
import { getCourseColorClasses } from '../../utils/color';
import { formatDate } from '../../utils/date';
import { useNavigate } from 'react-router-dom';

export interface SearchResult {
  type: 'assignment' | 'exam' | 'course' | 'note';
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  score: number;
  courseColor?: string;
}

export const GlobalSearch: React.FC = () => {
  const { data } = usePlannerData();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Register Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(open => {
          if (!open) setQuery('');
          return !open;
        });
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    setActiveIdx(0);
  }, [isOpen]);

  // Build Fuse indexes
  const assignmentFuse = useMemo(() => new Fuse(Object.values(data.assignments), {
    keys: [
      { name: 'title', weight: 0.5 },
      { name: 'description', weight: 0.2 },
      { name: 'tags', weight: 0.3 },
    ],
    threshold: 0.35,
    includeScore: true,
  }), [data.assignments]);

  const examFuse = useMemo(() => new Fuse(Object.values(data.exams), {
    keys: [
      { name: 'title', weight: 0.5 },
      { name: 'topics', weight: 0.4 },
      { name: 'notes', weight: 0.1 },
    ],
    threshold: 0.35,
    includeScore: true,
  }), [data.exams]);

  const courseFuse = useMemo(() => new Fuse(Object.values(data.courses), {
    keys: [
      { name: 'name', weight: 0.6 },
      { name: 'code', weight: 0.3 },
      { name: 'instructor', weight: 0.1 },
    ],
    threshold: 0.25,
    includeScore: true,
  }), [data.courses]);

  const noteFuse = useMemo(() => new Fuse(Object.values(data.notes), {
    keys: [
      { name: 'title', weight: 0.5 },
      { name: 'content', weight: 0.3 },
      { name: 'tags', weight: 0.2 },
    ],
    threshold: 0.35,
    includeScore: true,
  }), [data.notes]);

  // Compute results
  const results: SearchResult[] = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) return [];

    const combined: SearchResult[] = [];

    assignmentFuse.search(query, { limit: 4 }).forEach(r => {
      const a = r.item;
      const course = data.courses[a.courseId];
      combined.push({
        type: 'assignment',
        id: a.id,
        title: a.title,
        subtitle: `${course?.code || 'GEN'} · Due ${formatDate(a.dueDate)}`,
        icon: <ClipboardList className="w-4 h-4 text-brand-500" />,
        score: r.score ?? 1,
        courseColor: course?.color,
      });
    });

    examFuse.search(query, { limit: 3 }).forEach(r => {
      const e = r.item;
      const course = data.courses[e.courseId];
      combined.push({
        type: 'exam',
        id: e.id,
        title: e.title,
        subtitle: `${course?.code || 'GEN'} · ${formatDate(e.date)} at ${e.startTime}`,
        icon: <Calendar className="w-4 h-4 text-teal-500" />,
        score: r.score ?? 1,
        courseColor: course?.color,
      });
    });

    courseFuse.search(query, { limit: 3 }).forEach(r => {
      const c = r.item;
      combined.push({
        type: 'course',
        id: c.id,
        title: c.name,
        subtitle: `${c.code} · ${c.credits} Credits · ${c.semester}`,
        icon: <BookOpen className="w-4 h-4 text-amber-500" />,
        score: r.score ?? 1,
        courseColor: c.color,
      });
    });

    noteFuse.search(query, { limit: 3 }).forEach(r => {
      const n = r.item;
      const course = n.courseId ? data.courses[n.courseId] : null;
      combined.push({
        type: 'note',
        id: n.id,
        title: n.title,
        subtitle: course ? `${course.code} · Note` : 'Global Note',
        icon: <StickyNote className="w-4 h-4 text-yellow-500" />,
        score: r.score ?? 1,
      });
    });

    // Sort by score (lower = better match)
    combined.sort((a, b) => a.score - b.score);
    return combined;
  }, [query, assignmentFuse, examFuse, courseFuse, noteFuse, data.courses]);

  const handleSelectResult = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');

    switch (result.type) {
      case 'assignment':
      case 'course':
        navigate(result.type === 'course' ? `/courses` : `/kanban`);
        break;
      case 'exam':
        navigate('/exams');
        break;
      case 'note':
        navigate('/scratchpad');
        break;
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[activeIdx]) {
      handleSelectResult(results[activeIdx]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0a0f0b]/70 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

      {/* Palette Panel */}
      <div className="relative w-full max-w-xl bg-[--bg-card] border border-[--border] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(52,211,153,0.08)] overflow-hidden z-10 animate-[fadeIn_0.15s_ease-out]">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[--border]">
          <Search className="w-5 h-5 text-[--text-muted] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIdx(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search assignments, exams, notes, courses..."
            className="flex-1 bg-transparent text-[--text-primary] text-sm placeholder-[--text-muted] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-[--text-muted] hover:text-[--text-primary] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 bg-white/5 border border-[--border] rounded text-[10px] font-mono text-brand-400 shrink-0">ESC</kbd>
        </div>

        {/* Results */}
        {query.trim().length >= 2 && (
          <div className="max-h-[60vh] overflow-y-auto">
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                <Search className="w-8 h-8 text-[--text-muted] opacity-40" />
                <p className="text-sm font-semibold text-[--text-secondary]">No results for "{query}"</p>
                <p className="text-xs text-[--text-muted]">Try a different keyword or course code</p>
              </div>
            ) : (
              <ul role="listbox" className="py-2">
                {results.map((result, idx) => {
                  const courseColors = result.courseColor ? getCourseColorClasses(result.courseColor) : null;
                  const isActive = idx === activeIdx;

                  return (
                    <li key={`${result.type}-${result.id}`} role="option" aria-selected={isActive}>
                      <button
                        onClick={() => handleSelectResult(result)}
                        onMouseEnter={() => setActiveIdx(idx)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                          ${isActive ? 'bg-brand-950/25 dark:bg-brand-950/25 border-l-2 border-brand-500' : 'hover:bg-white/3 dark:hover:bg-white/3 border-l-2 border-transparent'}
                        `}
                      >
                        {/* Icon */}
                        <div className={`flex items-center justify-center w-8 h-8 rounded-xl shrink-0 ${courseColors?.bg || 'bg-white/5 border border-[--border]'}`}>
                          {result.icon}
                        </div>

                        {/* Text */}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[--text-primary] truncate">{result.title}</p>
                          <p className="text-[10px] text-[--text-secondary] truncate mt-0.5">{result.subtitle}</p>
                        </div>

                        {/* Type badge */}
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-[--border] text-brand-400/80 shrink-0 capitalize">
                          {result.type}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* Empty/Hint State */}
        {(!query.trim() || query.trim().length < 2) && (
          <div className="py-8 px-4 text-center space-y-3">
            <Clock className="w-8 h-8 text-[--text-muted] opacity-40 mx-auto" />
            <p className="text-xs text-[--text-secondary]">
              Search across all your <strong>assignments</strong>, <strong>exams</strong>, <strong>courses</strong>, and <strong>notes</strong>.
            </p>
            <div className="flex items-center justify-center gap-2 text-[10px] text-[--text-muted]">
              <kbd className="px-1.5 py-0.5 bg-white/5 border border-[--border] rounded font-mono text-brand-400">↑ ↓</kbd>
              <span>navigate</span>
              <kbd className="px-1.5 py-0.5 bg-white/5 border border-[--border] rounded font-mono text-brand-400">↵</kbd>
              <span>select</span>
              <kbd className="px-1.5 py-0.5 bg-white/5 border border-[--border] rounded font-mono text-brand-400">ESC</kbd>
              <span>close</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;
