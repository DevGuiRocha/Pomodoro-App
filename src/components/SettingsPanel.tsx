"use client";

import { useState } from "react";
import { MODES, MODE_ORDER } from "@/lib/modes";
import {
  CUSTOM_PRESET_ID,
  MAX_MINUTES,
  MIN_MINUTES,
  PRESETS,
  type Durations,
} from "@/lib/presets";
import type { ThemeChoice } from "@/lib/useTheme";

const THEME_OPTIONS: { id: ThemeChoice; label: string; icon: string }[] = [
  { id: "light", label: "Claro", icon: "☀️" },
  { id: "dark", label: "Escuro", icon: "🌙" },
  { id: "system", label: "Sistema", icon: "💻" },
];

type Tab = "time" | "theme" | "notifications";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "time", label: "Tempo", icon: "⏱️" },
  { id: "theme", label: "Tema", icon: "🎨" },
  { id: "notifications", label: "Notificações", icon: "🔔" },
];

interface SettingsPanelProps {
  presetId: string;
  durations: Durations;
  customDurations: Durations;
  onSelectPreset: (id: string) => void;
  onSetCustomDuration: (mode: (typeof MODE_ORDER)[number], minutes: number) => void;
  countSkippedFocus: boolean;
  onSetCountSkippedFocus: (value: boolean) => void;
  notificationsSupported: boolean;
  notificationsEnabled: boolean;
  notificationPermission: NotificationPermission | "unsupported";
  onToggleNotifications: () => void | Promise<boolean>;
  theme: ThemeChoice;
  onSetTheme: (choice: ThemeChoice) => void;
  onClose: () => void;
}

export default function SettingsPanel({
  presetId,
  durations,
  customDurations,
  onSelectPreset,
  onSetCustomDuration,
  countSkippedFocus,
  onSetCountSkippedFocus,
  notificationsSupported,
  notificationsEnabled,
  notificationPermission,
  onToggleNotifications,
  theme,
  onSetTheme,
  onClose,
}: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("time");

  const isCustom = presetId === CUSTOM_PRESET_ID;
  // Valores mostrados nos campos: os personalizados (editáveis a qualquer momento).
  const editable = isCustom ? durations : customDurations;

  const activeTabLabel = TABS.find((t) => t.id === activeTab)?.label ?? "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Configurações"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 text-gray-900 shadow-2xl dark:bg-gray-900 dark:text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{activeTabLabel}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {/* Navegação por abas */}
        <div className="mb-5 flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white text-rose-600 shadow-sm dark:bg-gray-700 dark:text-rose-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <span aria-hidden>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Aba: Tempo */}
        {activeTab === "time" && (
          <div>
            <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Presets
            </p>
            <div className="mb-6 grid grid-cols-1 gap-2">
              {PRESETS.map((preset) => {
                const active = presetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onSelectPreset(preset.id)}
                    className={`flex items-center justify-between rounded-lg border-2 px-4 py-3 text-left transition-colors ${
                      active
                        ? "border-rose-600 bg-rose-50 dark:bg-rose-950/40"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                    }`}
                  >
                    <span className="font-semibold">{preset.label}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {preset.durations.focus} / {preset.durations.shortBreak} /{" "}
                      {preset.durations.longBreak} min
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              className={`rounded-lg border-2 p-4 transition-colors ${
                isCustom
                  ? "border-rose-600 bg-rose-50 dark:bg-rose-950/40"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-semibold">Personalizado</span>
                {isCustom && (
                  <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                    Ativo
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                {MODE_ORDER.map((id) => (
                  <label
                    key={id}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {MODES[id].label}
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={MIN_MINUTES}
                        max={MAX_MINUTES}
                        value={editable[id]}
                        onChange={(e) =>
                          onSetCustomDuration(id, Number(e.target.value))
                        }
                        className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-right outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 dark:border-gray-600 dark:bg-gray-800"
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

            {/* Comportamento ao pular */}
            <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-lg border-2 border-gray-200 px-4 py-3 dark:border-gray-700">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Pular foco conta como ciclo concluído
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={countSkippedFocus}
                onClick={() => onSetCountSkippedFocus(!countSkippedFocus)}
                className={`inline-flex h-6 w-11 shrink-0 items-center rounded-full px-0.5 transition-colors ${
                  countSkippedFocus ? "bg-rose-600" : "bg-gray-300"
                }`}
                aria-label="Pular foco conta como ciclo concluído"
              >
                <span
                  className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    countSkippedFocus ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </label>
          </div>
        )}

        {/* Aba: Tema */}
        {activeTab === "theme" && (
          <div className="grid grid-cols-3 gap-2">
            {THEME_OPTIONS.map((option) => {
              const active = theme === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => onSetTheme(option.id)}
                  className={`flex flex-col items-center gap-1 rounded-lg border-2 px-2 py-3 text-sm transition-colors ${
                    active
                      ? "border-rose-600 bg-rose-50 dark:bg-rose-950/40"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                  }`}
                  aria-pressed={active}
                >
                  <span className="text-lg" aria-hidden>
                    {option.icon}
                  </span>
                  <span className="font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Aba: Notificações */}
        {activeTab === "notifications" && (
          <div>
            {!notificationsSupported ? (
              <p className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                Seu navegador não suporta notificações.
              </p>
            ) : (
              <>
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border-2 border-gray-200 px-4 py-3 dark:border-gray-700">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Avisar quando um ciclo terminar
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={notificationsEnabled}
                    onClick={() => onToggleNotifications()}
                    className={`inline-flex h-6 w-11 shrink-0 items-center rounded-full px-0.5 transition-colors ${
                      notificationsEnabled ? "bg-rose-600" : "bg-gray-300"
                    }`}
                    aria-label="Habilitar notificações"
                  >
                    <span
                      className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        notificationsEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </label>
                {notificationPermission === "denied" && (
                  <p className="mt-2 text-xs text-amber-600">
                    As notificações estão bloqueadas. Libere a permissão nas
                    configurações do navegador para este site.
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-400">
                  As notificações só aparecem quando a aba não está em foco.
                </p>
              </>
            )}
          </div>
        )}

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
