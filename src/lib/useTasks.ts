import { useCallback } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";

export interface Task {
  id: string;
  text: string;
  done: boolean;
}

const STORAGE_KEY = "pomodoro:tasks";

function createId(): string {
  // crypto.randomUUID está disponível em todos os navegadores modernos;
  // o fallback cobre ambientes antigos.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEY, []);

  const addTask = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setTasks((prev) => [
        ...prev,
        { id: createId(), text: trimmed, done: false },
      ]);
    },
    [setTasks],
  );

  const toggleTask = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, done: !task.done } : task,
        ),
      );
    },
    [setTasks],
  );

  const removeTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    },
    [setTasks],
  );

  const renameTask = useCallback(
    (id: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, text: trimmed } : task)),
      );
    },
    [setTasks],
  );

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((task) => !task.done));
  }, [setTasks]);

  /** Move a tarefa do índice `from` para a posição `to`, reordenando a lista. */
  const reorderTask = useCallback(
    (from: number, to: number) => {
      setTasks((prev) => {
        if (
          from === to ||
          from < 0 ||
          to < 0 ||
          from >= prev.length ||
          to >= prev.length
        ) {
          return prev;
        }
        const next = [...prev];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        return next;
      });
    },
    [setTasks],
  );

  return {
    tasks,
    addTask,
    toggleTask,
    removeTask,
    renameTask,
    clearCompleted,
    reorderTask,
  };
}
