"use client";

import { MODES, MODE_ORDER } from "@/lib/modes";
import {
  CUSTOM_PRESET_ID,
  MAX_MINUTES,
  MIN_MINUTES,
  PRESETS,
  type Durations,
} from "@/lib/presets";

interface SettingsPanelProps {
  presetId: string;
  durations: Durations;
  customDurations: Durations;
  onSelectPreset: (id: string) => void;
  onSetCustomDuration: (mode: (typeof MODE_ORDER)[number], minutes: number) => void;
  onClose: () => void;
}

export default function SettingsPanel({
  presetId,
  durations,
  customDurations,
  onSelectPreset,
  onSetCustomDuration,
  onClose,
}: SettingsPanelProps) {
  const isCustom = presetId === CUSTOM_PRESET_ID;
  // Valores mostrados nos campos: os personalizados (editáveis a qualquer momento).
  const editable = isCustom ? durations : customDurations;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Configurações de tempo"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 text-gray-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Tempos</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {/* Presets prontos */}
        <p className="mb-2 text-sm font-medium text-gray-500">Presets</p>
        <div className="mb-6 grid grid-cols-1 gap-2">
          {PRESETS.map((preset) => {
            const active = presetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset.id)}
                className={`flex items-center justify-between rounded-lg border-2 px-4 py-3 text-left transition-colors ${
                  active
                    ? "border-rose-600 bg-rose-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="font-semibold">{preset.label}</span>
                <span className="text-sm text-gray-500">
                  {preset.durations.focus} / {preset.durations.shortBreak} /{" "}
                  {preset.durations.longBreak} min
                </span>
              </button>
            );
          })}
        </div>

        {/* Personalizado */}
        <div
          className={`rounded-lg border-2 p-4 transition-colors ${
            isCustom ? "border-rose-600 bg-rose-50" : "border-gray-200"
          }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold">Personalizado</span>
            {isCustom && (
              <span className="text-xs font-medium text-rose-600">Ativo</span>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {MODE_ORDER.map((id) => (
              <label key={id} className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-700">{MODES[id].label}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={MIN_MINUTES}
                    max={MAX_MINUTES}
                    value={editable[id]}
                    onChange={(e) =>
                      onSetCustomDuration(id, Number(e.target.value))
                    }
                    className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-right outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                  <span className="text-sm text-gray-400">min</span>
                </div>
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Entre {MIN_MINUTES} e {MAX_MINUTES} minutos. Editar ativa o modo
            personalizado.
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-rose-600 py-3 font-bold text-white transition-colors hover:bg-rose-700"
        >
          Pronto
        </button>
      </div>
    </div>
  );
}
