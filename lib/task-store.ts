"use client";

import { create } from "zustand";
import type { Task } from "@/db/schema";
import type { UpdateTaskInput } from "@/lib/validations/task";

function parseTaskDates(task: Task): Task {
  return {
    ...task,
    createdAt: task.createdAt instanceof Date ? task.createdAt : new Date(task.createdAt as unknown as string),
    dueDate: task.dueDate instanceof Date ? task.dueDate : task.dueDate ? new Date(task.dueDate as unknown as string) : null,
  };
}

function toTaskData(data: UpdateTaskInput): Partial<Task> {
  return {
    ...(data.completed !== undefined ? { completed: data.completed } : {}),
    ...(data.title !== undefined ? { title: data.title } : {}),
    ...(data.priority !== undefined ? { priority: data.priority } : {}),
    ...(data.dueDate !== undefined
      ? { dueDate: data.dueDate ? new Date(`${data.dueDate}T00:00:00.000Z`) : null }
      : {}),
  };
}

type StatusFilter = "all" | "open" | "completed";
type PriorityFilter = "all" | "low" | "medium" | "high";
type SortOption = "createdAt" | "dueDate" | "priority";

type TaskStore = {
  tasks: Task[];
  pendingTaskIds: Set<number>;
  statusFilter: StatusFilter;
  priorityFilter: PriorityFilter;
  sortBy: SortOption;
  initialize: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  replaceTask: (task: Task) => void;
  setStatusFilter: (value: StatusFilter) => void;
  setPriorityFilter: (value: PriorityFilter) => void;
  setSortBy: (value: SortOption) => void;
  toggleComplete: (id: number) => Promise<void>;
  updateTask: (id: number, data: UpdateTaskInput) => Promise<boolean>;
  deleteTask: (id: number) => Promise<void>;
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  pendingTaskIds: new Set(),
  statusFilter: "all",
  priorityFilter: "all",
  sortBy: "createdAt",
  initialize: (tasks) => set((state) => ({ tasks: state.tasks.length === 0 ? tasks : state.tasks })),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, parseTaskDates(task)] })),
  replaceTask: (task) => set((state) => ({ tasks: state.tasks.map((t) => (t.id === task.id ? parseTaskDates(task) : t)) })),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setPriorityFilter: (priorityFilter) => set({ priorityFilter }),
  setSortBy: (sortBy) => set({ sortBy }),

  toggleComplete: async (id) => {
    const task = get().tasks.find((item) => item.id === id);
    if (!task || get().pendingTaskIds.has(id)) return;
    await get().updateTask(id, { completed: !task.completed });
  },

  updateTask: async (id, data) => {
    const currentTask = get().tasks.find((task) => task.id === id);
    if (!currentTask || get().pendingTaskIds.has(id)) return false;
    set((state) => ({
      tasks: state.tasks.map((task) => task.id === id ? { ...task, ...toTaskData(data) } : task),
      pendingTaskIds: new Set(state.pendingTaskIds).add(id),
    }));
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Unable to update the task.");
      const updatedTask = parseTaskDates((await response.json()) as Task);
      set((state) => ({ tasks: state.tasks.map((task) => task.id === id ? updatedTask : task) }));
      return true;
    } catch {
      set((state) => ({ tasks: state.tasks.map((task) => task.id === id ? currentTask : task) }));
      return false;
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
    if (!currentTask || get().pendingTaskIds.has(id)) return;
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id), pendingTaskIds: new Set(state.pendingTaskIds).add(id) }));
    try {
      const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Unable to delete the task.");
    } catch {
      set((state) => ({ tasks: [...state.tasks, currentTask].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()) }));
    } finally {
      set((state) => {
        const pendingTaskIds = new Set(state.pendingTaskIds);
        pendingTaskIds.delete(id);
        return { pendingTaskIds };
      });
    }
  },
}));

export type { PriorityFilter, SortOption, StatusFilter };
