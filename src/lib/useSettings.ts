import { useCallback } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";

/** Preferências de comportamento do timer. */
export interface Settings {
  /** Se pular um bloco de foco conta como um ciclo de foco concluído. */
  countSkippedFocus: boolean;
  /** Quantos focos concluídos até disparar uma pausa longa. */
  cyclesUntilLongBreak: number;
}

const STORAGE_KEY = "pomodoro:settings";

export const MIN_CYCLES = 1;
export const MAX_CYCLES = 12;

const DEFAULT_SETTINGS: Settings = {
  countSkippedFocus: false,
  cyclesUntilLongBreak: 4,
};

/** Limita os ciclos ao intervalo permitido (inteiro). */
export function clampCycles(value: number): number {
  if (Number.isNaN(value)) return DEFAULT_SETTINGS.cyclesUntilLongBreak;
  return Math.min(MAX_CYCLES, Math.max(MIN_CYCLES, Math.round(value)));
}

export function useSettings() {
  const [stored, setSettings] = useLocalStorage<Settings>(
    STORAGE_KEY,
    DEFAULT_SETTINGS,
  );

  // Garante defaults para chaves ausentes (ex.: dados salvos antes de uma
  // nova preferência ser adicionada).
  const settings: Settings = { ...DEFAULT_SETTINGS, ...stored };

  const setSetting = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [setSettings],
  );

  return { settings, setSetting };
}
