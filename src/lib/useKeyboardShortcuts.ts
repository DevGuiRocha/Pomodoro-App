import { useEffect } from "react";

export interface ShortcutHandlers {
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
}

/** Não dispara atalhos quando o foco está em um campo editável. */
function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

/**
 * Registra atalhos de teclado globais para o timer. Desativa quando
 * `enabled` é falso (ex.: painel de configurações aberto) e ignora teclas
 * com modificadores ou quando o usuário está digitando.
 */
export function useKeyboardShortcuts(
  handlers: ShortcutHandlers,
  enabled: boolean,
) {
  const { onToggle, onReset, onSkip } = handlers;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (isEditableTarget(e.target)) return;

      switch (e.key) {
        case " ":
        case "Spacebar": // navegadores antigos
          e.preventDefault(); // evita rolar a página
          onToggle();
          break;
        case "r":
        case "R":
          onReset();
          break;
        case "s":
        case "S":
          onSkip();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onToggle, onReset, onSkip]);
}
