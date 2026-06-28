import { useState, useEffect, useRef } from 'react';

export type Urgency = 'safe' | 'warning' | 'critical';

export interface CountdownResult {
  days:    number;
  hours:   number;
  minutes: number;
  seconds: number;
  urgency: Urgency;
  expired: boolean;
}

/**
 * A leak-free, real-time countdown timer hook.
 * Takes a target ISO date string and returns the remaining time and urgency.
 */
export function useCountdown(targetDate: string): CountdownResult {
  const calculateDelta = (): number => {
    if (!targetDate) return 0;
    const targetMs = new Date(targetDate).getTime();
    return targetMs - Date.now();
  };

  const decompose = (deltaMs: number): Omit<CountdownResult, 'urgency' | 'expired'> => {
    const days    = Math.floor(deltaMs / 86400000);
    const hours   = Math.floor((deltaMs % 86400000) / 3600000);
    const minutes = Math.floor((deltaMs % 3600000) / 60000);
    const seconds = Math.floor((deltaMs % 60000) / 1000);
    return { days, hours, minutes, seconds };
  };

  const getUrgency = (days: number): Urgency => {
    if (days >= 3) return 'safe';
    if (days >= 1) return 'warning';
    return 'critical';
  };

  const [result, setResult] = useState<CountdownResult>(() => {
    const initialDelta = calculateDelta();
    if (initialDelta <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, urgency: 'critical', expired: true };
    }
    const parts = decompose(initialDelta);
    return {
      ...parts,
      urgency: getUrgency(parts.days),
      expired: false,
    };
  });

  const intervalIdRef = useRef<number | null>(null);
  const targetDateRef = useRef(targetDate);
  targetDateRef.current = targetDate;

  useEffect(() => {
    const tick = () => {
      const delta = calculateDelta();
      if (delta <= 0) {
        if (intervalIdRef.current !== null) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }
        setResult({ days: 0, hours: 0, minutes: 0, seconds: 0, urgency: 'critical', expired: true });
        return;
      }

      const parts = decompose(delta);
      setResult({
        ...parts,
        urgency: getUrgency(parts.days),
        expired: false,
      });
    };

    // Run immediately on targetDate change or mount
    tick();

    // If already expired, don't start the interval
    const delta = calculateDelta();
    if (delta > 0) {
      const id = window.setInterval(tick, 1000);
      intervalIdRef.current = id;
    }

    return () => {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [targetDate]);

  return result;
}

export default useCountdown;
