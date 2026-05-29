"use client";

import { useCallback, useState } from "react";
import {
  CYCLES_UNTIL_LONG_BREAK,
  MODES,
  type ModeId,
} from "@/lib/modes";
import { useDurations } from "@/lib/useDurations";
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

  const mode = MODES[modeId];

  const handleComplete = useCallback(() => {
    playBeep();

    if (modeId === "focus") {
      const next = completedFocus + 1;
      setCompletedFocus(next);
      // A cada N focos, vai para a pausa longa; senão, pausa curta.
      setModeId(
        next % CYCLES_UNTIL_LONG_BREAK === 0 ? "longBreak" : "shortBreak",
      );
    } else {
      setModeId("focus");
    }
  }, [modeId, completedFocus]);

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
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}
