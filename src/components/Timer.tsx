"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CYCLES_UNTIL_LONG_BREAK,
  MODES,
  MODE_ORDER,
  type ModeId,
} from "@/lib/modes";
import { useTimer } from "@/lib/useTimer";
import { playBeep } from "@/lib/sound";

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function Timer() {
  const [modeId, setModeId] = useState<ModeId>("focus");
  // Quantos blocos de foco já foram concluídos.
  const [completedFocus, setCompletedFocus] = useState(0);

  const mode = MODES[modeId];

  const handleComplete = useCallback(() => {
    playBeep();

    if (modeId === "focus") {
      const next = completedFocus + 1;
      setCompletedFocus(next);
      // A cada N focos, vai para a pausa longa; senão, pausa curta.
      setModeId(next % CYCLES_UNTIL_LONG_BREAK === 0 ? "longBreak" : "shortBreak");
    } else {
      setModeId("focus");
    }
  }, [modeId, completedFocus]);

  const { secondsLeft, isRunning, toggle, reset } = useTimer({
    initialSeconds: mode.minutes * 60,
    onComplete: handleComplete,
  });

  // Ao trocar de modo, reinicia o timer para a nova duração.
  useEffect(() => {
    reset(mode.minutes * 60);
  }, [modeId, mode.minutes, reset]);

  // Atualiza o título da aba com o tempo restante.
  useEffect(() => {
    document.title = `${formatTime(secondsLeft)} · ${mode.label}`;
  }, [secondsLeft, mode.label]);

  const switchMode = (id: ModeId) => {
    if (id !== modeId) setModeId(id);
  };

  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-center gap-8 p-6 text-white transition-colors duration-500 ${mode.bg}`}
    >
      {/* Seletor de modos */}
      <div className="flex gap-2 rounded-full bg-black/20 p-1">
        {MODE_ORDER.map((id) => (
          <button
            key={id}
            onClick={() => switchMode(id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              id === modeId ? "bg-white/90 " + MODES[id].accent : "text-white/80 hover:bg-white/10"
            }`}
          >
            {MODES[id].label}
          </button>
        ))}
      </div>

      {/* Display do tempo */}
      <div className="text-center">
        <p className="font-mono text-[7rem] font-bold leading-none tabular-nums sm:text-[10rem]">
          {formatTime(secondsLeft)}
        </p>
      </div>

      {/* Controles */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className={`rounded-full bg-white px-12 py-4 text-xl font-bold uppercase tracking-wider shadow-lg transition-transform hover:scale-105 active:scale-95 ${mode.accent}`}
        >
          {isRunning ? "Pausar" : "Iniciar"}
        </button>
        <button
          onClick={() => reset(mode.minutes * 60)}
          className="rounded-full bg-black/20 px-6 py-4 text-sm font-medium uppercase tracking-wider transition-colors hover:bg-black/30"
          aria-label="Resetar timer"
        >
          Resetar
        </button>
      </div>

      {/* Contador de ciclos */}
      <p className="text-sm text-white/80">
        Focos concluídos: <span className="font-bold">{completedFocus}</span>
      </p>
    </div>
  );
}
