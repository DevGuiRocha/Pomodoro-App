export type ModeId = "focus" | "shortBreak" | "longBreak";

export interface Mode {
  id: ModeId;
  label: string;
  /**
   * Cor de fundo (Tailwind) para o modo. Inclui a variante `dark:` — no
   * tema escuro o fundo fica mais profundo e dessaturado.
   */
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
    bg: "bg-rose-700 dark:bg-rose-950",
    accent: "text-rose-700",
  },
  shortBreak: {
    id: "shortBreak",
    label: "Pausa Curta",
    bg: "bg-teal-700 dark:bg-teal-950",
    accent: "text-teal-700",
  },
  longBreak: {
    id: "longBreak",
    label: "Pausa Longa",
    bg: "bg-sky-800 dark:bg-sky-950",
    accent: "text-sky-800",
  },
};

export const MODE_ORDER: ModeId[] = ["focus", "shortBreak", "longBreak"];
