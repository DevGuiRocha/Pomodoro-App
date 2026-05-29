export type ModeId = "focus" | "shortBreak" | "longBreak";

export interface Mode {
  id: ModeId;
  label: string;
  /** Cor de fundo (Tailwind) para o modo. */
  bg: string;
  /** Cor do botão de ação para o modo. */
  accent: string;
}

/**
 * Configuração visual fixa de cada modo. As durações são dinâmicas e
 * vivem em `useDurations` / `presets` (personalizáveis pelo usuário).
 */
export const MODES: Record<ModeId, Mode> = {
  focus: {
    id: "focus",
    label: "Foco",
    bg: "bg-rose-700",
    accent: "text-rose-700",
  },
  shortBreak: {
    id: "shortBreak",
    label: "Pausa Curta",
    bg: "bg-teal-700",
    accent: "text-teal-700",
  },
  longBreak: {
    id: "longBreak",
    label: "Pausa Longa",
    bg: "bg-sky-800",
    accent: "text-sky-800",
  },
};

export const MODE_ORDER: ModeId[] = ["focus", "shortBreak", "longBreak"];

/** Quantos ciclos de foco até uma pausa longa. */
export const CYCLES_UNTIL_LONG_BREAK = 4;
