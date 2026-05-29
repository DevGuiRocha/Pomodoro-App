export type ModeId = "focus" | "shortBreak" | "longBreak";

export interface Mode {
  id: ModeId;
  label: string;
  /** Duração em minutos. */
  minutes: number;
  /** Cor de fundo (Tailwind) para o modo. */
  bg: string;
  /** Cor do botão de ação para o modo. */
  accent: string;
}

export const MODES: Record<ModeId, Mode> = {
  focus: {
    id: "focus",
    label: "Foco",
    minutes: 25,
    bg: "bg-rose-700",
    accent: "text-rose-700",
  },
  shortBreak: {
    id: "shortBreak",
    label: "Pausa Curta",
    minutes: 5,
    bg: "bg-teal-700",
    accent: "text-teal-700",
  },
  longBreak: {
    id: "longBreak",
    label: "Pausa Longa",
    minutes: 15,
    bg: "bg-sky-800",
    accent: "text-sky-800",
  },
};

export const MODE_ORDER: ModeId[] = ["focus", "shortBreak", "longBreak"];

/** Quantos ciclos de foco até uma pausa longa. */
export const CYCLES_UNTIL_LONG_BREAK = 4;
