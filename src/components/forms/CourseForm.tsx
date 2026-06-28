import React, { useState, useEffect } from 'react';
import { usePlannerData } from '../../context/PlannerContext';
import type { Course } from '../../types';
import { generateId } from '../../utils/generate';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { COURSE_COLORS } from '../../utils/color';

export interface CourseFormProps {
  isOpen: boolean;
  onClose: () => void;
  courseId?: string | null; // Nullable - if provided, we are editing
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;

export const CourseForm: React.FC<CourseFormProps> = ({ isOpen, onClose, courseId }) => {
  const { data, dispatch } = usePlannerData();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState('indigo');
  const [instructor, setInstructor] = useState('');
  const [credits, setCredits] = useState(3);
  const [semester, setSemester] = useState('Fall 2025');
  const [days, setDays] = useState<('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri')[]>([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:15');
  const [location, setLocation] = useState('');
  
  const [error, setError] = useState('');

  // Prefill if editing
  useEffect(() => {
    if (isOpen) {
      if (courseId && data.courses[courseId]) {
        const c = data.courses[courseId];
        setName(c.name);
        setCode(c.code);
        setColor(c.color);
        setInstructor(c.instructor);
        setCredits(c.credits);
        setSemester(c.semester);
        setDays(c.schedule.days);
        setStartTime(c.schedule.startTime);
        setEndTime(c.schedule.endTime);
        setLocation(c.schedule.location);
      } else {
        // Reset form
        setName('');
        setCode('');
        setColor('indigo');
        setInstructor('');
        setCredits(3);
        setSemester('Fall 2025');
        setDays([]);
        setStartTime('09:00');
        setEndTime('10:15');
        setLocation('');
      }
      setError('');
    }
  }, [isOpen, courseId, data.courses]);

  const handleDayToggle = (day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri') => {
    if (days.includes(day)) {
      setDays(days.filter(d => d !== day));
    } else {
      setDays([...days, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !code.trim()) {
      setError('Course name and code are required.');
      return;
    }

    if (endTime <= startTime) {
      setError('End time must be after start time.');
      return;
    }

    const courseData: Course = {
      id: courseId || generateId(),
      name: name.trim(),
      code: code.trim().toUpperCase(),
      color,
      instructor: instructor.trim(),
      credits,
      semester: semester.trim(),
      schedule: {
        days,
        startTime,
        endTime,
        location: location.trim(),
      },
      createdAt: courseId && data.courses[courseId] ? data.courses[courseId].createdAt : new Date().toISOString(),
      isArchived: courseId && data.courses[courseId] ? data.courses[courseId].isArchived : false,
    };

    if (courseId) {
      dispatch({
        type: 'UPDATE_COURSE',
        payload: { id: courseId, changes: courseData },
      });
    } else {
      dispatch({
        type: 'ADD_COURSE',
        payload: courseData,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={courseId ? 'Edit Course' : 'Add New Course'}
      description="Create a course to organize your assignments and exams."
      size="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {courseId ? 'Save Changes' : 'Create Course'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
              Course Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Calculus II"
              className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
              required
            />
          </div>

          {/* Code */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
              Course Code *
            </label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="e.g. MATH-201"
              className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
              required
            />
          </div>

          {/* Instructor */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
              Instructor
            </label>
            <input
              type="text"
              value={instructor}
              onChange={e => setInstructor(e.target.value)}
              placeholder="e.g. Dr. Sarah Chen"
              className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
            />
          </div>

          {/* Credits */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
              Credits
            </label>
            <input
              type="number"
              value={credits}
              onChange={e => setCredits(Number(e.target.value))}
              min={0}
              max={10}
              className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
            />
          </div>
        </div>

        {/* Color Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
            Color Palette Theme
          </label>
          <div className="flex flex-wrap gap-2.5">
            {Object.keys(COURSE_COLORS).map(cName => {
              const colors = COURSE_COLORS[cName];
              const isSelected = color === cName;
              return (
                <button
                  key={cName}
                  type="button"
                  onClick={() => setColor(cName)}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                    ${colors.solid.split(' ')[0]}
                    ${isSelected ? 'border-[--text-primary] scale-110 shadow-sm' : 'border-transparent hover:scale-105'}
                  `}
                  title={cName}
                  aria-label={`Select ${cName} theme`}
                >
                  {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="border-t border-[--border] pt-4 space-y-4">
          <h3 className="text-xs font-bold text-[--text-primary] uppercase tracking-wider">
            Weekly Schedule & Location
          </h3>

          <div className="space-y-1.5">
            <label className="text-2xs font-bold text-[--text-secondary] uppercase tracking-wider">
              Lecture Days
            </label>
            <div className="flex gap-2">
              {DAYS_OF_WEEK.map(day => {
                const isSelected = days.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`
                      flex-1 h-9 rounded-lg border text-xs font-semibold select-none transition-all
                      ${isSelected
                        ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                        : 'bg-[--bg-page] border-[--border] text-[--text-secondary] hover:bg-slate-50 dark:hover:bg-slate-800/80'
                      }
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Start Time */}
            <div className="space-y-1">
              <label className="text-2xs font-bold text-[--text-secondary] uppercase tracking-wider">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
              />
            </div>

            {/* End Time */}
            <div className="space-y-1">
              <label className="text-2xs font-bold text-[--text-secondary] uppercase tracking-wider">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
              />
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="text-2xs font-bold text-[--text-secondary] uppercase tracking-wider">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Hall B, Room 302"
                className="w-full h-10 px-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CourseForm;
