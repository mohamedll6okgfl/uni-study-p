import type { UIState, FilterState } from '../types';
import { initialFilterState } from './initialState';

export type UIAction =
  | { type: 'SET_THEME';             payload: 'light' | 'dark' | 'system' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_ACTIVE_VIEW';       payload: string }
  | { type: 'SET_ACTIVE_COURSE';     payload: string | null }
  | { type: 'SET_FILTER';            payload: Partial<FilterState> }
  | { type: 'RESET_FILTER' }
  | { type: 'START_POMODORO';        payload: { assignmentId: string } }
  | { type: 'TICK_POMODORO' }
  | { type: 'PAUSE_POMODORO' }
  | { type: 'RESUME_POMODORO' }
  | { type: 'SKIP_POMODORO_PHASE' }
  | { type: 'STOP_POMODORO' }
  | { type: 'COMPLETE_POMODORO_PHASE' };

export function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case 'SET_THEME': {
      const theme = action.payload;
      // Note: Actual DOM manipulation for theme should be handled by a side effect / Context,
      // but we can set the attribute here or let the context do it in a useEffect.
      // Doing it in a useEffect is cleaner, but let's keep the reducer pure.
      return { ...state, theme };
    }

    case 'TOGGLE_SIDEBAR': {
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    }

    case 'SET_ACTIVE_VIEW': {
      return { ...state, activeView: action.payload };
    }

    case 'SET_ACTIVE_COURSE': {
      return { ...state, activeCourseId: action.payload };
    }

    case 'SET_FILTER': {
      return {
        ...state,
        filterState: {
          ...state.filterState,
          ...action.payload,
        },
      };
    }

    case 'RESET_FILTER': {
      return {
        ...state,
        filterState: {
          ...initialFilterState,
        },
      };
    }

    case 'START_POMODORO': {
      const { assignmentId } = action.payload;
      return {
        ...state,
        pomodoroState: {
          isActive: true,
          isPaused: false,
          assignmentId,
          phase: 'work',
          secondsLeft: 1500, // 25 minutes
          sessionsCompleted: 0,
        },
      };
    }

    case 'TICK_POMODORO': {
      const ps = state.pomodoroState;
      if (!ps.isActive || ps.isPaused || ps.secondsLeft <= 0) return state;
      return {
        ...state,
        pomodoroState: {
          ...ps,
          secondsLeft: ps.secondsLeft - 1,
        },
      };
    }

    case 'PAUSE_POMODORO': {
      const ps = state.pomodoroState;
      if (!ps.isActive) return state;
      return {
        ...state,
        pomodoroState: {
          ...ps,
          isPaused: true,
        },
      };
    }

    case 'RESUME_POMODORO': {
      const ps = state.pomodoroState;
      if (!ps.isActive) return state;
      return {
        ...state,
        pomodoroState: {
          ...ps,
          isPaused: false,
        },
      };
    }

    case 'SKIP_POMODORO_PHASE': {
      const ps = state.pomodoroState;
      if (!ps.isActive) return state;
      
      const isWork = ps.phase === 'work';
      const newSessionsCompleted = isWork ? ps.sessionsCompleted + 1 : ps.sessionsCompleted;
      const nextPhase = isWork
        ? (newSessionsCompleted % 4 === 0 ? 'long_break' : 'short_break')
        : 'work';
      
      const durations = { work: 1500, short_break: 300, long_break: 900 };
      
      return {
        ...state,
        pomodoroState: {
          ...ps,
          phase: nextPhase,
          secondsLeft: durations[nextPhase],
          sessionsCompleted: newSessionsCompleted,
        },
      };
    }

    case 'STOP_POMODORO': {
      return {
        ...state,
        pomodoroState: {
          isActive: false,
          isPaused: false,
          assignmentId: null,
          phase: 'work',
          secondsLeft: 1500,
          sessionsCompleted: 0,
        },
      };
    }

    case 'COMPLETE_POMODORO_PHASE': {
      const ps = state.pomodoroState;
      if (!ps.isActive) return state;
      
      const isWork = ps.phase === 'work';
      const newSessionsCompleted = isWork ? ps.sessionsCompleted + 1 : ps.sessionsCompleted;
      const nextPhase = isWork
        ? (newSessionsCompleted % 4 === 0 ? 'long_break' : 'short_break')
        : 'work';
      
      const durations = { work: 1500, short_break: 300, long_break: 900 };
      
      return {
        ...state,
        pomodoroState: {
          ...ps,
          phase: nextPhase,
          secondsLeft: durations[nextPhase],
          sessionsCompleted: newSessionsCompleted,
        },
      };
    }

    default:
      return state;
  }
}
