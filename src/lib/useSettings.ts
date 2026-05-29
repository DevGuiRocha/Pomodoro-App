import { useCallback } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";

/** Preferências de comportamento do timer. */
export interface Settings {
  /** Se pular um bloco de foco conta como um ciclo de foco concluído. */
  countSkippedFocus: boolean;
}

const STORAGE_KEY = "pomodoro:settings";

const DEFAULT_SETTINGS: Settings = {
  countSkippedFocus: false,
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<Settings>(
    STORAGE_KEY,
    DEFAULT_SETTINGS,
  );

  const setSetting = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [setSettings],
  );

  return { settings, setSetting };
}
