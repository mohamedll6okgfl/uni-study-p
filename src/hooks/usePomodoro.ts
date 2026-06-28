import { usePlannerUI } from '../context/PlannerContext';

export interface PomodoroControls {
  start: (assignmentId: string) => void;
  pause: () => void;
  resume: () => void;
  skip: () => void;
  stop: () => void;
}

export interface PomodoroState {
  isActive:          boolean;
  isPaused:          boolean;
  phase:             'work' | 'short_break' | 'long_break';
  secondsLeft:       number;
  sessionsCompleted: number;
  assignmentId:      string | null;
  progressPercent:   number;
}

/**
 * Custom hook to interface with the global Pomodoro timer.
 * Exposes the timer state and controls to start, pause, resume, skip, and stop.
 */
export function usePomodoro(): PomodoroState & PomodoroControls {
  const { ui, dispatch: uiDispatch } = usePlannerUI();
  const ps = ui.pomodoroState;

  const start = (assignmentId: string) => {
    uiDispatch({ type: 'START_POMODORO', payload: { assignmentId } });
  };

  const pause = () => {
    uiDispatch({ type: 'PAUSE_POMODORO' });
  };

  const resume = () => {
    uiDispatch({ type: 'RESUME_POMODORO' });
  };

  const skip = () => {
    uiDispatch({ type: 'SKIP_POMODORO_PHASE' });
  };

  const stop = () => {
    uiDispatch({ type: 'STOP_POMODORO' });
  };

  // Calculate percentage of time elapsed
  const totalSeconds = ps.phase === 'work'
    ? 1500
    : ps.phase === 'short_break'
      ? 300
      : 900;

  const progressPercent = ps.isActive
    ? ((totalSeconds - ps.secondsLeft) / totalSeconds) * 100
    : 0;

  return {
    isActive: ps.isActive,
    isPaused: ps.isPaused,
    phase: ps.phase,
    secondsLeft: ps.secondsLeft,
    sessionsCompleted: ps.sessionsCompleted,
    assignmentId: ps.assignmentId,
    progressPercent,
    start,
    pause,
    resume,
    skip,
    stop,
  };
}

export default usePomodoro;
