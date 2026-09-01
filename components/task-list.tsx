"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { useEffect } from "react";
import type { Task } from "@/db/schema";
import { useTaskStore } from "@/lib/task-store";

function formatCreatedAt(createdAt: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(createdAt);
}

export function TaskList({ tasks: initialTasks }: { tasks: Task[] }) {
  const tasks = useTaskStore((state) => state.tasks);
  const pendingTaskIds = useTaskStore((state) => state.pendingTaskIds);
  const initialize = useTaskStore((state) => state.initialize);
  const toggleComplete = useTaskStore((state) => state.toggleComplete);

  useEffect(() => {
    initialize(initialTasks);
  }, [initialTasks, initialize]);

  const displayedTasks = tasks.length === 0 && initialTasks.length > 0 ? initialTasks : tasks;

  return (
    <section aria-labelledby="tasks-heading" className="px-6 py-8 sm:px-10 sm:py-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Your workspace
          </p>
          <h2 className="mt-1 font-heading text-xl font-semibold tracking-tight" id="tasks-heading">
            Tasks
          </h2>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          {displayedTasks.length} {displayedTasks.length === 1 ? "task" : "tasks"}
        </span>
      </div>

      {displayedTasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-10 text-center">
          <Circle aria-hidden="true" className="mx-auto size-8 text-muted-foreground/50" />
          <p className="mt-3 text-sm font-medium">No tasks yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a task above and it will appear here.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {displayedTasks.map((task) => {
            const isPending = pendingTaskIds.has(task.id);

            return (
              <li className="flex items-center gap-4 bg-background px-4 py-4 sm:px-5" key={task.id}>
                <button
                  aria-label={`${task.completed ? "Mark" : "Complete"} ${task.title}`}
                  aria-pressed={task.completed}
                  className="rounded-full text-muted-foreground outline-none transition hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-wait disabled:opacity-60"
                  disabled={isPending}
                  onClick={() => void toggleComplete(task.id)}
                  type="button"
                >
                  {task.completed ? (
                    <CheckCircle2 aria-hidden="true" className="size-5 text-primary" />
                  ) : (
                    <Circle aria-hidden="true" className="size-5" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-medium ${task.completed ? "text-muted-foreground line-through" : ""}`}>
                    {task.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Added {formatCreatedAt(task.createdAt)}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {task.completed ? "Complete" : "Open"}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
