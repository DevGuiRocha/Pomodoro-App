import { useCallback, useEffect } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";

export type ThemeChoice = "light" | "dark" | "system";

export const THEME_KEY = "pomodoro:theme";

/** Resolve a escolha em claro/escuro, consultando o sistema quando "system". */
function resolveTheme(choice: ThemeChoice): "light" | "dark" {
  if (choice === "system") {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return choice;
}

/** Aplica/remove a classe `dark` no <html>. */
function applyTheme(resolved: "light" | "dark") {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
}

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<ThemeChoice>(THEME_KEY, "system");

  // Aplica o tema sempre que a escolha mudar.
  useEffect(() => {
    applyTheme(resolveTheme(theme));
  }, [theme]);

  // Quando em "system", reage a mudanças da preferência do SO em tempo real.
  useEffect(() => {
    if (theme !== "system" || typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme(resolveTheme("system"));
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  const setThemeChoice = useCallback(
    (choice: ThemeChoice) => setTheme(choice),
    [setTheme],
  );

  return { theme, setTheme: setThemeChoice };
}
