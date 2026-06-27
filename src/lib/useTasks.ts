import { useCallback, useMemo } from "react";
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

/**
 * Mantém a invariante de exibição: tarefas ativas antes das concluídas,
 * preservando a ordem relativa dentro de cada grupo (ordenação estável).
 */
function partitionByDone(tasks: Task[]): Task[] {
  const active = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);
  return [...active, ...done];
}

export function useTasks() {
  const [stored, setTasks] = useLocalStorage<Task[]>(STORAGE_KEY, []);

  // Ordem de exibição sempre normalizada (ativas antes das concluídas),
  // inclusive para dados salvos em sessões anteriores.
  const tasks = useMemo(() => partitionByDone(stored), [stored]);

  const addTask = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      // A nova tarefa é ativa: entra ao final das ativas, antes das concluídas.
      setTasks((prev) =>
        partitionByDone([
          ...prev,
          { id: createId(), text: trimmed, done: false },
        ]),
      );
    },
    [setTasks],
  );

  const toggleTask = useCallback(
    (id: string) => {
      setTasks((prev) =>
        partitionByDone(
          prev.map((task) =>
            task.id === id ? { ...task, done: !task.done } : task,
          ),
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
        // Reforça a invariante caso a reordenação misture os grupos.
        return partitionByDone(next);
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
