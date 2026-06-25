"use client";

import { useState, useRef } from "react";
import { useTasks } from "@/lib/useTasks";

export default function TaskList() {
  const { tasks, addTask, toggleTask, removeTask, renameTask, clearCompleted, reorderTask } =
    useTasks();
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  // Índices do arrasto em andamento.
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(input);
    setInput("");
  };

  const startEditing = (id: string, text: string) => {
    setEditingId(id);
    setEditingText(text);
    setTimeout(() => editInputRef.current?.select(), 0);
  };

  const commitEdit = () => {
    if (editingId) renameTask(editingId, editingText);
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") cancelEdit();
  };

  const handleDrop = () => {
    if (dragIndex !== null && overIndex !== null) {
      reorderTask(dragIndex, overIndex);
    }
    setDragIndex(null);
    setOverIndex(null);
  };

  const remaining = tasks.filter((t) => !t.done).length;
  const hasCompleted = tasks.some((t) => t.done);

  return (
    <div className="w-full rounded-2xl bg-black/20 p-5 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Tarefas</h2>
        {tasks.length > 0 && (
          <span className="text-sm text-white/70">{remaining} restante(s)</span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="O que você vai fazer?"
          maxLength={140}
          className="flex-1 rounded-lg bg-white/90 px-3 py-2 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-white"
        />
        <button
          type="submit"
          className="rounded-lg bg-white/90 px-4 py-2 font-bold text-gray-900 transition-colors hover:bg-white disabled:opacity-50"
          disabled={!input.trim()}
        >
          Adicionar
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className="py-4 text-center text-sm text-white/60">
          Nenhuma tarefa ainda. Adicione uma acima! 👆
        </p>
      ) : (
        <>
          {tasks.length > 1 && (
            <p className="mb-2 text-xs text-white/50">
              Arraste pela alça <span aria-hidden>⠿</span> para priorizar (mais
              acima = mais urgente).
            </p>
          )}
          <ul className="flex flex-col gap-2">
            {tasks.map((task, index) => (
              <li
                key={task.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (overIndex !== index) setOverIndex(index);
                }}
                onDrop={handleDrop}
                className={`group flex items-center gap-2 rounded-lg bg-white/10 px-2 py-2 text-white transition-all ${
                  dragIndex === index ? "opacity-40" : ""
                } ${
                  overIndex === index && dragIndex !== index
                    ? "ring-2 ring-white/70"
                    : ""
                }`}
              >
                <span
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragEnd={handleDrop}
                  className="shrink-0 cursor-grab select-none px-1 text-white/40 transition-colors hover:text-white/80 active:cursor-grabbing"
                  aria-label="Arrastar para reordenar"
                  title="Arrastar para reordenar"
                >
                  ⠿
                </span>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  className="h-5 w-5 shrink-0 cursor-pointer accent-white"
                  aria-label={`Marcar "${task.text}" como concluída`}
                />
                {editingId === task.id ? (
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editingText}
                    maxLength={140}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={handleEditKeyDown}
                    className="flex-1 rounded bg-white/90 px-2 py-0.5 text-gray-900 outline-none focus:ring-2 focus:ring-white"
                    aria-label="Editar tarefa"
                  />
                ) : (
                  <span
                    className={`flex-1 break-words ${task.done ? "text-white/50 line-through" : "cursor-text"}`}
                    onDoubleClick={() => !task.done && startEditing(task.id, task.text)}
                    title={task.done ? undefined : "Duplo clique para editar"}
                  >
                    {task.text}
                  </span>
                )}
                <button
                  onClick={() => removeTask(task.id)}
                  className="shrink-0 rounded p-1 text-white/50 opacity-0 transition-opacity hover:text-white group-hover:opacity-100 focus:opacity-100"
                  aria-label={`Remover "${task.text}"`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {hasCompleted && (
        <button
          onClick={clearCompleted}
          className="mt-4 w-full rounded-lg bg-black/20 py-2 text-sm text-white/80 transition-colors hover:bg-black/30"
        >
          Limpar concluídas
        </button>
      )}
    </div>
  );
}
