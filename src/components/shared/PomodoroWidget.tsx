import React from 'react';
import { Play, Pause, Square, Timer, Coffee } from 'lucide-react';
import { usePomodoro } from '../../hooks/usePomodoro';
import { usePlannerData } from '../../context/PlannerContext';
import { getCourseColorClasses } from '../../utils/color';
import ProgressBar from '../ui/ProgressBar';

export const PomodoroWidget: React.FC = () => {
  const {
    isActive,
    isPaused,
    phase,
    secondsLeft,
    assignmentId,
    progressPercent,
    pause,
    resume,
    stop,
    skip,
  } = usePomodoro();

  const { data } = usePlannerData();

  if (!isActive) return null;

  // Find the associated assignment and course
  const assignment = assignmentId ? data.assignments[assignmentId] : null;
  const course = assignment ? data.courses[assignment.courseId] : null;
  const courseColors = course ? getCourseColorClasses(course.color) : null;

  // Format time: MM:SS
  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case 'work':
        return 'Focus Session';
      case 'short_break':
        return 'Short Break';
      case 'long_break':
        return 'Long Break';
    }
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-80 z-40 bg-[--bg-card] border border-[--border] rounded-2xl shadow-card-hover p-4 select-none animate-[slideUp_0.3s_ease-out]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 overflow-hidden">
          {phase === 'work' ? (
            <Timer className="w-4 h-4 text-brand-500 shrink-0" />
          ) : (
            <Coffee className="w-4 h-4 text-success-500 shrink-0" />
          )}
          <span className="text-xs font-bold text-[--text-secondary] tracking-wider uppercase">
            {getPhaseLabel()}
          </span>
        </div>
        
        {/* Skip button */}
        <button
          onClick={skip}
          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/5 text-brand-400 hover:text-brand-300 hover:bg-white/10 transition-colors border border-brand-900/30"
          title="Skip to next phase"
        >
          Skip
        </button>
      </div>

      {/* Assignment Title */}
      {assignment && (
        <div className="flex items-center gap-2 mb-3">
          {courseColors && (
            <span className={`w-2 h-2 rounded-full shrink-0 ${courseColors.solid.split(' ')[0]}`} />
          )}
          <p className="text-sm font-semibold text-[--text-primary] truncate" title={assignment.title}>
            {assignment.title}
          </p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <ProgressBar
          value={progressPercent}
          color={phase === 'work' ? 'brand' : 'success'}
          size="xs"
        />
      </div>

      {/* Timer and Controls */}
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-[--text-primary] font-mono tracking-tight tabular-nums">
          {formatTime(secondsLeft)}
        </span>

        <div className="flex items-center gap-2">
          {isPaused ? (
            <button
              onClick={resume}
              className="p-2 bg-brand-500 text-[#141a16] rounded-xl hover:bg-brand-400 transition-all shadow-sm shadow-brand-500/20 hover:shadow-emerald-glow"
              aria-label="Resume timer"
            >
              <Play className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={pause}
              className="p-2 bg-white/5 text-brand-400 rounded-xl hover:bg-white/10 hover:text-brand-300 border border-brand-900/30 transition-colors"
              aria-label="Pause timer"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={stop}
            className="p-2 bg-danger-100 hover:bg-danger-200 dark:bg-danger-950/30 dark:hover:bg-danger-900/30 text-danger-600 dark:text-danger-400 rounded-xl transition-colors"
            aria-label="Stop timer"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroWidget;
