import type { ModeId } from "@/lib/modes";

/** Duração de cada modo, em minutos. */
export type Durations = Record<ModeId, number>;

export interface Preset {
  id: string;
  label: string;
  durations: Durations;
}

/** Presets de exemplo (foco / pausa curta / pausa longa, em minutos). */
export const PRESETS: Preset[] = [
  {
    id: "classic",
    label: "Clássico",
    durations: { focus: 25, shortBreak: 5, longBreak: 15 },
  },
  {
    id: "short",
    label: "Curto",
    durations: { focus: 15, shortBreak: 3, longBreak: 10 },
  },
  {
    id: "extended",
    label: "Estendido",
    durations: { focus: 50, shortBreak: 10, longBreak: 20 },
  },
];

/** Id especial para o modo personalizado pelo usuário. */
export const CUSTOM_PRESET_ID = "custom";

export const DEFAULT_PRESET_ID = "classic";

/** Durações usadas como ponto de partida do modo personalizado. */
export const DEFAULT_CUSTOM_DURATIONS: Durations = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
};

export const MIN_MINUTES = 1;
export const MAX_MINUTES = 180;

/** Limita um valor de minutos ao intervalo permitido (inteiro). */
export function clampMinutes(value: number): number {
  if (Number.isNaN(value)) return MIN_MINUTES;
  return Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, Math.round(value)));
}
