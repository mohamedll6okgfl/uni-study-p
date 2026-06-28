import React, { useState, useEffect } from 'react';
import { usePlannerData } from '../../context/PlannerContext';
import type { Assignment, Priority, Status } from '../../types';
import { generateId } from '../../utils/generate';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export interface AssignmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentId?: string | null; // Nullable - if provided, we are editing
}

export const AssignmentForm: React.FC<AssignmentFormProps> = ({ isOpen, onClose, assignmentId }) => {
  const { data, dispatch } = usePlannerData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('23:59');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<Status>('todo');
  const [estimatedHrs, setEstimatedHrs] = useState(2);
  const [tagsInput, setTagsInput] = useState('');
  
  const [error, setError] = useState('');

  const coursesList = Object.values(data.courses).filter(c => !c.isArchived);

  // Prefill if editing
  useEffect(() => {
    if (isOpen) {
      if (assignmentId && data.assignments[assignmentId]) {
        const a = data.assignments[assignmentId];
        setTitle(a.title);
        setDescription(a.description);
        setCourseId(a.courseId);
        setDueDate(a.dueDate);
        setDueTime(a.dueTime);
        setPriority(a.priority);
        setStatus(a.status);
        setEstimatedHrs(a.estimatedHrs);
        setTagsInput(a.tags.join(', '));
      } else {
        // Reset form
        setTitle('');
        setDescription('');
        setCourseId(coursesList[0]?.id || '');
        setDueDate(new Date().toISOString().slice(0, 10));
        setDueTime('23:59');
        setPriority('medium');
        setStatus('todo');
        setEstimatedHrs(2);
        setTagsInput('');
      }
      setError('');
    }
  }, [isOpen, assignmentId, data.assignments, coursesList]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Assignment title is required.');
      return;
    }

    if (!courseId) {
      setError('Please select a course. Create one first if none exist.');
      return;
    }

    if (!dueDate) {
      setError('Due date is required.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    const assignmentData: Assignment = {
      id: assignmentId || generateId(),
      courseId,
      title: title.trim(),
      description: description.trim(),
      dueDate,
      dueTime,
      priority,
      status,
      estimatedHrs,
      actualHrs: assignmentId && data.assignments[assignmentId] ? data.assignments[assignmentId].actualHrs : 0,
      tags,
      attachments: assignmentId && data.assignments[assignmentId] ? data.assignments[assignmentId].attachments : [],
      studySessions: assignmentId && data.assignments[assignmentId] ? data.assignments[assignmentId].studySessions : [],
      createdAt: assignmentId && data.assignments[assignmentId] ? data.assignments[assignmentId].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (assignmentId) {
      dispatch({
        type: 'UPDATE_ASSIGNMENT',
        payload: { id: assignmentId, changes: assignmentData },
      });
    } else {
      dispatch({
        type: 'ADD_ASSIGNMENT',
        payload: assignmentData,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={assignmentId ? 'Edit Assignment' : 'Add Assignment'}
      description="Track details, due date, priority, and focus time for this assignment."
      size="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {assignmentId ? 'Save Changes' : 'Add Assignment'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold animate-shake">
            {error}
          </div>
        )}

        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
            Assignment Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Problem Set 5"
            maxLength={120}
            className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm font-medium"
            required
            autoFocus
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
            Description / Requirements
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Outline instructions, page limits, or textbook numbers..."
            rows={3}
            className="w-full p-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Course Selector */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
              Course *
            </label>
            {coursesList.length === 0 ? (
              <div className="text-xs text-red-500 font-semibold p-2 border border-dashed border-red-200 rounded-lg bg-red-50/50 dark:bg-red-950/10 dark:border-red-900/30">
                Please create a course first!
              </div>
            ) : (
              <select
                value={courseId}
                onChange={e => setCourseId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm cursor-pointer"
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

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="e.g. homework, essay, group"
              className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
            />
          </div>

          {/* Due Date */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
              Due Date *
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm cursor-pointer"
              required
            />
          </div>

          {/* Due Time */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
              Due Time
            </label>
            <input
              type="time"
              value={dueTime}
              onChange={e => setDueTime(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm cursor-pointer"
            />
          </div>

          {/* Priority */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
              Priority
            </label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as Priority)}
              className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm cursor-pointer"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
              Status
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as Status)}
              className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm cursor-pointer"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Estimated Hours */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
              Estimated Hours
            </label>
            <input
              type="number"
              value={estimatedHrs}
              onChange={e => setEstimatedHrs(Number(e.target.value))}
              min={0.25}
              max={100}
              step={0.25}
              className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AssignmentForm;
