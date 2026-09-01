"use client";

import { CheckCircle2, Circle, Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Task } from "@/db/schema";
import { TaskForm } from "@/components/task-form";
import { useTaskStore } from "@/lib/task-store";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

const priorityStyles = {
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  high: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export function TaskList({ tasks: initialTasks }: { tasks: Task[] }) {
  const tasks = useTaskStore((state) => state.tasks);
  const pendingTaskIds = useTaskStore((state) => state.pendingTaskIds);
  const initialize = useTaskStore((state) => state.initialize);
  const toggleComplete = useTaskStore((state) => state.toggleComplete);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const statusFilter = useTaskStore((state) => state.statusFilter);
  const priorityFilter = useTaskStore((state) => state.priorityFilter);
  const sortBy = useTaskStore((state) => state.sortBy);
  const setStatusFilter = useTaskStore((state) => state.setStatusFilter);
  const setPriorityFilter = useTaskStore((state) => state.setPriorityFilter);
  const setSortBy = useTaskStore((state) => state.setSortBy);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => { initialize(initialTasks); }, [initialTasks, initialize]);

  const displayedTasks = useMemo(() => {
    return tasks
      .filter((task) => statusFilter === "all" || (statusFilter === "completed" ? task.completed : !task.completed))
      .filter((task) => priorityFilter === "all" || task.priority === priorityFilter)
      .sort((a, b) => {
        if (sortBy === "dueDate") return (a.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER) - (b.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER);
        if (sortBy === "priority") return ["high", "medium", "low"].indexOf(a.priority) - ["high", "medium", "low"].indexOf(b.priority);
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
  }, [tasks, statusFilter, priorityFilter, sortBy]);

  return (
    <section aria-labelledby="tasks-heading" className="px-6 py-8 sm:px-10 sm:py-10">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Your workspace</p><h2 className="mt-1 font-heading text-xl font-semibold tracking-tight" id="tasks-heading">Tasks</h2></div>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{displayedTasks.length} {displayedTasks.length === 1 ? "task" : "tasks"}</span>
      </div>
      <div className="mb-5 grid gap-2 sm:grid-cols-3">
        <select aria-label="Filter by status" className="h-9 rounded-4xl border border-input bg-background px-3 text-sm" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}><option value="all">All statuses</option><option value="open">Open</option><option value="completed">Completed</option></select>
        <select aria-label="Filter by priority" className="h-9 rounded-4xl border border-input bg-background px-3 text-sm" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value as typeof priorityFilter)}><option value="all">All priorities</option><option value="high">High priority</option><option value="medium">Medium priority</option><option value="low">Low priority</option></select>
        <select aria-label="Sort tasks" className="h-9 rounded-4xl border border-input bg-background px-3 text-sm" value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)}><option value="createdAt">Sort by added</option><option value="dueDate">Sort by due date</option><option value="priority">Sort by priority</option></select>
      </div>
      {editingTask ? <div className="mb-5 rounded-2xl border border-primary/30 bg-primary/5 p-4"><p className="mb-3 text-sm font-medium">Edit task</p><TaskForm task={editingTask} onCancel={() => setEditingTask(null)} onSuccess={() => setEditingTask(null)} /></div> : null}
      {displayedTasks.length === 0 ? <div className="rounded-2xl border border-dashed border-border px-6 py-10 text-center"><Circle aria-hidden="true" className="mx-auto size-8 text-muted-foreground/50" /><p className="mt-3 text-sm font-medium">{tasks.length === 0 ? "No tasks yet" : "No matching tasks"}</p><p className="mt-1 text-sm text-muted-foreground">{tasks.length === 0 ? "Add a task above and it will appear here." : "Try changing your filters."}</p></div> : <ul className="divide-y divide-border overflow-visible rounded-2xl border border-border">{displayedTasks.map((task) => {
        const isPending = pendingTaskIds.has(task.id); const isMenuOpen = openMenuId === task.id;
        return <li className="relative flex items-center gap-3 bg-background px-4 py-4 first:rounded-t-2xl last:rounded-b-2xl sm:px-5" key={task.id}>
          <button aria-label={`${task.completed ? "Mark" : "Complete"} ${task.title}`} aria-pressed={task.completed} className="rounded-full text-muted-foreground outline-none transition hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-60" disabled={isPending} onClick={() => void toggleComplete(task.id)} type="button">{task.completed ? <CheckCircle2 aria-hidden="true" className="size-5 text-primary" /> : <Circle aria-hidden="true" className="size-5" />}</button>
          <div className="min-w-0 flex-1"><p className={`truncate text-sm font-medium ${task.completed ? "text-muted-foreground line-through" : ""}`}>{task.title}</p><p className="mt-1 text-xs text-muted-foreground">Added {formatDate(task.createdAt)}{task.dueDate ? ` · Due ${formatDate(task.dueDate)}` : ""}</p></div>
          <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${priorityStyles[task.priority]}`}>{task.priority}</span><span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">{task.completed ? "Complete" : "Open"}</span>
          <div className="relative"><button aria-expanded={isMenuOpen} aria-label={`Actions for ${task.title}`} className="flex size-8 items-center justify-center rounded-full text-muted-foreground outline-none transition hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-50" disabled={isPending} onClick={() => setOpenMenuId(isMenuOpen ? null : task.id)} type="button"><Ellipsis aria-hidden="true" className="size-4" /></button>{isMenuOpen ? <div className="absolute right-0 top-10 z-10 min-w-36 rounded-xl border border-border bg-background p-1 shadow-lg"><button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm outline-none hover:bg-muted" onClick={() => { setOpenMenuId(null); setEditingTask(task); }} type="button"><Pencil aria-hidden="true" className="size-4" />Edit</button><button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-destructive outline-none hover:bg-destructive/10" onClick={() => { setOpenMenuId(null); void deleteTask(task.id); }} type="button"><Trash2 aria-hidden="true" className="size-4" />Delete</button></div> : null}</div>
        </li>;
      })}</ul>}
    </section>
  );
}
