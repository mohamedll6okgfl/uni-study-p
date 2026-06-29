import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import { usePlannerData } from '../../context/PlannerContext';
import type { Exam } from '../../types';
import { generateId } from '../../utils/generate';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export interface ExamFormProps {
  isOpen: boolean;
  onClose: () => void;
  examId?: string | null; // Nullable - if provided, we are editing
}

export const ExamForm: React.FC<ExamFormProps> = ({ isOpen, onClose, examId }) => {
  const { data, dispatch } = usePlannerData();

  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [type, setType] = useState<Exam['type']>('midterm');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [location, setLocation] = useState('');
  const [weight, setWeight] = useState(20);
  const [topicsInput, setTopicsInput] = useState('');
  const [notes, setNotes] = useState('');
  
  const [error, setError] = useState('');

  // Memoize the courses list so its reference is stable across renders.
  // This is CRITICAL: if coursesList were recomputed on every render (via Object.values),
  // it would be a new array reference each time, causing the useEffect below to fire
  // on every keystroke and reset all form fields — making inputs appear frozen.
  const coursesList = useMemo(
    () => Object.values(data.courses).filter(c => !c.isArchived),
    [data.courses]
  );

  // Prefill if editing, or reset when opening for a new item.
  // We deliberately exclude `coursesList` from deps — it is only needed to
  // pick the initial courseId on open, not to re-run whenever courses change.
  useEffect(() => {
    if (!isOpen) return;

    if (examId && data.exams[examId]) {
      const e = data.exams[examId];
      setTitle(e.title);
      setCourseId(e.courseId);
      setType(e.type);
      setDate(e.date);
      setStartTime(e.startTime);
      setEndTime(e.endTime);
      setLocation(e.location ?? '');
      setWeight(e.weight ?? 20);
      setTopicsInput(e.topics?.join(', ') ?? '');
      setNotes(e.notes ?? '');
    } else {
      // Reset form — snapshot the first available courseId at open-time
      const firstCourseId = Object.values(data.courses).find(c => !c.isArchived)?.id ?? '';
      setTitle('');
      setCourseId(firstCourseId);
      setType('midterm');
      setDate(new Date().toISOString().slice(0, 10));
      setStartTime('09:00');
      setEndTime('11:00');
      setLocation('');
      setWeight(20);
      setTopicsInput('');
      setNotes('');
    }
    setError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, examId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Exam title is required.');
      return;
    }

    if (!courseId) {
      setError('Please select a course.');
      return;
    }

    if (!date) {
      setError('Exam date is required.');
      return;
    }

    if (endTime <= startTime) {
      setError('End time must be after start time.');
      return;
    }

    const topics = topicsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const examData: Exam = {
      id: examId || generateId(),
      courseId,
      title: title.trim(),
      type,
      date,
      startTime,
      endTime,
      location: location.trim(),
      weight,
      topics,
      notes: notes.trim(),
      createdAt: examId && data.exams[examId] ? data.exams[examId].createdAt : new Date().toISOString(),
    };

    if (examId) {
      dispatch({
        type: 'UPDATE_EXAM',
        payload: { id: examId, changes: examData },
      });
    } else {
      dispatch({
        type: 'ADD_EXAM',
        payload: examData,
      });
    }

    onClose();
  };

  // Guard: if no courses exist at all, show a friendly blocker instead of a broken form
  const hasCourses = coursesList.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={examId ? 'Edit Exam Info' : 'Schedule New Exam'}
      description="Record exams, locations, grade weights, and study topics."
      size="lg"
      footer={
        hasCourses ? (
          <>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSubmit}>
              {examId ? 'Save Changes' : 'Schedule Exam'}
            </Button>
          </>
        ) : (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        )
      }
    >
      {/* No-course empty state: renders instead of the broken form */}
      {!hasCourses ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-brand-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-[--text-primary] mb-1">No courses yet!</p>
            <p className="text-xs text-[--text-secondary] max-w-xs">
              You need to create at least one course before you can schedule exams.
              Head over to the <strong>Courses</strong> page to get started.
            </p>
          </div>
        </div>
      ) : (
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
              Exam Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Midterm 2, Final Exam"
              maxLength={100}
              className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-1 focus:ring-brand-400/40 focus:border-brand-400 transition-all duration-200 text-sm font-medium"
              required
            />
          </div>

          {/* Course */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
              Course *
            </label>
            {coursesList.length === 0 ? (
              <div className="text-xs text-red-500 font-semibold p-2 border border-dashed border-red-200 rounded-lg bg-red-50/50 dark:bg-red-950/10">
                Please create a course first!
              </div>
            ) : (
              <select
                value={courseId}
                onChange={e => setCourseId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-1 focus:ring-brand-400/40 focus:border-brand-400 transition-all duration-200 text-sm cursor-pointer"
                required
              >
                {coursesList.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Type */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
              Exam Type
            </label>
            <select
              value={type}
              onChange={e => setType(e.target.value as Exam['type'])}
              className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-1 focus:ring-brand-400/40 focus:border-brand-400 transition-all duration-200 text-sm cursor-pointer"
            >
              <option value="midterm">Midterm</option>
              <option value="final">Final</option>
              <option value="quiz">Quiz</option>
              <option value="lab">Lab Practical</option>
              <option value="presentation">Presentation</option>
            </select>
          </div>

          {/* Weight */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
              Weight (% of final grade)
            </label>
            <input
              type="number"
              value={weight}
              onChange={e => setWeight(Number(e.target.value))}
              min={0}
              max={100}
              className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-1 focus:ring-brand-400/40 focus:border-brand-400 transition-all duration-200 text-sm"
            />
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
              Exam Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-1 focus:ring-brand-400/40 focus:border-brand-400 transition-all duration-200 text-sm cursor-pointer"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Hall B, Seat 12"
              className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-1 focus:ring-brand-400/40 focus:border-brand-400 transition-all duration-200 text-sm"
            />
          </div>

          {/* Start Time */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
              Start Time *
            </label>
            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-1 focus:ring-brand-400/40 focus:border-brand-400 transition-all duration-200 text-sm cursor-pointer"
              required
            />
          </div>

          {/* End Time */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
              End Time *
            </label>
            <input
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-1 focus:ring-brand-400/40 focus:border-brand-400 transition-all duration-200 text-sm cursor-pointer"
              required
            />
          </div>
        </div>

        {/* Topics to Study */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
            Topics to Study (comma separated)
          </label>
          <input
            type="text"
            value={topicsInput}
            onChange={e => setTopicsInput(e.target.value)}
            placeholder="e.g. Limits, Derivatives, Taylor Series"
            className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-1 focus:ring-brand-400/40 focus:border-brand-400 transition-all duration-200 text-sm"
          />
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
            Preparation Notes
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Outline study goals, resources, or formulas to review..."
            rows={3}
            className="w-full p-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-1 focus:ring-brand-400/40 focus:border-brand-400 transition-all duration-200 text-sm resize-none"
          />
        </div>
      </form>
      )}
    </Modal>
  );
};

export default ExamForm;
