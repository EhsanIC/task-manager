"use client";

import { create } from "zustand";
import type { Task } from "@/db/schema";

type TaskStore = {
  tasks: Task[];
  pendingTaskIds: Set<number>;
  initialize: (tasks: Task[]) => void;
  toggleComplete: (id: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  pendingTaskIds: new Set(),

  initialize: (tasks) => {
    set((state) => ({
      tasks: state.tasks.length === 0 ? tasks : state.tasks,
    }));
  },

  toggleComplete: async (id) => {
    const currentTask = get().tasks.find((task) => task.id === id);

    if (!currentTask || get().pendingTaskIds.has(id)) {
      return;
    }

    const nextCompleted = !currentTask.completed;
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: nextCompleted } : task,
      ),
      pendingTaskIds: new Set(state.pendingTaskIds).add(id),
    }));

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: nextCompleted }),
      });

      if (!response.ok) {
        throw new Error("Unable to update the task.");
      }
    } catch {
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, completed: currentTask.completed } : task,
        ),
      }));
    } finally {
      set((state) => {
        const pendingTaskIds = new Set(state.pendingTaskIds);
        pendingTaskIds.delete(id);
        return { pendingTaskIds };
      });
    }
  },

  deleteTask: async (id) => {
    const currentTask = get().tasks.find((task) => task.id === id);

    if (!currentTask || get().pendingTaskIds.has(id)) {
      return;
    }

    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
      pendingTaskIds: new Set(state.pendingTaskIds).add(id),
    }));

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete the task.");
      }
    } catch {
      set((state) => ({
        tasks: [...state.tasks, currentTask].sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
        ),
      }));
    } finally {
      set((state) => {
        const pendingTaskIds = new Set(state.pendingTaskIds);
        pendingTaskIds.delete(id);
        return { pendingTaskIds };
      });
    }
  },
}));
