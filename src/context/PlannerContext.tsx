import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { PlannerState, UIState } from '../types';
import { dataReducer } from './dataReducer';
import type { DataAction } from './dataReducer';
import { uiReducer } from './uiReducer';
import type { UIAction } from './uiReducer';
import { initialDataState, initialUIState } from './initialState';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface PlannerDataContextValue {
  data: PlannerState;
  dispatch: React.Dispatch<DataAction>;
}

interface PlannerUIContextValue {
  ui: UIState;
  dispatch: React.Dispatch<UIAction>;
}

const PlannerDataContext = createContext<PlannerDataContextValue | null>(null);
const PlannerUIContext   = createContext<PlannerUIContextValue | null>(null);

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [data, dataDispatch] = useReducer(dataReducer, initialDataState);
  const [ui,   uiDispatch]   = useReducer(uiReducer,   initialUIState);

  // Sync data to localStorage on every change (debounced inside the hook)
  useLocalStorage('planner_data', data, dataDispatch);

  // Theme synchronization side-effect
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = () => {
      const theme = ui.theme;
      const resolved = theme === 'system'
        ? (mediaQuery.matches ? 'dark' : 'light')
        : theme;
      
      root.setAttribute('data-theme', resolved);
    };

    applyTheme();

    if (ui.theme === 'system') {
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [ui.theme]);

  // Centralized Pomodoro timer effect
  const pomodoroState = ui.pomodoroState;
  useEffect(() => {
    if (!pomodoroState.isActive || pomodoroState.isPaused) return;

    const interval = setInterval(() => {
      if (pomodoroState.secondsLeft > 1) {
        uiDispatch({ type: 'TICK_POMODORO' });
      } else {
        // Timer reached 0!
        // 1. Log study session if it was a work phase
        if (pomodoroState.phase === 'work' && pomodoroState.assignmentId) {
          dataDispatch({
            type: 'LOG_STUDY_SESSION',
            payload: {
              assignmentId: pomodoroState.assignmentId,
              durationMins: 25, // 25 minutes
              pomodoroCount: 1,
              notes: 'Completed Pomodoro session',
            },
          });
          
          // Show browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Focus Session Complete!', {
              body: 'Time to take a break!',
              icon: '/icons/icon-192.png',
            });
          }
        } else {
          // Break finished
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Break Over!', {
              body: 'Ready to focus again?',
              icon: '/icons/icon-192.png',
            });
          }
        }

        // 2. Complete phase in UI
        uiDispatch({ type: 'COMPLETE_POMODORO_PHASE' });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    pomodoroState.isActive,
    pomodoroState.isPaused,
    pomodoroState.secondsLeft,
    pomodoroState.phase,
    pomodoroState.assignmentId,
    uiDispatch,
    dataDispatch,
  ]);

  return (
    <PlannerDataContext.Provider value={{ data, dispatch: dataDispatch }}>
      <PlannerUIContext.Provider value={{ ui, dispatch: uiDispatch }}>
        {children}
      </PlannerUIContext.Provider>
    </PlannerDataContext.Provider>
  );
}

export function usePlannerData() {
  const ctx = useContext(PlannerDataContext);
  if (!ctx) {
    throw new Error('usePlannerData must be used inside a PlannerProvider');
  }
  return ctx;
}

export function usePlannerUI() {
  const ctx = useContext(PlannerUIContext);
  if (!ctx) {
    throw new Error('usePlannerUI must be used inside a PlannerProvider');
  }
  return ctx;
}
