import { useCallback, useEffect, useRef, useState } from "react";

interface UseTimerOptions {
  /** Duração inicial em segundos. */
  initialSeconds: number;
  /** Chamado quando o timer chega a zero. */
  onComplete?: () => void;
}

interface UseTimerResult {
  secondsLeft: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  toggle: () => void;
  /** Reinicia para uma nova duração (em segundos) e pausa. */
  reset: (seconds: number) => void;
}

/**
 * Timer baseado em timestamp (não em contagem de ticks), para que a
 * contagem permaneça precisa mesmo se a aba ficar em segundo plano.
 */
export function useTimer({
  initialSeconds,
  onComplete,
}: UseTimerOptions): UseTimerResult {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  // Momento (ms) em que o timer deve chegar a zero.
  const deadlineRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setIsRunning((running) => {
      if (running) return running;
      setSecondsLeft((current) => {
        deadlineRef.current = Date.now() + current * 1000;
        return current;
      });
      return true;
    });
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
    deadlineRef.current = null;
  }, []);

  const toggle = useCallback(() => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  }, [isRunning, pause, start]);

  const reset = useCallback((seconds: number) => {
    setIsRunning(false);
    deadlineRef.current = null;
    setSecondsLeft(seconds);
  }, []);

  useEffect(() => {
    if (!isRunning) {
      clearTick();
      return;
    }

    const tick = () => {
      if (deadlineRef.current === null) return;
      const remaining = Math.round((deadlineRef.current - Date.now()) / 1000);
      if (remaining <= 0) {
        setSecondsLeft(0);
        setIsRunning(false);
        deadlineRef.current = null;
        clearTick();
        onCompleteRef.current?.();
      } else {
        setSecondsLeft(remaining);
      }
    };

    tick();
    intervalRef.current = setInterval(tick, 250);
    return clearTick;
  }, [isRunning, clearTick]);

  return { secondsLeft, isRunning, start, pause, toggle, reset };
}
