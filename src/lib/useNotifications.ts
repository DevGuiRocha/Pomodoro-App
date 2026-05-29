import { useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";

const ENABLED_KEY = "pomodoro:notificationsEnabled";

type Permission = NotificationPermission | "unsupported";

export function useNotifications() {
  // Preferência do usuário (quer ou não receber notificações).
  const [enabled, setEnabled] = useLocalStorage<boolean>(ENABLED_KEY, false);
  // Estado da permissão concedida pelo navegador.
  const [permission, setPermission] = useState<Permission>("default");

  // Detecta suporte e lê a permissão atual no cliente.
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission);
  }, []);

  const supported = permission !== "unsupported";

  /**
   * Liga/desliga a preferência. Ao ligar, solicita permissão se ainda não
   * tiver sido concedida. Retorna se ficou efetivamente habilitado.
   */
  const toggle = useCallback(async (): Promise<boolean> => {
    if (!supported) return false;

    if (enabled) {
      setEnabled(false);
      return false;
    }

    let perm = Notification.permission;
    if (perm === "default") {
      perm = await Notification.requestPermission();
      setPermission(perm);
    }

    if (perm === "granted") {
      setEnabled(true);
      return true;
    }

    // Negado ou bloqueado: não habilita.
    setEnabled(false);
    return false;
  }, [supported, enabled, setEnabled]);

  /** Dispara uma notificação, respeitando preferência e permissão. */
  const notify = useCallback(
    (title: string, body: string) => {
      if (
        !supported ||
        !enabled ||
        Notification.permission !== "granted" ||
        document.visibilityState === "visible"
      ) {
        // Não notifica quando a aba já está visível — o usuário está vendo.
        return;
      }
      try {
        new Notification(title, { body, icon: "/favicon.ico" });
      } catch {
        // Alguns navegadores exigem Service Worker; falha silenciosa.
      }
    },
    [supported, enabled],
  );

  return { supported, enabled, permission, toggle, notify };
}
