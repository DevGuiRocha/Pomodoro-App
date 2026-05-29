import { useCallback, useMemo } from "react";
import type { ModeId } from "@/lib/modes";
import {
  CUSTOM_PRESET_ID,
  DEFAULT_CUSTOM_DURATIONS,
  DEFAULT_PRESET_ID,
  PRESETS,
  clampMinutes,
  type Durations,
} from "@/lib/presets";
import { useLocalStorage } from "@/lib/useLocalStorage";

const PRESET_KEY = "pomodoro:presetId";
const CUSTOM_KEY = "pomodoro:customDurations";

export function useDurations() {
  const [presetId, setPresetId] = useLocalStorage<string>(
    PRESET_KEY,
    DEFAULT_PRESET_ID,
  );
  const [customDurations, setCustomDurations] = useLocalStorage<Durations>(
    CUSTOM_KEY,
    DEFAULT_CUSTOM_DURATIONS,
  );

  // Durações efetivas: do preset selecionado, ou as personalizadas.
  const durations = useMemo<Durations>(() => {
    if (presetId === CUSTOM_PRESET_ID) return customDurations;
    const preset = PRESETS.find((p) => p.id === presetId);
    return preset
      ? preset.durations
      : PRESETS.find((p) => p.id === DEFAULT_PRESET_ID)!.durations;
  }, [presetId, customDurations]);

  const selectPreset = useCallback(
    (id: string) => {
      setPresetId(id);
    },
    [setPresetId],
  );

  /** Atualiza um campo do modo personalizado e ativa o preset custom. */
  const setCustomDuration = useCallback(
    (mode: ModeId, minutes: number) => {
      setCustomDurations((prev) => ({
        ...prev,
        [mode]: clampMinutes(minutes),
      }));
      setPresetId(CUSTOM_PRESET_ID);
    },
    [setCustomDurations, setPresetId],
  );

  return {
    presetId,
    durations,
    customDurations,
    selectPreset,
    setCustomDuration,
  };
}
