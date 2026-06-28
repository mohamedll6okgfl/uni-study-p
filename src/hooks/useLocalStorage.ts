import { useEffect, useRef } from 'react';
import type { PlannerState } from '../types';
import type { DataAction } from '../context/dataReducer';

/**
 * Custom hook to sync the PlannerState with localStorage.
 * Handles initial hydration, debounced writes, and cross-tab sync.
 */
export function useLocalStorage(
  key: string,
  state: PlannerState,
  dispatch: React.Dispatch<DataAction>
): void {
  const isHydratedRef = useRef(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Hydration on mount + Cross-tab sync setup
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && parsed.courses && parsed.assignments) {
          dispatch({ type: 'HYDRATE', payload: parsed });
        }
      }
    } catch (e) {
      console.warn(`[useLocalStorage] Failed to parse data for key "${key}":`, e);
    } finally {
      // Set to true after trying to read the initial value
      isHydratedRef.current = true;
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue && event.storageArea === localStorage) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (parsed && typeof parsed === 'object' && parsed.courses && parsed.assignments) {
            dispatch({ type: 'HYDRATE', payload: parsed });
          }
        } catch (e) {
          console.warn(`[useLocalStorage] Failed to parse cross-tab update for key "${key}":`, e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, dispatch]);

  // Debounced persistence on state changes
  useEffect(() => {
    // Prevent overwriting localStorage with initial state before hydration has occurred
    if (!isHydratedRef.current) return;

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(stateRef.current));
      } catch (e) {
        // Handle QuotaExceededError or other write failures
        console.error(`[useLocalStorage] Failed to write to localStorage for key "${key}":`, e);
      }
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(timeoutId);
    };
  }, [key, state]);
}
export default useLocalStorage;
