"use client";

import { useEffect } from "react";
import { MODES, MODE_ORDER, type ModeId } from "@/lib/modes";
import { useTimer } from "@/lib/useTimer";

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

interface TimerProps {
  modeId: ModeId;
  /** Duração do modo atual, em minutos. */
  minutes: number;
  completedFocus: number;
  onSwitchMode: (id: ModeId) => void;
  onComplete: () => void;
  onSkip: () => void;
}

export default function Timer({
  modeId,
  minutes,
  completedFocus,
  onSwitchMode,
  onComplete,
  onSkip,
}: TimerProps) {
  const mode = MODES[modeId];

  const { secondsLeft, isRunning, toggle, reset } = useTimer({
    initialSeconds: minutes * 60,
    onComplete,
  });

  // Ao trocar de modo ou mudar a duração, reinicia o timer.
  useEffect(() => {
    reset(minutes * 60);
  }, [modeId, minutes, reset]);

  // Atualiza o título da aba com o tempo restante.
  useEffect(() => {
    document.title = `${formatTime(secondsLeft)} · ${mode.label}`;
  }, [secondsLeft, mode.label]);

  return (
    <div className="flex flex-col items-center gap-8 text-white">
      {/* Seletor de modos */}
      <div className="flex gap-2 rounded-full bg-black/20 p-1">
        {MODE_ORDER.map((id) => (
          <button
            key={id}
            onClick={() => onSwitchMode(id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              id === modeId
                ? "bg-white/90 " + MODES[id].accent
                : "text-white/80 hover:bg-white/10"
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
          onClick={() => reset(minutes * 60)}
          className="rounded-full bg-black/20 px-6 py-4 text-sm font-medium uppercase tracking-wider transition-colors hover:bg-black/30"
          aria-label="Resetar timer"
        >
          Resetar
        </button>
        <button
          onClick={onSkip}
          className="rounded-full bg-black/20 px-6 py-4 text-sm font-medium uppercase tracking-wider transition-colors hover:bg-black/30"
          aria-label="Pular para o próximo ciclo"
          title="Pular para o próximo ciclo"
        >
          Pular ⏭
        </button>
      </div>

      {/* Contador de ciclos */}
      <p className="text-sm text-white/80">
        Focos concluídos: <span className="font-bold">{completedFocus}</span>
      </p>
    </div>
  );
}
