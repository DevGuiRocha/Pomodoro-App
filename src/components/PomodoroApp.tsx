"use client";

import { useCallback, useState } from "react";
import {
  CYCLES_UNTIL_LONG_BREAK,
  MODES,
  type ModeId,
} from "@/lib/modes";
import { useDurations } from "@/lib/useDurations";
import { useNotifications } from "@/lib/useNotifications";
import { useTheme } from "@/lib/useTheme";
import { useSettings } from "@/lib/useSettings";
import { playBeep } from "@/lib/sound";
import Timer from "@/components/Timer";
import TaskList from "@/components/TaskList";
import SettingsPanel from "@/components/SettingsPanel";

export default function PomodoroApp() {
  const [modeId, setModeId] = useState<ModeId>("focus");
  // Quantos blocos de foco já foram concluídos.
  const [completedFocus, setCompletedFocus] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const {
    presetId,
    durations,
    customDurations,
    selectPreset,
    setCustomDuration,
  } = useDurations();

  const notifications = useNotifications();
  const { theme, setTheme } = useTheme();
  const { settings, setSetting } = useSettings();

  const mode = MODES[modeId];

  /**
   * Avança para o próximo modo na sequência do Pomodoro.
   *
   * Ao sair de um FOCO, o avanço só conta como ciclo concluído quando
   * `countThisFocus` é verdadeiro. A decisão pausa curta/longa é sempre
   * baseada no número de focos que o contador EFETIVAMENTE terá — assim
   * pular sem contar não desalinha o ritmo da pausa longa.
   *
   * Retorna `true` se o próximo modo for a pausa longa.
   */
  const advanceMode = useCallback(
    (countThisFocus: boolean) => {
      if (modeId === "focus") {
        // Total de focos após este avanço (incrementa só se contar).
        const effective = countThisFocus ? completedFocus + 1 : completedFocus;
        if (countThisFocus) setCompletedFocus(effective);

        // Vai para pausa longa quando o foco contado fecha um múltiplo do
        // ciclo. Se o foco não conta, nunca dispara a pausa longa.
        const goLong =
          countThisFocus && effective % CYCLES_UNTIL_LONG_BREAK === 0;
        setModeId(goLong ? "longBreak" : "shortBreak");
        return goLong;
      }
      setModeId("focus");
      return false;
    },
    [modeId, completedFocus],
  );

  const handleComplete = useCallback(() => {
    playBeep();

    if (modeId === "focus") {
      const goLong = advanceMode(true);
      notifications.notify(
        "Foco concluído! 🍅",
        goLong
          ? "Hora de uma pausa longa. Você merece!"
          : "Hora de uma pausa curta.",
      );
    } else {
      advanceMode(true);
      notifications.notify("Pausa encerrada", "Bora focar novamente! 💪");
    }
  }, [modeId, advanceMode, notifications]);

  // Pular: avança de modo manualmente, sem som/notificação. Pular um foco só
  // conta como ciclo se o usuário ativou essa preferência.
  const handleSkip = useCallback(() => {
    advanceMode(settings.countSkippedFocus);
  }, [advanceMode, settings.countSkippedFocus]);

  const switchMode = useCallback(
    (id: ModeId) => {
      if (id !== modeId) setModeId(id);
    },
    [modeId],
  );

  return (
    <div
      className={`relative flex min-h-screen items-center justify-center p-6 py-12 transition-colors duration-500 ${mode.bg}`}
    >
      {/* Botão de configurações */}
      <button
        onClick={() => setSettingsOpen(true)}
        className="absolute right-4 top-4 rounded-full bg-black/20 p-3 text-xl text-white transition-colors hover:bg-black/30"
        aria-label="Configurar tempos"
        title="Configurar tempos"
      >
        ⚙️
      </button>

      <div className="flex w-full max-w-5xl flex-col items-center justify-center gap-10 lg:flex-row lg:items-start lg:gap-16">
        <div className="flex flex-1 justify-center lg:py-8">
          <Timer
            modeId={modeId}
            minutes={durations[modeId]}
            completedFocus={completedFocus}
            onSwitchMode={switchMode}
            onComplete={handleComplete}
            onSkip={handleSkip}
            shortcutsEnabled={!settingsOpen}
          />
        </div>
        <div className="w-full lg:w-96 lg:py-8">
          <TaskList />
        </div>
      </div>

      {settingsOpen && (
        <SettingsPanel
          presetId={presetId}
          durations={durations}
          customDurations={customDurations}
          onSelectPreset={selectPreset}
          onSetCustomDuration={setCustomDuration}
          countSkippedFocus={settings.countSkippedFocus}
          onSetCountSkippedFocus={(value) =>
            setSetting("countSkippedFocus", value)
          }
          notificationsSupported={notifications.supported}
          notificationsEnabled={notifications.enabled}
          notificationPermission={notifications.permission}
          onToggleNotifications={notifications.toggle}
          theme={theme}
          onSetTheme={setTheme}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}
