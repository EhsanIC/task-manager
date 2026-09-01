"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import type { Task } from "@/db/schema";
import { createTaskSchema, type CreateTaskInput } from "@/lib/validations/task";

type TaskFormProps = {
  task?: Task;
  onSuccess?: () => void;
  onCancel?: () => void;
};

function dateInputValue(date: Date | null) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export function TaskForm({ task, onSuccess, onCancel }: TaskFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditing = Boolean(task);
  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: task?.title ?? "",
      dueDate: dateInputValue(task?.dueDate ?? null),
      priority: task?.priority ?? "medium",
    },
  });

  useEffect(() => {
    form.reset({
      title: task?.title ?? "",
      dueDate: dateInputValue(task?.dueDate ?? null),
      priority: task?.priority ?? "medium",
    });
  }, [form, task]);

  async function onSubmit(_values: CreateTaskInput) {
    setSubmitError(null);
    const rawValues = form.getValues();
    console.log("[TaskForm] Raw form values:", rawValues);
    console.log("[TaskForm] dueDate type:", typeof rawValues.dueDate, "value:", rawValues.dueDate);
    try {
      const response = await fetch(isEditing ? `/api/tasks/${task!.id}` : "/api/tasks", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rawValues),
      });
      if (!response.ok) {
        const result: unknown = await response.json().catch(() => null);
        const message = typeof result === "object" && result !== null && "error" in result && typeof result.error === "string"
          ? result.error
          : isEditing ? "Unable to update the task." : "Unable to create the task.";
        throw new Error(message);
      }
      form.reset({ title: "", dueDate: "", priority: "medium" });
      router.refresh();
      onSuccess?.();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to save the task.");
    }
  }

  const titleError = form.formState.errors.title?.message;

  return (
    <form className="flex w-full flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div>
        <label className="sr-only" htmlFor="task-title">Task title</label>
        <input {...form.register("title")} aria-describedby={titleError ? "task-title-error" : undefined} aria-invalid={titleError ? "true" : "false"} className="h-10 w-full rounded-4xl border border-input bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30" id="task-title" placeholder="What needs to be done?" type="text" />
        {titleError ? <p className="mt-2 text-sm text-destructive" id="task-title-error">{titleError}</p> : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="relative">
          <label className="sr-only" htmlFor="task-due-date">Due date</label>
          <CalendarDays aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input {...form.register("dueDate")} className="h-10 w-full rounded-4xl border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30" id="task-due-date" type="date" />
        </div>
        <div>
          <label className="sr-only" htmlFor="task-priority">Priority</label>
          <select {...form.register("priority")} className="h-10 w-full rounded-4xl border border-input bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30" id="task-priority">
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <Button disabled={form.formState.isSubmitting} type="submit">{form.formState.isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Add task"}</Button>
        {isEditing ? <Button onClick={onCancel} type="button" variant="outline">Cancel</Button> : null}
      </div>
      {submitError ? <p aria-live="polite" className="text-sm text-destructive">{submitError}</p> : null}
    </form>
  );
}
