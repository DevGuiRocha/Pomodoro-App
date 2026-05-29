import { useCallback, useEffect, useState } from "react";

/**
 * Estado sincronizado com o localStorage. Faz a leitura inicial apenas
 * após a montagem para evitar divergência de hidratação (SSR/cliente).
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  // Lê do localStorage uma vez, no cliente.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored) as T);
      }
    } catch {
      // Ignora JSON inválido ou acesso bloqueado.
    }
    setHydrated(true);
  }, [key]);

  // Persiste mudanças (apenas depois de hidratar, para não sobrescrever
  // o valor salvo com o initialValue no primeiro render).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Armazenamento cheio ou indisponível.
    }
  }, [key, value, hydrated]);

  const setStoredValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue(next);
    },
    [],
  );

  return [value, setStoredValue];
}
